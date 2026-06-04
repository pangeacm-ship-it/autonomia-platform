import type { CommercialAccess } from "@/lib/data/commercial-access";

type VipAccessBannerProps = {
  access: CommercialAccess;
  compact?: boolean;
};

export default function VipAccessBanner({ access, compact = false }: VipAccessBannerProps) {
  if (!access.isGifted) {
    return null;
  }

  return (
    <section className="rounded-[2rem] border border-violet-400/30 bg-gradient-to-r from-violet-500/20 via-cyan-500/10 to-emerald-500/10 p-6 shadow-[0_0_45px_rgba(124,58,237,0.16)]">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-violet-200">
            {access.badge}
          </p>
          <h2 className="mt-3 text-2xl font-black sm:text-3xl">
            Plan {access.planDisplayName}
          </h2>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <span className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">
              Precio oficial:
            </span>
            <span className="text-3xl font-black text-slate-500 line-through decoration-red-400 decoration-2">
              {access.officialPrice}
            </span>
            <span className="rounded-full bg-violet-400 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-950">
              {access.label}
            </span>
          </div>
        </div>

        <p className={`max-w-2xl text-sm leading-6 text-slate-200 ${compact ? "" : "lg:text-right"}`}>
          Actualmente disfrutas de acceso VIP concedido por AutonomIA. Mantienes
          acceso completo sin coste mientras esta condición permanezca activa.
        </p>
      </div>
    </section>
  );
}
