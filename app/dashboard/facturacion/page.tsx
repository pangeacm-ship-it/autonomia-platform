const invoices = [
  {
    date: "15/05/2026",
    concept: "Plan Crecimiento",
    base: "82,64€",
    iva: "17,36€",
    total: "100€",
    status: "Pagada",
    number: "AUT-2026-0002",
    fiscalStatus: "Archivo fiscal preparado",
  },
  {
    date: "15/04/2026",
    concept: "Plan Crecimiento",
    base: "82,64€",
    iva: "17,36€",
    total: "100€",
    status: "Pagada",
    number: "AUT-2026-0001",
    fiscalStatus: "Archivo fiscal preparado",
  },
];

export default function FacturacionPage() {
  return (
    <section className="p-4 sm:p-6 lg:p-10">
      <div className="mb-8 rounded-[2rem] border border-white/10 bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-sky-500/10 p-6 lg:p-8">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-200">
          Facturación
        </p>

        <h1 className="mt-4 text-3xl font-black sm:text-4xl">
          Suscripción, facturas y datos fiscales
        </h1>

        <p className="mt-4 max-w-3xl text-slate-300">
          Consulta tu suscripción activa, próxima renovación automática, método
          de pago y facturas emitidas.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 lg:p-8">
            <h2 className="text-2xl font-black">Datos fiscales</h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <input defaultValue="Bar La Plaza SL" className="rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-4" />
              <input defaultValue="B12345678" className="rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-4" />
              <input defaultValue="facturas@barlaplaza.com" className="rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-4" />
              <input defaultValue="+34 600 000 000" className="rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-4" />
              <input defaultValue="Calle Principal 1, Sevilla" className="md:col-span-2 rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-4" />
            </div>

            <button className="mt-8 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 font-bold">
              Guardar cambios
            </button>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 lg:p-8">
            <h2 className="text-2xl font-black">Facturas emitidas</h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Las facturas emitidas se conservarán en un archivo fiscal seguro.
              En una fase futura se añadirá compatibilidad VERI*FACTU, huella
              fiscal y código QR cuando corresponda.
            </p>

            <div className="mt-6 space-y-4">
              {invoices.map((invoice) => (
                <div key={invoice.number} className="rounded-3xl border border-white/10 bg-[#0b1024] p-5">
                  <div className="grid gap-4 md:grid-cols-5">
                    <div><p className="text-sm text-slate-400">Factura</p><p className="font-bold">{invoice.number}</p></div>
                    <div><p className="text-sm text-slate-400">Fecha</p><p className="font-bold">{invoice.date}</p></div>
                    <div><p className="text-sm text-slate-400">Concepto</p><p className="font-bold">{invoice.concept}</p></div>
                    <div><p className="text-sm text-slate-400">Total</p><p className="font-bold">{invoice.total}</p></div>
                    <div><p className="text-sm text-slate-400">Estado</p><p className="font-bold text-emerald-300">{invoice.status}</p></div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
                    <p className="text-sm leading-6 text-emerald-100">
                      {invoice.fiscalStatus} · QR fiscal futuro pendiente ·
                      VERI*FACTU pendiente de integración.
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold hover:bg-white/10">
                      Ver factura
                    </button>
                    <button className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-950 hover:bg-slate-200">
                      Descargar PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-violet-400/30 bg-violet-500/10 p-6">
            <p className="text-sm text-violet-200">Plan actual</p>
            <h3 className="mt-2 text-3xl font-black">Crecimiento</h3>
            <p className="mt-3 text-emerald-300">Precio fundador · 100€/mes</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Suscripción activa con acceso completo hasta la próxima renovación.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">Desglose mensual</p>
            <div className="mt-5 space-y-3 text-sm">
              <p className="flex justify-between"><span>Base imponible</span><span>82,64€</span></p>
              <p className="flex justify-between"><span>IVA 21%</span><span>17,36€</span></p>
              <p className="flex justify-between border-t border-white/10 pt-3 text-lg font-black"><span>Total</span><span>100€</span></p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">Método de pago</p>
            <h3 className="mt-2 text-2xl font-black">Visa ···· 1234</h3>
            <p className="mt-3 text-sm text-slate-400">Caduca 06/29</p>
            <p className="mt-3 text-sm text-emerald-300">
              Último cobro correcto: 15 Mayo 2026
            </p>
            <button className="mt-5 w-full rounded-xl border border-white/10 px-4 py-3 text-sm font-bold hover:bg-white/10">
              Cambiar método de pago
            </button>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-slate-400">Próxima renovación</p>
            <p className="mt-2 text-2xl font-black">15 Junio 2026</p>
            <p className="mt-3 text-emerald-300">
              Renovación automática · Crecimiento · 100€/mes
            </p>
          </div>

          <div className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-6">
            <p className="font-bold text-emerald-300">Suscripción activa</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              El acceso permanece activo mientras la renovación automática se
              cobre correctamente. Si el cobro falla, la cuenta pasará a revisión
              de pago y podrá suspenderse hasta regularizar la tarjeta.
            </p>
          </div>

          <div className="rounded-[2rem] border border-sky-400/20 bg-sky-500/10 p-6">
            <p className="font-bold text-sky-300">Cumplimiento fiscal futuro</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              AutonomIA reservará huella fiscal, QR y estado de envío cuando se
              active una integración compatible con VERI*FACTU / AEAT.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
