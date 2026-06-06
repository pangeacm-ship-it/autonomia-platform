const faqs = [
  {
    question: "¿Hay permanencia?",
    answer:
      "No. La suscripción es mensual y puedes cancelar antes de la siguiente renovación.",
  },
  {
    question: "¿Hay costes ocultos?",
    answer:
      "No. Lo que ves en cada plan es lo que contratas. Si algún servicio externo pudiera tener costes adicionales, se avisará antes.",
  },
  {
    question: "¿Qué ocurre si cancelo?",
    answer:
      "Mantienes acceso hasta el final del periodo pagado. Después no se renueva.",
  },
  {
    question: "¿Puedo probar AutonomIA gratis?",
    answer:
      "Sí. Existe plan Gratuito y también demos configurables desde AutonomIA.",
  },
  {
    question: "¿Qué incluye el plan Gratuito?",
    answer:
      "2 publicaciones semanales para Instagram y Facebook, con publicación de apoyo semanal para renovar el uso gratuito.",
  },
  {
    question: "¿Puedo cambiar de plan?",
    answer:
      "Sí. Puedes ampliar o cambiar de plan según las necesidades de tu negocio.",
  },
  {
    question: "¿La IA publica automáticamente?",
    answer:
      "No sin tu aprobación. AutonomIA prepara contenido, pero el cliente puede revisar antes de publicar.",
  },
  {
    question: "¿Sirve para cualquier negocio?",
    answer:
      "Está pensada para negocios locales y profesionales: hostelería, belleza, clínicas, abogados, comercio, inmobiliarias, automoción, formación y más.",
  },
  {
    question: "¿Qué pasa si hay un error en un cobro?",
    answer:
      "Si el error es de AutonomIA, se revisará y se devolverá si corresponde. Si tienes cualquier problema, contacta con nosotros.",
  },
  {
    question: "¿Mis datos están protegidos?",
    answer:
      "AutonomIA está preparada para trabajar con usuarios, roles, empresas separadas y permisos por empresa.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
          Dudas habituales
        </p>
        <h2 className="text-4xl font-black text-slate-950 md:text-5xl">
          Preguntas frecuentes
        </h2>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          Resolvemos las dudas más habituales antes de empezar con AutonomIA.
        </p>
      </div>

      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="group rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(30,41,59,0.05)] open:border-blue-200 open:bg-blue-50"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-lg font-black text-slate-950">
              {faq.question}
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-blue-700 transition group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
