import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ToolTrack Blueprint Studio",
  description:
    "Plataforma de estudios de arquitectura operacional, trazabilidad industrial y requerimientos para empresas O&G.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body>{children}</body>
    </html>
  );
}
