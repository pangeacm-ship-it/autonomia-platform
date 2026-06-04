"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import PasswordInput from "@/components/PasswordInput";
import { businessSectors, defaultBusinessSector } from "@/lib/business-sectors";
import { createFreeTrialFromOnboarding } from "@/lib/data/onboarding";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const steps = [
  "Datos de empresa",
  "Sector",
  "Objetivo",
  "Tono IA",
  "Módulos",
  "Finalizar",
];

const objectives = [
  "Conseguir más clientes",
  "Ahorrar tiempo creando contenido",
  "Mejorar redes sociales",
  "Mejorar reseñas",
  "Gestionar reservas/citas",
  "Automatizar atención",
  "Probar AutonomIA",
  "Otro",
];

const tones = ["Cercano", "Profesional", "Familiar", "Premium"];
const onboardingSectors = businessSectors.filter(
  (sector) => sector.key !== "deporte",
);

type CompanyForm = {
  companyName: string;
  contactName: string;
  city: string;
  phone: string;
  email: string;
};

export default function OnboardingPage() {
  const router = useRouter();
  const [companyForm, setCompanyForm] = useState<CompanyForm>({
    companyName: "",
    contactName: "",
    city: "",
    phone: "",
    email: "",
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedSectorKey, setSelectedSectorKey] = useState(
    defaultBusinessSector.key,
  );
  const [selectedObjective, setSelectedObjective] = useState(objectives[0]);
  const [customObjective, setCustomObjective] = useState("");
  const [selectedTone, setSelectedTone] = useState(tones[0]);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const selectedSector = useMemo(
    () =>
      onboardingSectors.find((sector) => sector.key === selectedSectorKey) ??
      defaultBusinessSector,
    [selectedSectorKey],
  );
  const objectiveSummary =
    selectedObjective === "Otro" && customObjective.trim()
      ? customObjective.trim()
      : selectedObjective;
  const completion = [
    companyForm.companyName && companyForm.contactName && companyForm.email,
    selectedSectorKey,
    objectiveSummary,
    selectedTone,
    selectedSector.compatibleModules.length,
    submitted,
  ].filter(Boolean).length;
  const completionPercent = Math.round((completion / steps.length) * 100);

  function updateCompanyField(
    field: keyof CompanyForm,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setCompanyForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!companyForm.companyName.trim()) {
      setError("El nombre de empresa es obligatorio.");
      return;
    }

    if (!companyForm.contactName.trim()) {
      setError("El nombre de contacto es obligatorio.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyForm.email.trim())) {
      setError("Introduce un email válido.");
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("La confirmación de contraseña no coincide.");
      return;
    }

    setIsSubmitting(true);

    const result = await createFreeTrialFromOnboarding({
      ...companyForm,
      email: companyForm.email.trim().toLowerCase(),
      sectorKey: selectedSector.key,
      sectorName: selectedSector.name,
      objective: selectedObjective,
      customObjective,
      tone: selectedTone,
      recommendedModules: selectedSector.compatibleModules,
      password,
    });

    if (!result.ok) {
      setIsSubmitting(false);
      setError(result.message);
      return;
    }

    setSubmitted(true);
    setSuccessMessage(result.message);

    const supabase = createSupabaseBrowserClient();

    if (supabase) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: companyForm.email.trim().toLowerCase(),
        password,
      });

      if (!signInError) {
        router.push("/dashboard");
        router.refresh();
        return;
      }
    }

    setIsSubmitting(false);
  }

  return (
    <main className="min-h-screen bg-[#050816] px-4 py-8 text-white sm:px-6 lg:py-12">
      <form onSubmit={handleSubmit} className="mx-auto max-w-6xl">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <section className="rounded-[2rem] border border-white/10 bg-gradient-to-r from-blue-600/20 via-violet-600/20 to-sky-500/10 p-6 lg:p-8">
          <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-violet-200">
                Solicitud de demo
              </p>

              <h1 className="mt-4 text-3xl font-black sm:text-4xl">
                Configura AutonomIA para tu negocio
              </h1>

              <p className="mt-4 max-w-3xl text-slate-300">
                Cuéntanos el tipo de negocio, el objetivo principal y el tono
                que buscas. Con esa información podremos preparar una demo más
                útil y cercana a tu caso real.
              </p>
            </div>

            <span className="w-fit rounded-full border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-slate-300">
              Demo visual
            </span>
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`rounded-2xl px-4 py-3 text-sm font-black ${
                  index < completion
                    ? "bg-violet-500/20 text-violet-100"
                    : "bg-white/5 text-slate-400"
                }`}
              >
                <span className="mr-2 text-xs text-slate-500">
                  {index + 1}
                </span>
                {step}
              </div>
            ))}
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 lg:p-8">
              <div className="mb-6">
                <p className="text-sm font-black uppercase tracking-[0.22em] text-violet-300">
                  Paso 1
                </p>
                <h2 className="mt-3 text-2xl font-black">
                  Datos de empresa
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-300">
                    Nombre comercial
                  </label>
                  <input
                    value={companyForm.companyName}
                    onChange={(event) => updateCompanyField("companyName", event)}
                    placeholder="Nombre de tu empresa"
                    className="w-full rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-4 outline-none focus:border-violet-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-300">
                    Nombre contacto
                  </label>
                  <input
                    value={companyForm.contactName}
                    onChange={(event) => updateCompanyField("contactName", event)}
                    placeholder="Nombre y apellidos"
                    className="w-full rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-4 outline-none focus:border-violet-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-300">
                    Ciudad
                  </label>
                  <input
                    value={companyForm.city}
                    onChange={(event) => updateCompanyField("city", event)}
                    placeholder="Ciudad"
                    className="w-full rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-4 outline-none focus:border-violet-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-300">
                    Teléfono
                  </label>
                  <input
                    value={companyForm.phone}
                    onChange={(event) => updateCompanyField("phone", event)}
                    placeholder="+34"
                    className="w-full rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-4 outline-none focus:border-violet-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-300">
                    Email
                  </label>
                  <input
                    type="email"
                    value={companyForm.email}
                    onChange={(event) => updateCompanyField("email", event)}
                    placeholder="email@empresa.com"
                    className="w-full rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-4 outline-none focus:border-violet-400"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-emerald-400/20 bg-emerald-500/10 p-6 lg:p-8">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-300">
                Acceso
              </p>
              <h2 className="mt-3 text-2xl font-black">
                Crea tu cuenta gratuita
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Esta contraseña será la que usarás para entrar a AutonomIA. La
                prueba gratuita se activará automáticamente con el plan
                Gratuito.
              </p>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-300">
                    Contraseña
                  </label>
                  <PasswordInput
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-4 outline-none focus:border-emerald-300"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-300">
                    Confirmar contraseña
                  </label>
                  <PasswordInput
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Repite la contraseña"
                    className="w-full rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-4 outline-none focus:border-emerald-300"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-cyan-400/20 bg-cyan-500/10 p-6 lg:p-8">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-200">
                Paso 2
              </p>
              <h2 className="mt-3 text-2xl font-black">
                Tipo de negocio
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                El sector adapta lenguaje, ejemplos de contenido, reservas,
                citas y módulos recomendados.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {onboardingSectors.map((sector) => (
                  <button
                    type="button"
                    key={sector.key}
                    onClick={() => setSelectedSectorKey(sector.key)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      sector.key === selectedSector.key
                        ? "border-cyan-300/40 bg-cyan-500/20"
                        : "border-white/10 bg-[#0b1024] hover:border-cyan-300/30"
                    }`}
                  >
                    <p className="font-black">{sector.name}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-400">
                      {sector.bookingLabel}
                    </p>
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-3xl border border-cyan-300/20 bg-[#0b1024] p-5">
                <h3 className="text-xl font-black">{selectedSector.name}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {selectedSector.description}
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
                      Ejemplos de contenido
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedSector.socialContentTypes.map((contentType) => (
                        <span
                          key={contentType}
                          className="rounded-full bg-white/10 px-3 py-2 text-xs font-bold text-slate-300"
                        >
                          {contentType}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
                      Reservas, citas o solicitudes
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {selectedSector.bookingLabel} · {selectedSector.leadLabel}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 lg:p-8">
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-amber-300">
                    Paso 3
                  </p>
                  <h2 className="mt-3 text-2xl font-black">
                    Objetivo principal
                  </h2>

                  <div className="mt-6 grid gap-3">
                    {objectives.map((objective) => (
                      <button
                        type="button"
                        key={objective}
                        onClick={() => setSelectedObjective(objective)}
                        className={`rounded-2xl border p-4 text-left text-sm font-bold transition ${
                          objective === selectedObjective
                            ? "border-amber-300/30 bg-amber-500/20 text-amber-100"
                            : "border-white/10 bg-[#0b1024] text-slate-300 hover:border-amber-300/30"
                        }`}
                      >
                        {objective}
                      </button>
                    ))}
                  </div>

                  {selectedObjective === "Otro" ? (
                    <div className="mt-5">
                      <label className="mb-2 block text-sm font-bold text-slate-300">
                        Cuéntanos qué necesitas
                      </label>
                      <textarea
                        value={customObjective}
                        onChange={(event) => setCustomObjective(event.target.value)}
                        rows={4}
                        placeholder="Describe brevemente tu objetivo"
                        className="w-full resize-none rounded-2xl border border-white/10 bg-[#0b1024] px-4 py-4 outline-none focus:border-amber-300"
                      />
                    </div>
                  ) : null}
                </div>

                <div>
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-violet-300">
                    Paso 4
                  </p>
                  <h2 className="mt-3 text-2xl font-black">Tono IA</h2>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {tones.map((tone) => (
                      <button
                        type="button"
                        key={tone}
                        onClick={() => setSelectedTone(tone)}
                        className={`rounded-full px-4 py-3 text-sm font-bold transition ${
                          tone === selectedTone
                            ? "bg-violet-500/20 text-violet-100"
                            : "bg-white/10 text-slate-300 hover:bg-white/15"
                        }`}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl border border-white/10 bg-[#0b1024] p-5">
                    <p className="text-sm leading-6 text-slate-300">
                      Ejemplo en tono {selectedTone.toLowerCase()}: contenido
                      claro, adaptado a {selectedSector.terminology.clientes} y
                      pensado para explicar tus {selectedSector.terminology.servicios}.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-violet-400/20 bg-violet-500/10 p-6 lg:p-8">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-violet-200">
                Paso 5
              </p>
              <h2 className="mt-3 text-2xl font-black">
                Módulos recomendados
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {selectedSector.compatibleModules.map((module) => (
                  <article
                    key={module}
                    className="rounded-2xl border border-white/10 bg-[#0b1024] p-5"
                  >
                    <p className="text-lg font-black">{module}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Recomendado para {selectedSector.name.toLowerCase()} por
                      su relación con {selectedSector.bookingLabel.toLowerCase()}
                      , contenido o seguimiento comercial.
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-6">
              <p className="text-sm text-emerald-200">Configuración estimada</p>
              <h3 className="mt-2 text-3xl font-black sm:text-4xl">
                {completionPercent}%
              </h3>
              <div className="mt-5 h-3 rounded-full bg-white/10">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Al crear la cuenta se registra la empresa, el acceso del
                administrador, el plan Gratuito y el origen Landing.
              </p>
            </section>

            <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-slate-500">
                Resumen
              </p>
              <div className="mt-5 space-y-4 text-sm">
                <p className="flex justify-between gap-4">
                  <span className="text-slate-400">Empresa</span>
                  <span className="text-right font-bold">
                    {companyForm.companyName || "Pendiente"}
                  </span>
                </p>
                <p className="flex justify-between gap-4">
                  <span className="text-slate-400">Contacto</span>
                  <span className="text-right font-bold">
                    {companyForm.contactName || "Pendiente"}
                  </span>
                </p>
                <p className="flex justify-between gap-4">
                  <span className="text-slate-400">Sector</span>
                  <span className="text-right font-bold">{selectedSector.name}</span>
                </p>
                <p className="flex justify-between gap-4">
                  <span className="text-slate-400">Objetivo</span>
                  <span className="text-right font-bold">{objectiveSummary}</span>
                </p>
                <p className="flex justify-between gap-4">
                  <span className="text-slate-400">Tono</span>
                  <span className="text-right font-bold">{selectedTone}</span>
                </p>
                <div>
                  <p className="text-slate-400">Módulos recomendados</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedSector.compatibleModules.map((module) => (
                      <span
                        key={module}
                        className="rounded-full bg-violet-500/20 px-3 py-2 text-xs font-bold text-violet-100"
                      >
                        {module}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-amber-400/20 bg-amber-500/10 p-6">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-amber-300">
                Paso 6
              </p>
              <h3 className="mt-3 text-xl font-black">Finalizar</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Crea tu cuenta y entra directamente a AutonomIA con prueba
                gratuita. El superadmin podrá revisar después tu actividad o
                cambiar el plan si lo necesitas.
              </p>

              {error ? (
                <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm leading-6 text-red-100">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-5 block w-full rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-4 text-center font-bold shadow-[0_0_35px_rgba(124,58,237,0.35)] hover:opacity-90"
              >
                {isSubmitting ? "Creando cuenta..." : "Crear mi cuenta gratuita"}
              </button>

              {submitted ? (
                <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm leading-6 text-emerald-100">
                  {successMessage ??
                    "Cuenta creada correctamente. Ya puedes iniciar sesión."}
                  <Link
                    href="/login"
                    className="mt-3 block rounded-xl bg-white px-4 py-3 text-center font-bold text-slate-950"
                  >
                    Ir a login
                  </Link>
                </div>
              ) : null}

              <Link
                href="/registro"
                className="mt-3 block rounded-2xl border border-white/10 px-5 py-4 text-center font-bold text-slate-300 hover:bg-white/10"
              >
                Volver al registro
              </Link>
            </section>
          </aside>
        </div>
      </form>
    </main>
  );
}
