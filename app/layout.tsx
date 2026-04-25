import { Bodoni_Moda, EB_Garamond, JetBrains_Mono } from "next/font/google";

import type { Metadata } from "next";
import "./globals.css";

const bodoni = Bodoni_Moda({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const garamond = EB_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Leonardo Abreu — Vol. IV",
  description: "Engenheiro de software e fundador da Strutura.",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${bodoni.variable} ${garamond.variable} ${jetbrains.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
