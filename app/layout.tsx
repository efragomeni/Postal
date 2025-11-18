import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import { Navbar } from "@/components/navbar";
import { BottomNav } from "@/components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Postal",
  description: "Generated Desarrollo Team",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black`}
      >
        <SessionProviderWrapper>
          {/* Navbar superior visible en escritorio */}
          <Navbar />

          {/* Contenido de cada página */}
          <main className="pb-16">{children}</main>

          {/* Barra inferior visible solo en móvil */}
          <BottomNav />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
