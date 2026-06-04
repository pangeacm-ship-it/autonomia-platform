export default function ConfiguracionIAPage() {
  return (
    <section className="p-6 lg:p-10">
      <div className="mb-8 rounded-[2rem] border border-white/10 bg-gradient-to-r from-violet-600/20 via-blue-600/20 to-cyan-500/10 p-8">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-200">
          Configuración IA
        </p>

        <h1 className="mt-4 text-4xl font-black">
          Personaliza cómo trabaja AutonomIA
        </h1>

        <p className="mt-4 max-w-3xl text-slate-300">
          Define el estilo, objetivos y automatizaciones para que todos los
          módulos trabajen de acuerdo con las necesidades de tu negocio.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
            <h2 className="text-2xl font-black">
              Tono de comunicación
            </h2>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {[
                "Cercano",
                "Profesional",
                "Premium",
                "Divertido",
                "Tradicional",
                "Moderno",
              ].map((tone) => (
                <label
                  key={tone}
                  className={`cursor-pointer rounded-2xl border p-4 ${
                    tone === "Cercano"
                      ? "border-violet-400 bg-violet-500/10"
                      : "border-white/10 bg-[#0b1024]"
                  }`}
                >
                  <input
                    type="radio"
                    name="tone"
                    defaultChecked={tone === "Cercano"}
                    className="hidden"
                  />

                  <p className="font-bold">{tone}</p>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
            <h2 className="text-2xl font-black">
              Objetivo principal
            </h2>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {[
                "Conseguir reservas",
                "Conseguir ventas",
                "Conseguir llamadas",
                "Conseguir visitas",
                "Mejorar reputación",
                "Captar leads",
              ].map((goal) => (
                <label
                  key={goal}
                  className="cursor-pointer rounded-2xl border border-white/10 bg-[#0b1024] p-4"
                >
                  <input type="radio" name="goal" className="hidden" />
                  <p className="font-bold">{goal}</p>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
            <h2 className="text-2xl font-black">
              Frecuencia de contenido
            </h2>

            <div className="mt-6 flex flex-wrap gap-3">
              {["Baja", "Normal", "Alta"].map((item) => (
                <label
                  key={item}
                  className={`cursor-pointer rounded-full border px-5 py-3 font-bold ${
                    item === "Normal"
                      ? "border-emerald-400 bg-emerald-500/10 text-emerald-300"
                      : "border-white/10 bg-[#0b1024]"
                  }`}
                >
                  <input
                    type="radio"
                    name="frequency"
                    defaultChecked={item === "Normal"}
                    className="hidden"
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
            <h2 className="text-2xl font-black">
              Automatización
            </h2>

            <div className="mt-6 space-y-4">
              {[
                "Revisar publicaciones antes de publicar",
                "Publicación automática",
                "Revisar respuestas de reseñas",
                "Responder reseñas automáticamente",
                "Revisar respuestas WhatsApp",
                "Automatizar consultas frecuentes",
              ].map((item, index) => (
                <label
                  key={item}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0b1024] p-4"
                >
                  <input
                    type="checkbox"
                    defaultChecked={index === 0 || index === 2 || index === 4}
                    className="h-5 w-5"
                  />

                  <span className="font-medium">{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
            <h2 className="text-2xl font-black">
              Tipo de contenido preferido
            </h2>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {[
                "Productos",
                "Instalaciones",
                "Equipo",
                "Promociones",
                "Eventos",
                "Testimonios",
              ].map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0b1024] p-4"
                >
                  <input
                    type="checkbox"
                    defaultChecked
                  />

                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">

          <div className="rounded-[2rem] border border-cyan-500/20 bg-cyan-500/10 p-6">
            <h3 className="text-xl font-black text-cyan-300">
              InsightIA
            </h3>

            <div className="mt-5 space-y-4">
              {[
                "Informe semanal",
                "Informe mensual",
                "Alertas de actividad baja",
                "Alertas de oportunidades",
              ].map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-3"
                >
                  <input
                    type="checkbox"
                    defaultChecked
                  />

                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-6">
            <h3 className="text-xl font-black text-emerald-300">
              Configuración actual
            </h3>

            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <p>✓ Tono cercano</p>
              <p>✓ Frecuencia normal</p>
              <p>✓ Revisión manual activada</p>
              <p>✓ Informes automáticos</p>
            </div>
          </div>

          <button className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-4 font-bold shadow-[0_0_35px_rgba(124,58,237,0.35)]">
            Guardar configuración
          </button>
        </aside>
      </div>
    </section>
  );
}