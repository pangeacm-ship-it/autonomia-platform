import type { Metadata } from "next";
import ElenaWidget from "@/components/elena/ElenaWidget";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutonomIA",
  description:
    "La plataforma modular de inteligencia artificial para negocios locales.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body>
        {children}
        <ElenaWidget />
      </body>
    </html>
  );
}
