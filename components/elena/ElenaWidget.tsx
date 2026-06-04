"use client";

import { useState } from "react";
import Link from "next/link";

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
        <section className="mb-4 w-[360px] max-w-full rounded-[2rem] border border-cyan-400/30 bg-[#080d20]/95 p-4 text-white shadow-[0_0_70px_rgba(34,211,238,0.22)] backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 via-violet-300 to-fuchsia-300 text-2xl">
                👩‍💼
              </div>
              <div>
                <p className="font-black">Elena IA</p>
                <p className="text-xs font-bold text-cyan-200">
                  Asistente de AutonomIA
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-xl border border-white/10 px-3 py-2 text-sm font-bold text-slate-300 hover:bg-white/10"
            >
              Cerrar
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {sampleMessages.map((message) => (
              <div
                key={`${message.from}-${message.text}`}
                className={`rounded-2xl border p-3 text-sm leading-6 ${
                  message.from === "Tú"
                    ? "ml-8 border-violet-400/20 bg-violet-500/10 text-violet-50"
                    : "mr-8 border-white/10 bg-white/[0.04] text-slate-200"
                }`}
              >
                <p className="mb-1 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                  {message.from}
                </p>
                {message.text}
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-slate-400">
            Chat visual preparado. La conexión real con IA se activará en una
            fase futura.
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/onboarding"
              className="rounded-2xl bg-white px-4 py-3 text-center text-sm font-black text-slate-950 hover:bg-slate-200"
            >
              Configurar demo
            </Link>
            <Link
              href="/dashboard/centro-ia"
              className="rounded-2xl border border-white/10 px-4 py-3 text-center text-sm font-black text-slate-200 hover:bg-white/10"
            >
              Abrir Centro IA
            </Link>
          </div>
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex items-center gap-3 rounded-[2rem] border border-cyan-400/30 bg-[#080d20]/95 px-4 py-3 text-left text-white shadow-[0_0_55px_rgba(34,211,238,0.2)] backdrop-blur hover:bg-[#101735]"
      >
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 via-violet-300 to-fuchsia-300 text-2xl">
          👩‍💼
        </span>
        <span>
          <span className="block text-sm font-black">Hola, soy Elena IA</span>
          <span className="block text-xs font-bold text-cyan-200">
            Asistente inteligente
          </span>
        </span>
      </button>
    </div>
  );
}
