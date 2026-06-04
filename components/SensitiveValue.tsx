"use client";

import { useEffect, useState } from "react";

const eventName = "autonomia-sensitive-values";
let globalVisibility = false;

type SensitiveValueProps = {
  value: string;
  hiddenValue?: string;
  className?: string;
};

export default function SensitiveValue({
  value,
  hiddenValue = "***€",
  className,
}: SensitiveValueProps) {
  const [isVisible, setIsVisible] = useState(globalVisibility);

  useEffect(() => {
    function handleVisibility(event: Event) {
      const customEvent = event as CustomEvent<boolean>;
      setIsVisible(Boolean(customEvent.detail));
    }

    window.addEventListener(eventName, handleVisibility);

    return () => window.removeEventListener(eventName, handleVisibility);
  }, []);

  return <span className={className}>{isVisible ? value : hiddenValue}</span>;
}

export function SensitiveValuesToggle() {
  const [isVisible, setIsVisible] = useState(globalVisibility);

  function toggleVisibility() {
    const nextVisibility = !isVisible;
    globalVisibility = nextVisibility;
    setIsVisible(nextVisibility);
    window.dispatchEvent(new CustomEvent(eventName, { detail: nextVisibility }));
  }

  return (
    <button
      type="button"
      onClick={toggleVisibility}
      className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-bold hover:bg-white/10"
    >
      {isVisible ? "Ocultar ingresos" : "Mostrar ingresos"}
    </button>
  );
}
