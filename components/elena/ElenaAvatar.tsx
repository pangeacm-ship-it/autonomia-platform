type Size = "sm" | "md" | "lg" | "xl";

type Props = {
  size?: Size;
  className?: string;
  showRing?: boolean;
};

const sizeMap: Record<Size, { outer: string; inner: string; text: string; dot: string }> = {
  sm:  { outer: "h-8 w-8",   inner: "h-7 w-7",   text: "text-xs",  dot: "h-2 w-2 border" },
  md:  { outer: "h-12 w-12", inner: "h-10 w-10",  text: "text-sm",  dot: "h-2.5 w-2.5 border" },
  lg:  { outer: "h-16 w-16", inner: "h-14 w-14",  text: "text-xl",  dot: "h-3 w-3 border-[1.5px]" },
  xl:  { outer: "h-24 w-24", inner: "h-20 w-20",  text: "text-3xl", dot: "h-4 w-4 border-2" },
};

export function ElenaAvatar({ size = "md", className = "", showRing = false }: Props) {
  const s = sizeMap[size];

  return (
    <div className={`relative shrink-0 ${className}`}>
      {/* Outer glow ring */}
      <div
        className={`${s.outer} rounded-full bg-gradient-to-br from-violet-500 via-blue-500 to-fuchsia-500 p-[2px] ${
          showRing ? "shadow-[0_0_16px_rgba(124,58,237,0.6)]" : ""
        }`}
      >
        {/* Inner circle */}
        <div
          className={`${s.inner} flex items-center justify-center rounded-full bg-gradient-to-br from-[#1a0533] to-[#0d1242] font-black text-white`}
        >
          {/* Stylised "E" with sparkle */}
          <span className={`${s.text} select-none leading-none`}
            style={{ fontFamily: "inherit", letterSpacing: "-0.03em" }}
          >
            E
          </span>
        </div>
      </div>

      {/* Online indicator dot */}
      <span
        className={`absolute bottom-0 right-0 ${s.dot} rounded-full border-white bg-emerald-400`}
      />
    </div>
  );
}
