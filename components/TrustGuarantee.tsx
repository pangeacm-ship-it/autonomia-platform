const trustPoints = [
  "Sin costes ocultos.",
  "Sin permanencia general.",
  "Suscripción mensual.",
  "Cancelación antes de la siguiente renovación.",
  "Cargos por error de AutonomIA revisados y devueltos si corresponde.",
];

export default function TrustGuarantee() {
  return (
    <div className="mx-auto mt-10 max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_0_50px_rgba(14,165,233,0.08)]">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-200">
            Sin letra pequeña
          </p>
          <h3 className="mt-3 text-2xl font-black sm:text-3xl">
            Lo que ves es lo que contratas
          </h3>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            En AutonomIA no hay costes ocultos ni compromisos de permanencia.
            La suscripción es mensual y puedes cancelarla antes de la siguiente
            renovación.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {trustPoints.map((point) => (
            <div
              key={point}
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm font-bold text-slate-200"
            >
              {point}
            </div>
          ))}
        </div>
      </div>

      <p className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm leading-6 text-emerald-100">
        Si detectamos un cargo realizado por error nuestro, lo revisaremos y,
        si corresponde, lo devolveremos. Y si tienes cualquier problema con tu
        suscripción, contacta con nosotros: buscaremos una solución razonable.
      </p>
    </div>
  );
}
