import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ["400", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexova Backoffice | Talent Pipeline",
  description:
    "Aplicacion interna de Nexova para operar y visualizar la logica de negocio de talento.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        <header className="appNav">
          <div className="appNavInner">
            <p>Nexova Backoffice</p>
            <nav>
              <Link href="/">Inicio</Link>
              <Link href="/suppliers">Suppliers</Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
