"use client";

import { useState } from "react";

type Stats = {
  posts: { total: number; pending: number; scheduled: number };
  tasks: { pending: number; inProgress: number };
  notifications: { unread: number };
  modules: { active: string[] };
};

type CompanyContext = {
  name?: string;
  sector?: string;
  tone?: string;
  city?: string;
};

type Props = {
  stats: Stats;
  companyContext?: CompanyContext;
};

export function InsightReport({ stats, companyContext }: Props) {
  const [report, setReport] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generateReport() {
    setIsGenerating(true);
    setReport("");

    const name = companyContext?.name ?? "tu negocio";
    const sector = companyContext?.sector ?? "negocio local";
    const city = companyContext?.city ? ` en ${companyContext.city}` : "";
    const modules = stats.modules.active.length
      ? stats.modules.active.join(", ")
      : "ninguno activo";

    const prompt = `Genera un informe mensual de rendimiento digital para ${name}, un negocio del sector ${sector}${city}.

Datos actuales de la plataforma AutonomIA:
- Publicaciones totales: ${stats.posts.total} (${stats.posts.pending} pendientes de aprobación, ${stats.posts.scheduled} programadas)
- Tareas: ${stats.tasks.pending} pendientes, ${stats.tasks.inProgress} en progreso
- Notificaciones sin leer: ${stats.notifications.unread}
- Módulos activos: ${modules}

Genera el informe con estas secciones:
1. **Resumen ejecutivo** (2-3 frases)
2. **Puntos fuertes** (2-3 puntos, basados en los datos)
3. **Áreas de mejora** (2-3 puntos concretos)
4. **Recomendaciones para el próximo mes** (3-4 acciones específicas y accionables)

Sé concreto, usa los números reales, habla en tono profesional pero cercano. Respuesta en español.`;

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
        setReport("Error al generar el informe. Inténtalo de nuevo.");
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
        setReport(buffer);
      }
    } catch {
      setReport("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function copyToClipboard() {
    await navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-4">
      {report ? (
        <div className="rounded-[2rem] border border-cyan-400/20 bg-cyan-500/10 p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-black text-cyan-300">Informe IA generado</p>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="rounded-xl border border-white/10 px-3 py-1.5 text-xs font-bold hover:bg-white/10"
              >
                {copied ? "¡Copiado!" : "Copiar"}
              </button>
              <button
                onClick={generateReport}
                disabled={isGenerating}
                className="rounded-xl bg-cyan-500/20 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/30 disabled:opacity-60"
              >
                ↻ Regenerar
              </button>
            </div>
          </div>

          <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-7 whitespace-pre-wrap">
            {report}
            {isGenerating && (
              <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-cyan-400" />
            )}
          </div>
        </div>
      ) : null}

      <button
        onClick={generateReport}
        disabled={isGenerating}
        className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-4 font-bold shadow-[0_0_35px_rgba(124,58,237,0.35)] disabled:opacity-60"
      >
        {isGenerating ? "Generando informe…" : report ? "✦ Regenerar informe mensual" : "✦ Generar informe mensual con IA"}
      </button>
    </div>
  );
}
