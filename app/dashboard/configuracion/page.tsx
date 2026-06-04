export default function ConfiguracionPage() {
  return (
    <section className="p-6 lg:p-10">
      <div className="mb-8 rounded-[2rem] border border-white/10 bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-sky-500/10 p-8">
        <h1 className="text-4xl font-black">Configuración</h1>

        <p className="mt-4 text-slate-300">
          Personaliza el funcionamiento general de AutonomIA.
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-black">Preferencias</h2>

          <div className="mt-6 space-y-4">
            <label className="flex items-center justify-between">
              <span>Recibir informes mensuales</span>
              <input type="checkbox" defaultChecked />
            </label>

            <label className="flex items-center justify-between">
              <span>Recibir alertas por email</span>
              <input type="checkbox" defaultChecked />
            </label>

            <label className="flex items-center justify-between">
              <span>Activar recomendaciones IA</span>
              <input type="checkbox" defaultChecked />
            </label>
          </div>
        </div>

        <div className="rounded-[2rem] border border-amber-500/20 bg-amber-500/10 p-6">
          <h2 className="text-2xl font-black">Zona de información</h2>

          <p className="mt-4 text-slate-300">
            Algunos módulos pueden requerir servicios externos como Google
            Business, Meta o WhatsApp Business.
          </p>
        </div>

        <div className="rounded-[2rem] border border-red-500/20 bg-red-500/10 p-6">
          <h2 className="text-2xl font-black">Zona de peligro</h2>

          <button className="mt-5 rounded-xl border border-red-500/30 px-5 py-3 font-bold text-red-300">
            Cancelar suscripción
          </button>
        </div>
      </div>
    </section>
  );
}