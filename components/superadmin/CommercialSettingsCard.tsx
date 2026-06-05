"use client";

import { useState } from "react";
import { founderOffer } from "@/lib/commercial-plans";

const initialPrices = {
  inicio: founderOffer.launchPrices.inicio.replace("€", ""),
  crecimiento: founderOffer.launchPrices.crecimiento.replace("€", ""),
  localIa: founderOffer.launchPrices.localIa.replace("€", ""),
};

const commercialPlans = [
  {
    key: "inicio",
    name: "Inicio",
    normalPrice: "100€",
    label: "Precio lanzamiento Inicio",
  },
  {
    key: "crecimiento",
    name: "Crecimiento",
    normalPrice: "150€",
    label: "Precio lanzamiento Crecimiento",
  },
  {
    key: "localIa",
    name: "Local IA",
    normalPrice: "300€",
    label: "Precio lanzamiento Local IA",
  },
] as const;

export default function CommercialSettingsCard() {
  const [isActive, setIsActive] = useState(founderOffer.isActive);
  const [prices, setPrices] = useState(initialPrices);

  return (
    <section className="rounded-[2rem] border border-emerald-100 bg-emerald-50 p-6 shadow-[0_18px_50px_rgba(30,41,59,0.05)]">
      <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-700">
            Configuración Comercial
          </p>
          <h2 className="mt-3 text-2xl font-black text-slate-950">
            Oferta Fundadores
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Gestiona cómo se presentan los precios comerciales. Los clientes ya
            marcados como fundadores mantienen sus condiciones aunque la oferta
            se desactive.
          </p>
        </div>

        <label className="flex w-fit items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(event) => setIsActive(event.target.checked)}
            className="h-4 w-4 accent-emerald-500"
          />
          Oferta Fundadores Activa
        </label>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {commercialPlans.map((plan) => (
          <article
            key={plan.key}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h3 className="text-xl font-black text-slate-950">{plan.name}</h3>
            <p className="mt-2 text-sm text-slate-500">
              Precio normal:{" "}
              <span className="font-black text-slate-950">
                {plan.normalPrice}/mes
              </span>
            </p>

            <label className="mt-5 grid gap-2 text-sm font-bold text-slate-700">
              {plan.label}
              <div className="flex items-center rounded-2xl border border-slate-200 bg-[#F8FAFF] px-4 py-3">
                <input
                  inputMode="numeric"
                  value={prices[plan.key]}
                  onChange={(event) =>
                    setPrices((current) => ({
                      ...current,
                      [plan.key]: event.target.value,
                    }))
                  }
                  disabled={!isActive}
                  className="min-w-0 flex-1 bg-transparent text-slate-950 outline-none disabled:opacity-50"
                />
                <span className="text-slate-500">€/mes</span>
              </div>
            </label>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-[#F8FAFF] p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Vista cliente
              </p>
              {isActive ? (
                <p className="mt-2 text-sm text-slate-600">
                  <span className="text-slate-400 line-through">
                    {plan.normalPrice}/mes
                  </span>{" "}
                  <span className="font-black text-emerald-700">
                    {prices[plan.key]}€/mes lanzamiento
                  </span>
                </p>
              ) : (
                <p className="mt-2 font-black text-slate-950">
                  {plan.normalPrice}/mes
                </p>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
        No se muestran contadores, plazas restantes ni número de clientes
        fundadores. Esta pantalla deja preparada la gestión comercial sin tocar
        Stripe ni facturación real.
      </div>
    </section>
  );
}
