"use client";

import { useState } from "react";
import { createPostFormAction } from "@/lib/data/posts";

type SocialIAComposerProps = {
  companyId: string;
  canCreate: boolean;
  canMarkDemo: boolean;
};

const examplePost = {
  title: "Idea de publicación semanal",
  content:
    "Esta semana queremos compartir una novedad de nuestro negocio y recordar que seguimos atendiendo con el mismo cuidado de siempre.",
  channel: "both",
};

export function SocialIAComposer({
  companyId,
  canCreate,
  canMarkDemo,
}: SocialIAComposerProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [channel, setChannel] = useState("instagram");
  const [scheduledAt, setScheduledAt] = useState("");

  function fillExample() {
    setTitle(examplePost.title);
    setContent(examplePost.content);
    setChannel(examplePost.channel);
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

        <button
          type="button"
          onClick={fillExample}
          className="w-fit rounded-2xl border border-cyan-300/20 bg-cyan-500/10 px-5 py-3 text-sm font-bold text-cyan-100 hover:bg-cyan-500/20"
        >
          Generar ejemplo
        </button>
      </div>

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
            onChange={(event) => setTitle(event.target.value)}
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
          <textarea
            name="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            disabled={!canCreate}
            rows={5}
            required
            placeholder="Escribe el contenido de la publicación"
            className="w-full resize-none rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-4 text-white outline-none focus:border-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-300">
              Canal
            </label>
            <select
              name="channel"
              value={channel}
              onChange={(event) => setChannel(event.target.value)}
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
              onChange={(event) => setScheduledAt(event.target.value)}
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
