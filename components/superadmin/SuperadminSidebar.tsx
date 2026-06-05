const departments = [
  { label: "Resumen", href: "#resumen" },
  { label: "Clientes", href: "#clientes" },
  { label: "Demos", href: "#demos" },
  { label: "Suscripciones", href: "#suscripciones" },
  { label: "Módulos", href: "#modulos" },
  { label: "Usuarios", href: "#usuarios" },
  { label: "Soporte", href: "#soporte" },
  { label: "Analítica", href: "#analitica" },
  { label: "Configuración", href: "#configuracion" },
];

export default function SuperadminSidebar() {
  return (
    <aside className="lg:sticky lg:top-6 lg:self-start">
      <nav className="rounded-[2rem] border border-slate-200 bg-white p-3 shadow-[0_18px_50px_rgba(30,41,59,0.06)]">
        <p className="px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
          Departamentos
        </p>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1 lg:grid lg:overflow-visible lg:pb-0">
          {departments.map((department) => (
            <a
              key={department.href}
              href={department.href}
              className="shrink-0 rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-700"
            >
              {department.label}
            </a>
          ))}
        </div>
      </nav>
    </aside>
  );
}
