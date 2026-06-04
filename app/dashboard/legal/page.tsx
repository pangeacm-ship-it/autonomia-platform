import Link from "next/link";

const documents = [
  {
    title: "Condiciones Generales de Contratación",
    version: "v1.0",
    accepted: true,
  },
  {
    title: "Política de Privacidad (RGPD)",
    version: "v1.0",
    accepted: true,
  },
  {
    title: "Política de Cookies",
    version: "v1.0",
    accepted: true,
  },
  {
    title: "Tratamiento de Datos y Encargado",
    version: "v1.0",
    accepted: true,
  },
];

export default function LegalPage() {
  return (
    <section className="p-6 lg:p-10">
      <div className="mb-8 rounded-[2rem] border border-white/10 bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-sky-500/10 p-8">
        <h1 className="text-4xl font-black">
          Área Legal
        </h1>

        <p className="mt-4 max-w-3xl text-slate-300">
          Consulta la documentación legal, los consentimientos aceptados
          y toda la información relacionada con la protección de datos
          y la contratación de servicios de AutonomIA.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_350px]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">
              Documentación legal
            </h2>

            <div className="mt-6 space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc.title}
                  className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#0b1024] p-5 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <h3 className="font-bold">
                      {doc.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      Versión {doc.version}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <span className="rounded-full bg-emerald-500/20 px-3 py-2 text-xs font-bold text-emerald-300">
                      Aceptado
                    </span>

                    <button className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold hover:bg-white/10">
                      Descargar PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-black">
              Consentimientos registrados
            </h2>

            <div className="mt-6 rounded-2xl border border-white/10 bg-[#0b1024] p-5">
              <p className="text-sm text-slate-300">
                ✔️ Aceptación de condiciones de contratación
              </p>

              <p className="mt-3 text-sm text-slate-300">
                ✔️ Aceptación política de privacidad
              </p>

              <p className="mt-3 text-sm text-slate-300">
                ✔️ Consentimiento para comunicaciones comerciales
              </p>

              <p className="mt-3 text-sm text-slate-400">
                Fecha de aceptación: 15/06/2026 · 12:33
              </p>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-violet-400/30 bg-violet-500/10 p-6">
            <h3 className="text-xl font-black">
              Cumplimiento RGPD
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              AutonomIA actúa como encargado del tratamiento
              para los datos gestionados a través de la plataforma.
            </p>
          </div>

          <div className="rounded-[2rem] border border-sky-400/30 bg-sky-500/10 p-6">
            <h3 className="text-xl font-black">
              Facturación Verifactu
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              La plataforma se encuentra preparada para integrarse
              con sistemas de facturación compatibles con Verifactu
              conforme a la normativa vigente.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h3 className="text-xl font-black">
              Soporte legal
            </h3>

            <p className="mt-3 text-sm text-slate-400">
              Si necesitas una copia firmada de algún documento
              o ejercer derechos RGPD, contacta con soporte.
            </p>

            <Link
              href="/dashboard/cuenta"
              className="mt-5 block rounded-xl border border-white/10 px-4 py-3 text-center font-bold hover:bg-white/10"
            >
              Contactar soporte
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}