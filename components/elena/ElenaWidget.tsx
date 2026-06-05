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
        <section className="mb-4 w-[360px] max-w-full rounded-[2rem] border border-blue-100 bg-white/95 p-4 text-slate-950 shadow-[0_24px_70px_rgba(30,41,59,0.16)] backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 via-violet-300 to-fuchsia-300 text-2xl">
                👩‍💼
              </div>
              <div>
                <p className="font-black">Elena IA</p>
                <p className="text-xs font-bold text-blue-700">
                  Asistente de AutonomIA
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 hover:bg-blue-50"
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
                    ? "ml-8 border-violet-200 bg-violet-50 text-violet-900"
                    : "mr-8 border-slate-200 bg-[#F8FAFF] text-slate-700"
                }`}
              >
                <p className="mb-1 text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                  {message.from}
                </p>
                {message.text}
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-[#F8FAFF] p-3 text-sm text-slate-600">
            Chat visual preparado. La conexión real con IA se activará en una
            fase futura.
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/onboarding"
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 text-center text-sm font-black text-white hover:opacity-90"
            >
              Configurar demo
            </Link>
            <Link
              href="/dashboard/centro-ia"
              className="rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-black text-slate-700 hover:bg-blue-50"
            >
              Abrir Centro IA
            </Link>
          </div>
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex items-center gap-3 rounded-[2rem] border border-blue-100 bg-white/95 px-4 py-3 text-left text-slate-950 shadow-[0_18px_50px_rgba(30,41,59,0.16)] backdrop-blur hover:bg-blue-50"
      >
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 via-violet-300 to-fuchsia-300 text-2xl">
          👩‍💼
        </span>
        <span>
          <span className="block text-sm font-black">Hola, soy Elena IA</span>
          <span className="block text-xs font-bold text-blue-700">
            Asistente inteligente
          </span>
        </span>
      </button>
    </div>
  );
}
