import { ElenaAvatar } from "./elena/ElenaAvatar";

const elenaFeatures = [
  "Resuelve dudas dentro de AutonomIA",
  "Recomienda publicaciones según tu negocio",
  "Recuerda tareas y próximos pasos",
  "Acompaña al cliente durante la configuración",
];

export default function ElenaSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid gap-10 rounded-[2.5rem] border border-violet-100 bg-white p-6 shadow-[0_25px_70px_rgba(109,40,217,0.08)] sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-violet-600">
            Elena IA
          </p>
          <h2 className="text-4xl font-black text-slate-950 md:text-5xl">
            Conoce a Elena IA
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Elena ayuda al cliente a entender qué hacer después: recomienda
            publicaciones, recuerda tareas y acompaña la gestión diaria dentro
            de AutonomIA.
          </p>

          <div className="mt-8 grid gap-3">
            {elenaFeatures.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-3 rounded-2xl border border-violet-100 bg-[#F8FAFF] px-4 py-3 text-sm font-bold text-slate-700"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                  ✓
                </span>
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Chat preview */}
        <div className="rounded-[2rem] border border-slate-200 bg-[#F8FAFF] p-4">
          <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
            {/* Elena header */}
            <div className="flex items-center gap-3">
              <ElenaAvatar size="md" showRing />
              <div>
                <p className="font-black">Elena IA</p>
                <p className="text-sm text-violet-300">Asistente de AutonomIA</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="max-w-[86%] rounded-2xl bg-white/10 p-4 text-sm leading-6 text-slate-100">
                Esta semana te recomiendo preparar 2 publicaciones, revisar una
                reseña pendiente y programar el contenido del viernes.
              </div>
              <div className="ml-auto max-w-[82%] rounded-2xl bg-white p-4 text-sm font-bold leading-6 text-slate-900">
                Perfecto, enséñame qué publicar.
              </div>
              <div className="max-w-[88%] rounded-2xl bg-violet-500/20 p-4 text-sm leading-6 text-violet-100">
                Te preparo una propuesta adaptada a tu sector y a tus próximos
                objetivos.
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {["Publicación", "Tarea", "Recordatorio"].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-violet-100 bg-white p-4 text-center text-sm font-black text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
