"use client";

import { useState } from "react";

type Lead = {
  name: string;
  source: string;
  interest: string;
  status: string;
  time: string;
  priority: string;
};

type CompanyContext = {
  name?: string;
  sector?: string;
  tone?: string;
  city?: string;
};

type Props = {
  lead: Lead;
  companyContext?: CompanyContext;
};

export function LeadResponseCard({ lead, companyContext }: Props) {
  const [message, setMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generateMessage() {
    setIsGenerating(true);
    setMessage("");

    const businessName = companyContext?.name ?? "el negocio";
    const sector = companyContext?.sector ?? "negocio local";
    const city = companyContext?.city ? ` en ${companyContext.city}` : "";
    const tone = companyContext?.tone ?? "cercano y profesional";

    const prompt = `Genera un mensaje de seguimiento para un lead potencial de ${businessName}, negocio del sector ${sector}${city}.

Lead: ${lead.name}
Fuente: ${lead.source}
Interés mostrado: ${lead.interest}
Estado actual: ${lead.status}
Prioridad: ${lead.priority}

Requisitos del mensaje:
- Tono: ${tone}
- Canal: mensaje directo (WhatsApp o email)
- Corto (3-5 frases), personalizado con su nombre
- Responde directamente a lo que pide
- Incluye una llamada a la acción clara (reservar, llamar, volver a contactar)
- Natural y sin jerga corporativa
- Finaliza con el nombre del negocio

Solo devuelve el mensaje, nada más.`;

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
        setMessage("Error al generar el mensaje. Inténtalo de nuevo.");
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
        setMessage(buffer);
      }
    } catch {
      setMessage("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function copyToClipboard() {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const priorityClass =
    lead.priority === "Alta"
      ? "bg-red-500/20 text-red-300"
      : lead.priority === "Media"
      ? "bg-amber-500/20 text-amber-300"
      : "bg-emerald-500/20 text-emerald-300";

  const statusClass =
    lead.status === "Convertido"
      ? "bg-emerald-500/20 text-emerald-300"
      : lead.status === "En seguimiento"
      ? "bg-amber-500/20 text-amber-300"
      : "bg-pink-500/20 text-pink-300";

  return (
    <article className="rounded-3xl border border-white/10 bg-[#0b1024] p-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-black">{lead.name}</h3>
            <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-bold text-violet-300">
              {lead.source}
            </span>
            <span className="text-xs text-slate-500">{lead.time}</span>
          </div>
          <p className="mt-4 leading-7 text-slate-300">{lead.interest}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${priorityClass}`}>
            {lead.priority}
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass}`}>
            {lead.status}
          </span>
        </div>
      </div>

      {/* Mensaje IA */}
      <div className="mt-5 rounded-2xl border border-pink-400/20 bg-pink-500/10 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-black text-pink-300">Mensaje de seguimiento IA</p>

          <button
            onClick={generateMessage}
            disabled={isGenerating}
            className="rounded-xl bg-pink-500/20 px-3 py-1.5 text-xs font-bold text-pink-300 hover:bg-pink-500/30 disabled:opacity-60"
          >
            {isGenerating ? "Generando…" : message ? "↻ Regenerar" : "✦ Generar mensaje"}
          </button>
        </div>

        {message ? (
          <p className="text-sm leading-6 text-slate-300 whitespace-pre-wrap">
            {message}
            {isGenerating && (
              <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-pink-400" />
            )}
          </p>
        ) : (
          <p className="text-sm text-slate-500 italic">
            Genera un mensaje personalizado listo para enviar a este lead.
          </p>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {message && !isGenerating ? (
          <button
            onClick={copyToClipboard}
            className="rounded-xl bg-emerald-500/20 px-4 py-2 text-sm font-bold text-emerald-300 hover:bg-emerald-500/30"
          >
            {copied ? "¡Copiado!" : "Copiar mensaje"}
          </button>
        ) : null}

        <button className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold hover:bg-white/10">
          Marcar contactado
        </button>

        <button className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold hover:bg-white/10">
          Crear seguimiento
        </button>

        <button className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold hover:bg-white/10">
          Convertir en reserva
        </button>
      </div>
    </article>
  );
}
