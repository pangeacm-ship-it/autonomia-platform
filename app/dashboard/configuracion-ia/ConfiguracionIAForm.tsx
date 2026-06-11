"use client";

import { useTransition, useState } from "react";
import { saveAiSettingsAction } from "./actions";
import type { CompanyAiSettings } from "@/types/database";

const tones = ["Cercano", "Profesional", "Premium", "Divertido", "Tradicional", "Moderno"];
const toneValues: Record<string, string> = {
  Cercano: "friendly",
  Profesional: "professional",
  Premium: "premium",
  Divertido: "fun",
  Tradicional: "traditional",
  Moderno: "modern",
};
const toneLabels: Record<string, string> = Object.fromEntries(
  Object.entries(toneValues).map(([k, v]) => [v, k])
);

const goals = [
  { label: "Conseguir reservas", value: "reservas" },
  { label: "Conseguir ventas", value: "ventas" },
  { label: "Conseguir llamadas", value: "llamadas" },
  { label: "Conseguir visitas", value: "visitas" },
  { label: "Mejorar reputación", value: "reputacion" },
  { label: "Captar leads", value: "leads" },
];

type Props = {
  companyId: string;
  settings: CompanyAiSettings | null;
};

export function ConfiguracionIAForm({ companyId, settings }: Props) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [tone, setTone] = useState(
    toneLabels[settings?.tone ?? ""] ?? "Cercano"
  );
  const [goal, setGoal] = useState(settings?.main_goal ?? "reservas");
  const [approvalRequired, setApprovalRequired] = useState(
    settings?.approval_required ?? true
  );
  const [automationLevel, setAutomationLevel] = useState(
    settings?.automation_level ?? "assisted"
  );
  const [customInstructions, setCustomInstructions] = useState(
    settings?.custom_instructions ?? ""
  );

  function handleSave() {
    setSaved(false);
    setError(null);

    startTransition(async () => {
      const result = await saveAiSettingsAction({
        companyId,
        tone: toneValues[tone] ?? "friendly",
        main_goal: goal,
        custom_instructions: customInstructions || null,
        automation_level: automationLevel,
        approval_required: approvalRequired,
      });

      if (result.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(result.error ?? "Error al guardar.");
      }
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      <div className="space-y-6">
        {/* Tono */}
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
          <h2 className="text-2xl font-black">Tono de comunicación</h2>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {tones.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTone(t)}
                className={`rounded-2xl border p-4 text-left font-bold transition ${
                  tone === t
                    ? "border-violet-400 bg-violet-500/10 text-violet-200"
                    : "border-white/10 bg-[#0b1024] hover:border-white/20"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Objetivo */}
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
          <h2 className="text-2xl font-black">Objetivo principal</h2>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {goals.map((g) => (
              <button
                key={g.value}
                type="button"
                onClick={() => setGoal(g.value)}
                className={`rounded-2xl border p-4 text-left font-bold transition ${
                  goal === g.value
                    ? "border-emerald-400 bg-emerald-500/10 text-emerald-200"
                    : "border-white/10 bg-[#0b1024] hover:border-white/20"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Automatización */}
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
          <h2 className="text-2xl font-black">Nivel de automatización</h2>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {[
              { value: "assisted", label: "Asistido", desc: "Revisión manual de todo" },
              { value: "semi_auto", label: "Semi-automático", desc: "Aprobación solo de lo importante" },
              { value: "auto", label: "Automático", desc: "IA actúa sin revisión" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setAutomationLevel(opt.value as CompanyAiSettings["automation_level"])}
                className={`rounded-2xl border p-4 text-left transition ${
                  automationLevel === opt.value
                    ? "border-blue-400 bg-blue-500/10"
                    : "border-white/10 bg-[#0b1024] hover:border-white/20"
                }`}
              >
                <p className="font-bold">{opt.label}</p>
                <p className="mt-1 text-xs text-slate-400">{opt.desc}</p>
              </button>
            ))}
          </div>

          <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-[#0b1024] p-4">
            <input
              type="checkbox"
              checked={approvalRequired}
              onChange={(e) => setApprovalRequired(e.target.checked)}
              className="h-5 w-5"
            />
            <span className="font-medium">Revisar publicaciones antes de publicar</span>
          </label>
        </div>

        {/* Instrucciones personalizadas */}
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
          <h2 className="text-2xl font-black">Instrucciones personalizadas</h2>
          <p className="mt-2 text-sm text-slate-400">
            Describe tu negocio, servicios clave, público o cualquier instrucción especial para la IA.
          </p>

          <textarea
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            rows={4}
            placeholder="Ej: Somos una peluquería canina en Madrid especializada en razas pequeñas. Atendemos solo con cita previa."
            className="mt-4 w-full resize-none rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-4 text-white outline-none placeholder:text-slate-600 focus:border-violet-400"
          />
        </div>
      </div>

      {/* Sidebar */}
      <aside className="space-y-6">
        <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-6">
          <h3 className="text-xl font-black text-emerald-300">Configuración actual</h3>

          <div className="mt-5 space-y-3 text-sm text-slate-300">
            <p>✓ Tono: <span className="font-bold text-white">{tone}</span></p>
            <p>✓ Objetivo: <span className="font-bold text-white">{goals.find(g => g.value === goal)?.label ?? goal}</span></p>
            <p>✓ Automatización: <span className="font-bold text-white">
              {automationLevel === "assisted" ? "Asistido" : automationLevel === "semi_auto" ? "Semi-automático" : "Automático"}
            </span></p>
            <p>✓ Revisión manual: <span className="font-bold text-white">{approvalRequired ? "Activada" : "Desactivada"}</span></p>
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm font-bold text-red-300">
            {error}
          </div>
        ) : null}

        {saved ? (
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm font-bold text-emerald-300">
            ✓ Configuración guardada correctamente.
          </div>
        ) : null}

        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-4 font-bold shadow-[0_0_35px_rgba(124,58,237,0.35)] disabled:opacity-60"
        >
          {isPending ? "Guardando..." : "Guardar configuración"}
        </button>
      </aside>
    </div>
  );
}
