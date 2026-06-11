"use client";

import { useState, useTransition } from "react";
import { createPostFormAction } from "@/lib/data/posts";

type SocialIAComposerProps = {
  companyId: string;
  canCreate: boolean;
  canMarkDemo: boolean;
  companyContext?: {
    name?: string;
    sector?: string;
    tone?: string;
    mainServices?: string;
    city?: string;
  };
};

const examplePost = {
  title: "Idea de publicación semanal",
  content:
    "Esta semana queremos compartir una novedad de nuestro negocio y recordar que seguimos atendiendo con el mismo cuidado de siempre.",
  channel: "both",
};

const aiPrompts = [
  "Crea una publicación para Instagram sobre una novedad del negocio",
  "Genera un copy de promoción para fin de semana",
  "Escribe una publicación para presentar el equipo",
  "Crea una publicación con un consejo útil para clientes",
];

export function SocialIAComposer({
  companyId,
  canCreate,
  canMarkDemo,
  companyContext,
}: SocialIAComposerProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [channel, setChannel] = useState("instagram");
  const [scheduledAt, setScheduledAt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [, startTransition] = useTransition();

  function fillExample() {
    setTitle(examplePost.title);
    setContent(examplePost.content);
    setChannel(examplePost.channel);
  }

  async function generateWithAI(prompt: string) {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setContent("");

    const channelLabel =
      channel === "both"
        ? "Instagram y Facebook"
        : channel === "instagram"
          ? "Instagram"
          : "Facebook";

    const fullPrompt = `${prompt}. Canal: ${channelLabel}. Incluye emojis apropiados y un call to action. Solo devuelve el texto de la publicación, sin explicaciones adicionales.`;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: fullPrompt }],
          companyContext,
        }),
      });

      if (!response.ok || !response.body) {
        setContent("Error al generar el contenido. Inténtalo de nuevo.");
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        accumulated += decoder.decode(value, { stream: true });
        setContent(accumulated);
      }

      if (!title) {
        startTransition(() => {
          setTitle(prompt.slice(0, 60));
        });
      }
    } catch {
      setContent("No se pudo conectar con la IA. Inténtalo de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h2 className="text-2xl font-black">Nueva publicación</h2>
          <p className="mt-2 text-sm text-slate-400">
            Crea un borrador o envíalo a aprobación dentro de AutonomIA.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowAiPanel(!showAiPanel)}
            className="w-fit rounded-2xl border border-violet-400/30 bg-violet-500/10 px-5 py-3 text-sm font-bold text-violet-200 hover:bg-violet-500/20"
          >
            ✦ Generar con IA
          </button>

          <button
            type="button"
            onClick={fillExample}
            className="w-fit rounded-2xl border border-cyan-300/20 bg-cyan-500/10 px-5 py-3 text-sm font-bold text-cyan-100 hover:bg-cyan-500/20"
          >
            Ejemplo
          </button>
        </div>
      </div>

      {/* Panel IA */}
      {showAiPanel ? (
        <div className="mt-5 rounded-2xl border border-violet-400/20 bg-violet-500/10 p-5">
          <p className="mb-3 text-sm font-black text-violet-200">
            ✦ ¿Sobre qué quieres publicar?
          </p>

          <div className="mb-3 flex flex-wrap gap-2">
            {aiPrompts.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => void generateWithAI(p)}
                disabled={isGenerating}
                className="rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-xs font-bold text-violet-200 hover:bg-violet-500/20 disabled:opacity-50"
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void generateWithAI(aiPrompt);
              }}
              placeholder="O describe tú mismo qué quieres publicar..."
              disabled={isGenerating}
              className="flex-1 rounded-2xl border border-white/10 bg-[#050816] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-400 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => void generateWithAI(aiPrompt)}
              disabled={isGenerating || !aiPrompt.trim()}
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-bold disabled:opacity-40"
            >
              {isGenerating ? "Generando..." : "Generar"}
            </button>
          </div>
        </div>
      ) : null}

      {!canCreate ? (
        <p className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm font-bold text-amber-100">
          Has alcanzado el límite semanal del plan Gratuito.
        </p>
      ) : null}

      <form action={createPostFormAction} className="mt-6 grid gap-5">
        <input type="hidden" name="companyId" value={companyId} />

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-300">
            Título
          </label>
          <input
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!canCreate}
            required
            placeholder="Ej. Promoción semanal"
            className="w-full rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-4 text-white outline-none focus:border-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-300">
            Contenido
          </label>
          <div className="relative">
            <textarea
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={!canCreate}
              rows={5}
              required
              placeholder="Escribe el contenido o usa IA para generarlo"
              className="w-full resize-none rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-4 text-white outline-none focus:border-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
            />
            {isGenerating ? (
              <span className="absolute bottom-4 right-4 text-xs font-bold text-violet-300 animate-pulse">
                IA escribiendo...
              </span>
            ) : null}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-300">
              Canal
            </label>
            <select
              name="channel"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              disabled={!canCreate}
              className="w-full rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-4 text-white outline-none focus:border-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="both">Ambos</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-300">
              Fecha programada opcional
            </label>
            <input
              type="datetime-local"
              name="scheduledAt"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              disabled={!canCreate}
              className="w-full rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-4 text-white outline-none focus:border-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>

        {canMarkDemo ? (
          <label className="flex items-center gap-3 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm font-bold text-amber-100">
            <input
              type="checkbox"
              name="isDemo"
              disabled={!canCreate}
              className="h-4 w-4"
            />
            Publicación de prueba/demo
          </label>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            name="status"
            value="draft"
            disabled={!canCreate}
            className="rounded-2xl border border-white/10 px-6 py-4 font-bold hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Guardar borrador
          </button>
          <button
            type="submit"
            name="status"
            value="pending_approval"
            disabled={!canCreate}
            className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-4 font-bold shadow-[0_0_35px_rgba(124,58,237,0.25)] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Enviar aprobación
          </button>
        </div>
      </form>
    </section>
  );
}
