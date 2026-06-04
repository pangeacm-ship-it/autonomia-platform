type Conversation = {
  id: string;
  title: string;
  time: string;
  module: string;
};

interface Props {
  conversations: Conversation[];
}

export default function ConversationSidebar({
  conversations,
}: Props) {
  return (
    <aside className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-black">
          Conversaciones
        </h2>

        <button className="rounded-xl bg-violet-500 px-3 py-2 text-xs font-bold">
          +
        </button>
      </div>

      <div className="space-y-3">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            className="w-full rounded-2xl border border-white/10 bg-[#0b1024] p-4 text-left transition hover:border-violet-400/30 hover:bg-white/10"
          >
            <div className="flex items-center justify-between">
              <p className="font-bold">{conversation.title}</p>

              <span className="text-[10px] text-slate-500">
                {conversation.time}
              </span>
            </div>

            <p className="mt-2 text-xs text-violet-300">
              {conversation.module}
            </p>
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
        <p className="text-sm font-bold text-emerald-300">
          IA Activa
        </p>

        <p className="mt-2 text-xs leading-5 text-slate-300">
          Preparada para ayudarte con publicaciones, reseñas, ventas,
          reservas y marketing.
        </p>
      </div>
    </aside>
  );
}