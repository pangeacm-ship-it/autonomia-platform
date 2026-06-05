const trustPoints = [
  "Sin costes ocultos.",
  "Sin permanencia general.",
  "Suscripción mensual.",
  "Cancelación antes de la siguiente renovación.",
  "Cargos por error de AutonomIA revisados y devueltos si corresponde.",
];

export default function TrustGuarantee() {
  return (
    <div className="mx-auto mt-10 max-w-5xl rounded-[2rem] border border-blue-100 bg-white p-6 shadow-[0_20px_60px_rgba(30,41,59,0.07)]">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-600">
            Sin letra pequeña
          </p>
          <h3 className="mt-3 text-2xl font-black text-slate-950 sm:text-3xl">
            Lo que ves es lo que contratas
          </h3>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            En AutonomIA no hay costes ocultos ni compromisos de permanencia.
            La suscripción es mensual y puedes cancelarla antes de la siguiente
            renovación.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {trustPoints.map((point) => (
            <div
              key={point}
              className="rounded-2xl border border-slate-200 bg-[#F8FAFF] px-4 py-3 text-sm font-bold text-slate-700"
            >
              {point}
            </div>
          ))}
        </div>
      </div>

      <p className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
        Si detectamos un cargo realizado por error nuestro, lo revisaremos y,
        si corresponde, lo devolveremos. Y si tienes cualquier problema con tu
        suscripción, contacta con nosotros: buscaremos una solución razonable.
      </p>
    </div>
  );
}
