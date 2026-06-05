import { getCommercialPrice } from "@/lib/commercial-plans";

type CommercialPriceProps = {
  planKey?: string | null;
  size?: "sm" | "md" | "lg";
  showBadge?: boolean;
  reserveOfficialSpace?: boolean;
};

export default function CommercialPrice({
  planKey,
  size = "md",
  showBadge = true,
  reserveOfficialSpace = true,
}: CommercialPriceProps) {
  const price = getCommercialPrice(planKey);
  const amountClass =
    size === "lg"
      ? "text-5xl sm:text-6xl"
      : size === "sm"
        ? "text-2xl"
        : "text-4xl";

  return (
    <div>
      <div className={reserveOfficialSpace ? "min-h-[86px]" : ""}>
        {price.hasLaunchPrice && price.officialPrice ? (
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
              Precio oficial
            </p>
            <p className="mt-2 text-2xl font-black text-slate-400 line-through decoration-red-400 decoration-2">
              {price.officialPrice}/mes
            </p>
          </div>
        ) : reserveOfficialSpace ? (
          <div className="invisible">
            <p className="text-xs font-black uppercase tracking-[0.18em]">
              Precio oficial
            </p>
            <p className="mt-2 text-2xl font-black">0€/mes</p>
          </div>
        ) : null}
      </div>

      <p
        className={`${
          reserveOfficialSpace || price.hasLaunchPrice ? "mt-5" : ""
        } text-xs font-black uppercase tracking-[0.18em] text-emerald-700`}
      >
        {price.priceTypeLabel}
      </p>

      <div className="mt-1 flex min-h-[82px] items-end gap-2">
        <span className={`${amountClass} font-black text-emerald-700`}>
          {price.visiblePrice}
        </span>
        <span className="pb-2 text-lg font-bold text-slate-500">/mes</span>
      </div>

      {showBadge ? (
        <p className="mt-3 min-h-[40px] w-fit rounded-full bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-800">
          {price.hasLaunchPrice
            ? "Precio lanzamiento garantizado"
            : price.plan.key === "gratuito"
              ? "Sin pago mensual"
              : "Suscripción mensual"}
        </p>
      ) : null}
    </div>
  );
}
