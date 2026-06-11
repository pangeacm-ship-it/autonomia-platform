"use client";

import { useState } from "react";

type Review = {
  author: string;
  rating: number;
  date: string;
  text: string;
  status: string;
  sentiment: string;
};

type CompanyContext = {
  name?: string;
  sector?: string;
  tone?: string;
  city?: string;
};

type Props = {
  review: Review;
  companyContext?: CompanyContext;
};

export function ReviewResponseCard({ review, companyContext }: Props) {
  const [aiResponse, setAiResponse] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [approved, setApproved] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generateResponse() {
    setIsGenerating(true);
    setAiResponse("");
    setApproved(false);

    const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
    const sentiment = review.sentiment === "Negativa" ? "negativa" : review.sentiment === "Positiva" ? "positiva" : "neutra";

    const prompt = `Genera una respuesta profesional para la siguiente reseña de Google Business.

Reseña de ${review.author} (${stars} — ${review.rating}/5, valoración ${sentiment}):
"${review.text}"

Requisitos:
- Tono: ${companyContext?.tone ?? "cercano y profesional"}
- Negocio: ${companyContext?.name ?? "el negocio"}${companyContext?.city ? ` en ${companyContext.city}` : ""}
- Sector: ${companyContext?.sector ?? "negocio local"}
- Respuesta en español, corta (2-4 frases), natural, no genérica
- Si la valoración es negativa o neutra, reconoce el punto de mejora y ofrece solución
- Si es positiva, agradece específicamente lo que menciona
- No inventes hechos que no estén en la reseña
- Firma con el nombre del negocio al final

Solo devuelve el texto de la respuesta, nada más.`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          companyContext,
        }),
      });

      if (!res.ok || !res.body) {
        setAiResponse("Error al generar la respuesta. Inténtalo de nuevo.");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let firstChunk = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        let chunk = decoder.decode(value, { stream: true });

        if (firstChunk && chunk.startsWith("__conv:")) {
          const end = chunk.indexOf("__", 7);
          if (end !== -1) chunk = chunk.slice(end + 2);
          firstChunk = false;
        } else {
          firstChunk = false;
        }

        buffer += chunk;
        setAiResponse(buffer);
      }
    } catch {
      setAiResponse("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function copyToClipboard() {
    if (!aiResponse) return;
    await navigator.clipboard.writeText(aiResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const sentimentColor =
    review.sentiment === "Negativa"
      ? "bg-red-500/20 text-red-300"
      : "bg-emerald-500/20 text-emerald-300";

  return (
    <article className="rounded-3xl border border-white/10 bg-[#0b1024] p-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-black">{review.author}</h3>
            <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-bold text-yellow-300">
              {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
            </span>
            <span className="text-xs text-slate-500">{review.date}</span>
          </div>
          <p className="mt-4 leading-7 text-slate-300">"{review.text}"</p>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
            review.status === "Respondida"
              ? "bg-emerald-500/20 text-emerald-300"
              : review.status === "Requiere revisión"
              ? "bg-red-500/20 text-red-300"
              : "bg-amber-500/20 text-amber-300"
          }`}
        >
          {review.status}
        </span>
      </div>

      {/* Análisis IA */}
      <div className="mt-5 rounded-2xl border border-violet-400/20 bg-violet-500/10 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-bold text-violet-300">
            Análisis IA
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${sentimentColor}`}>
            {review.sentiment}
          </span>
        </div>

        {review.sentiment === "Negativa" ? (
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <p>⚠ Riesgo reputacional medio</p>
            <p>• Tiempo de espera elevado</p>
            <p>• Posible mejora en atención al cliente</p>
          </div>
        ) : (
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <p>✓ Cliente satisfecho</p>
            <p>✓ Destaca atención recibida</p>
            <p>✓ Posible cliente recurrente</p>
          </div>
        )}
      </div>

      {/* Respuesta IA */}
      <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-black text-emerald-300">
            Respuesta sugerida por IA
          </p>

          <button
            onClick={generateResponse}
            disabled={isGenerating}
            className="rounded-xl bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30 disabled:opacity-60"
          >
            {isGenerating ? "Generando…" : aiResponse ? "↻ Regenerar" : "✦ Generar con IA"}
          </button>
        </div>

        {aiResponse ? (
          <p className="text-sm leading-6 text-slate-300 whitespace-pre-wrap">
            {aiResponse}
            {isGenerating && (
              <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-emerald-400" />
            )}
          </p>
        ) : (
          <p className="text-sm text-slate-500 italic">
            Haz clic en "Generar con IA" para crear una respuesta personalizada basada en el tono y sector de tu negocio.
          </p>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {aiResponse && !isGenerating ? (
          <>
            <button
              onClick={() => setApproved(true)}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition-colors ${
                approved
                  ? "bg-emerald-500/30 text-emerald-200"
                  : "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
              }`}
            >
              {approved ? "✓ Aprobada" : "Aprobar respuesta"}
            </button>

            <button
              onClick={copyToClipboard}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold hover:bg-white/10"
            >
              {copied ? "¡Copiado!" : "Copiar"}
            </button>
          </>
        ) : null}

        <button className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold hover:bg-white/10">
          Editar
        </button>

        <button className="rounded-xl bg-red-500/10 px-4 py-2 text-sm font-bold text-red-300 hover:bg-red-500/20">
          Descartar
        </button>
      </div>
    </article>
  );
}
