"use client";

import { useState } from "react";
import Link from "next/link";
import { ElenaAvatar } from "./ElenaAvatar";

const sampleMessages = [
  {
    from: "Elena IA",
    text: "Puedo ayudarte a elegir plan, preparar contenido o revisar próximos pasos.",
  },
  {
    from: "Tú",
    text: "Quiero mejorar mis publicaciones de esta semana.",
  },
  {
    from: "Elena IA",
    text: "Perfecto. Empezaría revisando SocialIA y preparando 2 ideas para Instagram y Facebook.",
  },
];

export default function ElenaWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-[calc(100vw-2.5rem)]">
      {isOpen ? (
        <section className="mb-4 w-[360px] max-w-full rounded-[2rem] border border-violet-100 bg-white/97 p-4 text-slate-950 shadow-[0_24px_70px_rgba(109,40,217,0.18)] backdrop-blur">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <ElenaAvatar size="md" showRing />
              <div>
                <p className="font-black">Elena IA</p>
                <p className="text-xs font-bold text-violet-600">
                  Asistente de AutonomIA
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 hover:bg-violet-50"
            >
              Cerrar
            </button>
          </div>

          {/* Messages */}
          <div className="mt-4 space-y-3">
            {sampleMessages.map((message) => (
              <div
                key={`${message.from}-${message.text}`}
                className={`rounded-2xl border p-3 text-sm leading-6 ${
                  message.from === "Tú"
                    ? "ml-8 border-violet-200 bg-violet-50 text-violet-900"
                    : "mr-8 border-slate-200 bg-[#F8FAFF] text-slate-700"
                }`}
              >
                <div className="mb-1 flex items-center gap-2">
                  {message.from === "Elena IA" ? (
                    <ElenaAvatar size="sm" />
                  ) : null}
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                    {message.from}
                  </p>
                </div>
                {message.text}
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-violet-100 bg-violet-50/60 p-3 text-sm text-slate-600">
            Chat visual preparado. La conexión real con IA se activará en una
            fase futura.
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/onboarding"
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 text-center text-sm font-black text-white hover:opacity-90"
            >
              Configurar demo
            </Link>
            <Link
              href="/dashboard/centro-ia"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-black text-slate-700 hover:bg-violet-50"
            >
              Abrir Centro IA
            </Link>
          </div>
        </section>
      ) : null}

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex items-center gap-3 rounded-[2rem] border border-violet-100 bg-white/97 px-4 py-3 text-left text-slate-950 shadow-[0_18px_50px_rgba(109,40,217,0.18)] backdrop-blur hover:bg-violet-50 transition-colors"
      >
        <ElenaAvatar size="md" showRing />
        <span>
          <span className="block text-sm font-black">Hola, soy Elena IA</span>
          <span className="block text-xs font-bold text-violet-600">
            Asistente inteligente
          </span>
        </span>
      </button>
    </div>
  );
}
