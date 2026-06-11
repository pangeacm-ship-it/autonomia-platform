"use client";

import { useTransition, useState } from "react";
import { saveCompanyFormAction } from "./actions";

type Sector = { key: string; name: string; id?: string };

type Props = {
  companyId: string;
  name: string;
  city: string;
  ownerEmail: string;
  industry: string;
  sectorId: string | null;
  businessSectors: Sector[];
};

export function EmpresaForm({
  companyId,
  name,
  city,
  ownerEmail,
  industry,
  sectorId,
  businessSectors,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setSaved(false);
    setError(null);

    startTransition(async () => {
      const result = await saveCompanyFormAction(formData);

      if (result.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(result.error ?? "Error al guardar.");
      }
    });
  }

  return (
    <form action={handleSubmit}>
      <input type="hidden" name="companyId" value={companyId} />

      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-bold text-slate-300">
            Nombre comercial
          </label>
          <input
            name="name"
            required
            defaultValue={name}
            className="w-full rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-4 text-white outline-none focus:border-violet-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-300">
            Sector
          </label>
          <select
            name="sectorId"
            defaultValue={sectorId ?? ""}
            className="w-full rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-4 text-white outline-none focus:border-violet-400"
            onChange={(e) => {
              const selected = businessSectors.find((s) => s.id === e.target.value || s.key === e.target.value);
              const industryInput = e.currentTarget.form?.elements.namedItem("industry") as HTMLInputElement | null;

              if (industryInput && selected) industryInput.value = selected.name;
            }}
          >
            <option value="">Sin sector</option>
            {businessSectors.map((sector) => (
              <option key={sector.key} value={sector.id ?? sector.key}>
                {sector.name}
              </option>
            ))}
          </select>
          <input type="hidden" name="industry" defaultValue={industry} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-300">
            Ciudad
          </label>
          <input
            name="city"
            defaultValue={city}
            placeholder="Ej: Madrid"
            className="w-full rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-4 text-white outline-none focus:border-violet-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-300">
            Email de contacto
          </label>
          <input
            name="ownerEmail"
            type="email"
            defaultValue={ownerEmail}
            className="w-full rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-4 text-white outline-none focus:border-violet-400"
          />
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-sm font-bold text-red-300">
          {error}
        </p>
      ) : null}

      {saved ? (
        <p className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm font-bold text-emerald-300">
          ✓ Datos guardados correctamente.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="mt-6 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 font-bold shadow-[0_0_35px_rgba(124,58,237,0.35)] disabled:opacity-60"
      >
        {isPending ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
