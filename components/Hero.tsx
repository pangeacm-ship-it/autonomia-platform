import Image from "next/image";
import Link from "next/link";

const upcomingPosts = [
  { day: "Hoy", title: "Menú semanal", status: "Programada" },
  { day: "Mar", title: "Reseña destacada", status: "Pendiente" },
  { day: "Jue", title: "Promo local", status: "Aprobada" },
];

const calendarDays = ["L", "M", "X", "J", "V", "S", "D"];

function ProductMockup() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="absolute -left-8 top-10 hidden h-28 w-28 rounded-full bg-blue-200/60 blur-3xl lg:block" />
      <div className="absolute -right-8 bottom-10 hidden h-32 w-32 rounded-full bg-violet-200/70 blur-3xl lg:block" />

      <div className="relative rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_30px_90px_rgba(30,41,59,0.16)]">
        <div className="flex items-center justify-between rounded-[1.5rem] bg-slate-950 px-4 py-3 text-white">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-200">
              SocialIA
            </p>
            <p className="mt-1 text-sm font-bold">Calendario editorial</p>
          </div>
          <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-200">
            3 próximas
          </span>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[1.5rem] border border-slate-200 bg-[#F8FAFF] p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-black text-slate-900">Junio 2026</p>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                Mensual
              </span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day) => (
                <span
                  key={day}
                  className="text-center text-[11px] font-black text-slate-400"
                >
                  {day}
                </span>
              ))}
              {Array.from({ length: 21 }, (_, index) => {
                const hasPost = [3, 7, 10, 15, 18].includes(index);
                return (
                  <div
                    key={index}
                    className={`aspect-square rounded-xl border text-xs font-bold ${
                      hasPost
                        ? "border-violet-200 bg-violet-100 text-violet-700"
                        : "border-slate-200 bg-white text-slate-400"
                    } flex items-center justify-center`}
                  >
                    {index + 1}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-[1.5rem] border border-blue-100 bg-blue-50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">
                Elena IA
              </p>
              <p className="mt-2 text-sm font-bold leading-6 text-slate-800">
                Te recomiendo preparar una publicación de fin de semana y
                responder 2 reseñas pendientes.
              </p>
            </div>

            {upcomingPosts.map((post) => (
              <div
                key={post.title}
                className="rounded-[1.25rem] border border-slate-200 bg-white p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-slate-400">
                      {post.day}
                    </p>
                    <p className="text-sm font-black text-slate-900">
                      {post.title}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black text-emerald-700">
                    {post.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          {["SocialIA", "ReviewIA", "InsightIA", "Elena IA"].map((module) => (
            <div
              key={module}
              className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center text-xs font-black text-slate-700"
            >
              {module}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-36 sm:px-6 lg:pt-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,rgba(96,165,250,0.24),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(167,139,250,0.24),transparent_30%)]" />

      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <Image
            src="/autonomia-logo-hero.png"
            alt="AutonomIA"
            width={420}
            height={120}
            priority
            className="mb-8 h-auto w-full max-w-[270px] sm:max-w-[340px]"
          />

          <div className="mb-6 inline-flex rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-700 shadow-sm">
            Plataforma modular de IA para negocios locales
          </div>

          <h1 className="max-w-4xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl md:text-6xl">
            Marketing inteligente para negocios locales
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Crea publicaciones, organiza tu calendario, gestiona tu presencia
            online y ahorra horas cada semana con AutonomIA.
          </p>

          <div className="mt-10 flex w-full max-w-md flex-col gap-4 sm:w-auto sm:max-w-none sm:flex-row">
            <Link
              href="/onboarding"
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-4 text-center font-bold text-white shadow-[0_18px_45px_rgba(79,70,229,0.28)] hover:opacity-90 sm:px-8"
            >
              Prueba gratuita
            </Link>

            <a
              href="#precios"
              className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-center font-bold text-slate-900 shadow-sm hover:border-blue-200 hover:bg-blue-50 sm:px-8"
            >
              Ver planes
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm font-bold text-slate-500">
            <span>Sin permanencia</span>
            <span>·</span>
            <span>Plan gratuito</span>
            <span>·</span>
            <span>Sin conectar redes todavía</span>
          </div>
        </div>

        <ProductMockup />
      </div>
    </section>
  );
}
