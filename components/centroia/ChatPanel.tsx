"use client";

interface Message {
  role: "user" | "assistant";
  text: string;
}

interface Props {
  messages: Message[];
  quickPrompts: string[];
}

export default function ChatPanel({
  messages,
  quickPrompts,
}: Props) {
  return (
    <div className="flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04]">
      <div className="border-b border-white/10 bg-[#0b1024] p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black">
              Asistente AutonomIA
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Marketing · Redes Sociales · Ventas · Reseñas · Reservas
            </p>
          </div>

          <span className="rounded-full bg-emerald-500/20 px-4 py-2 text-xs font-black text-emerald-300">
            Online
          </span>
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[92%] rounded-3xl p-4 sm:max-w-[80%] sm:p-5 ${
                message.role === "user"
                  ? "bg-gradient-to-r from-blue-600 to-violet-600"
                  : "border border-white/10 bg-[#0b1024]"
              }`}
            >
              <p className="text-sm leading-7">
                {message.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 bg-[#0b1024] p-5">
        <div className="mb-4 flex flex-wrap gap-2">
          {quickPrompts.slice(0, 4).map((prompt) => (
            <button
              key={prompt}
              className="rounded-full border border-white/10 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-white/10"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <input
            placeholder="Escribe aquí tu petición..."
            className="flex-1 rounded-2xl border border-white/10 bg-[#050816] px-5 py-4 outline-none placeholder:text-slate-600 focus:border-violet-400"
          />

          <button className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-4 font-bold">
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
