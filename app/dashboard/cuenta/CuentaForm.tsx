"use client";

import { useState, useTransition } from "react";
import { saveProfileFormAction } from "./actions";

type Props = {
  profileId: string;
  fullName: string;
  email: string;
  phone: string;
};

export function CuentaForm({ profileId, fullName, email, phone }: Props) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setSaved(false);
    setError(null);

    startTransition(async () => {
      const result = await saveProfileFormAction(formData);

      if (result.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(result.error ?? "Error al guardar.");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <input type="hidden" name="profileId" value={profileId} />

      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-bold text-slate-300">
            Nombre completo
          </label>
          <input
            name="fullName"
            defaultValue={fullName}
            placeholder="Tu nombre"
            className="w-full rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-4 text-white outline-none focus:border-violet-400"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-bold text-slate-300">
            Email
          </label>
          <input
            value={email}
            readOnly
            className="w-full cursor-not-allowed rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-4 text-slate-400 outline-none"
          />
          <p className="mt-1 text-xs text-slate-500">
            El email no se puede cambiar desde aquí.
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-bold text-slate-300">
            Teléfono
          </label>
          <input
            name="phone"
            defaultValue={phone}
            placeholder="+34 600 000 000"
            className="w-full rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-4 text-white outline-none focus:border-violet-400"
          />
        </div>
      </div>

      {error ? (
        <p className="rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-sm font-bold text-red-300">
          {error}
        </p>
      ) : null}

      {saved ? (
        <p className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm font-bold text-emerald-300">
          ✓ Datos guardados correctamente.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-4 font-bold disabled:opacity-60"
      >
        {isPending ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
