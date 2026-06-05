"use client";

import { useState, type InputHTMLAttributes } from "react";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export default function PasswordInput({
  className = "",
  ...props
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={isVisible ? "text" : "password"}
        className={`${className} pr-12`}
      />
      <button
        type="button"
        aria-label={isVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
        onClick={() => setIsVisible((current) => !current)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl px-2 py-1 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-950"
      >
        👁
      </button>
    </div>
  );
}
