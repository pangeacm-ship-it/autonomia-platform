export default function CuentaPage() {
  return (
    <section className="p-6 lg:p-10">
      <div className="mb-8 rounded-[2rem] border border-white/10 bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-sky-500/10 p-8">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-200">
          Cuenta
        </p>

        <h1 className="mt-4 text-4xl font-black">Perfil personal</h1>

        <p className="mt-4 max-w-3xl text-slate-300">
          Gestiona tus datos personales, seguridad y preferencias de notificación.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8">
          <h2 className="text-2xl font-black">Datos personales</h2>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-300">
                Nombre
              </label>
              <input
                defaultValue="Juanma"
                className="w-full rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-4 text-white outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-300">
                Apellidos
              </label>
              <input
                defaultValue="Salado"
                className="w-full rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-4 text-white outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-300">
                Email
              </label>
              <input
                defaultValue="juan@email.com"
                className="w-full rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-4 text-white outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-300">
                Teléfono
              </label>
              <input
                defaultValue="+34 600 000 000"
                className="w-full rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-4 text-white outline-none"
              />
            </div>
          </div>

          <button className="mt-8 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 font-bold">
            Guardar cambios
          </button>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h3 className="text-xl font-black">Seguridad</h3>

            <p className="mt-3 text-sm text-slate-400">Último acceso: hoy</p>

            <button className="mt-5 w-full rounded-xl border border-white/10 px-4 py-3 font-bold hover:bg-white/10">
              Cambiar contraseña
            </button>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <h3 className="text-xl font-black">Notificaciones</h3>

            <div className="mt-5 space-y-4 text-sm">
              {[
                "Informes mensuales",
                "Avisos de facturación",
                "Alertas IA",
                "Recordatorios de publicaciones",
              ].map((item) => (
                <label key={item} className="flex items-center justify-between">
                  <span>{item}</span>
                  <input type="checkbox" defaultChecked />
                </label>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}