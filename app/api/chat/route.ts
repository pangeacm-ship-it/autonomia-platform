import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createConversation, saveMessage } from "@/lib/data/ai-chat";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

type MessageParam = {
  role: "user" | "assistant";
  content: string;
};

type RequestBody = {
  messages: MessageParam[];
  conversationId?: string | null;
  companyId?: string | null;
  companyContext?: {
    name?: string;
    sector?: string;
    tone?: string;
    mainServices?: string;
    targetAudience?: string;
    city?: string;
  };
};

function buildSystemPrompt(context: RequestBody["companyContext"]) {
  const name = context?.name ?? "este negocio";
  const sector = context?.sector ?? "negocio local";
  const tone = context?.tone ?? "cercano y profesional";
  const services = context?.mainServices ?? "";
  const audience = context?.targetAudience ?? "";
  const city = context?.city ?? "";

  return `Eres el asistente IA de AutonomIA, una plataforma SaaS para negocios locales españoles.

Estás ayudando a ${name}, un negocio del sector ${sector}${city ? ` en ${city}` : ""}.
${services ? `Servicios principales: ${services}.` : ""}
${audience ? `Público objetivo: ${audience}.` : ""}
Tono de comunicación preferido: ${tone}.

Tu función es ayudar con:
- Crear publicaciones para redes sociales (Instagram, Facebook)
- Generar copys y textos de marketing
- Sugerir ideas de contenido y campañas
- Responder reseñas de clientes
- Estrategias para captar leads y reservas
- Recomendaciones para mejorar la presencia digital del negocio

Responde siempre en español. Sé concreto, práctico y adaptado al negocio local español.
Cuando generes publicaciones, incluye el texto listo para copiar y pegar.
Mantén respuestas claras y sin tecnicismos innecesarios.`;
}

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "La IA no está configurada. Añade ANTHROPIC_API_KEY al entorno." },
      { status: 503 }
    );
  }

  const supabase = await createSupabaseServerClient();

  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No autenticado." }, { status: 401 });
    }
  }

  let body: RequestBody;

  try {
    body = await request.json() as RequestBody;
  } catch {
    return NextResponse.json({ error: "Petición inválida." }, { status: 400 });
  }

  const { messages, companyContext, conversationId: existingConversationId, companyId } = body;

  if (!messages?.length) {
    return NextResponse.json({ error: "Sin mensajes." }, { status: 400 });
  }

  const systemPrompt = buildSystemPrompt(companyContext);
  const lastUserMessage = messages[messages.length - 1];

  // Resolve or create conversation for persistence
  let conversationId = existingConversationId ?? null;

  if (companyId && !conversationId && lastUserMessage?.role === "user") {
    const title = lastUserMessage.content.slice(0, 60);

    conversationId = await createConversation(companyId, title);
  }

  // Save the user message if this is the first one in the conversation
  if (conversationId && companyId && lastUserMessage?.role === "user") {
    await saveMessage({
      conversationId,
      companyId,
      role: "user",
      content: lastUserMessage.content,
    });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // Send conversationId as first chunk so client can store it
      if (conversationId) {
        controller.enqueue(encoder.encode(`__conv:${conversationId}__`));
      }

      try {
        const anthropicStream = await client.messages.stream({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1024,
          system: systemPrompt,
          messages,
        });

        let fullResponse = "";

        for await (const chunk of anthropicStream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
            fullResponse += chunk.delta.text;
          }
        }
        // Save assistant response
        if (conversationId && companyId && fullResponse) {
          await saveMessage({
            conversationId,
            companyId,
            role: "assistant",
            content: fullResponse,
          });
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Error del servidor IA.";
        controller.enqueue(encoder.encode(`\n\n[Error: ${message}]`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
    },
  });
}
