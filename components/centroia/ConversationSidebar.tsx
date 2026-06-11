import type { AiConversation } from "@/types/database";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "Ahora";
  if (minutes < 60) return `Hace ${minutes}m`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `Hace ${hours}h`;

  const days = Math.floor(hours / 24);

  return `Hace ${days}d`;
}

interface Props {
  conversations: AiConversation[];
}

export default function ConversationSidebar({ conversations }: Props) {
  return (
    <aside className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-black">Conversaciones</h2>

        <button className="rounded-xl bg-violet-500 px-3 py-2 text-xs font-bold hover:bg-violet-600">
          +
        </button>
      </div>

      <div className="space-y-3">
        {conversations.length > 0 ? (
          conversations.map((conv) => (
            <button
              key={conv.id}
              className="w-full rounded-2xl border border-white/10 bg-[#0b1024] p-4 text-left transition hover:border-violet-400/30 hover:bg-white/10"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-bold leading-5 line-clamp-2">{conv.title ?? "Conversación"}</p>
                <span className="shrink-0 text-[10px] text-slate-500">
                  {timeAgo(conv.updated_at)}
                </span>
              </div>

              {conv.module_key ? (
                <p className="mt-2 text-xs text-violet-300">{conv.module_key}</p>
              ) : null}
            </button>
          ))
        ) : (
          <p className="rounded-2xl border border-white/10 bg-[#0b1024] p-4 text-xs text-slate-400">
            Aún no hay conversaciones guardadas.
          </p>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
        <p className="text-sm font-bold text-emerald-300">IA Activa</p>

        <p className="mt-2 text-xs leading-5 text-slate-300">
          Preparada para ayudarte con publicaciones, reseñas, ventas, reservas y marketing.
        </p>
      </div>
    </aside>
  );
}
