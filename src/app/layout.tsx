import type { Metadata, Viewport } from "next";
import { Archivo, Azeret_Mono } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const azeret = Azeret_Mono({
  variable: "--font-azeret",
  subsets: ["latin"],
});

const dominio = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const metadata: Metadata = {
  metadataBase: new URL(dominio ? `https://${dominio}` : "http://localhost:3000"),
  title: { default: "Imanes", template: "%s · Imanes" },
  description: "Las fotos de viaje que hay detrás de cada imán de la nevera.",
  appleWebApp: { capable: true, title: "Imanes", statusBarStyle: "default" },
  // Es un álbum personal: que no aparezca en buscadores.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: "#e9efeb",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: algunas extensiones del navegador añaden atributos a <html>
    // antes de que React arranque. Solo afecta a esta etiqueta, no a su contenido.
    <html lang="es" className={`${archivo.variable} ${azeret.variable} antialiased`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
