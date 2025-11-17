"use client";

//Antena q permite que useSession funcione en cualquier lado del front.

import { SessionProvider } from "next-auth/react"; //Envuelve a la app y permite q cualquier componente hijo (todo el front) pueda llamar a useSession.

export default function SessionProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>{children}</SessionProvider>;
}






/******************************************************************
¿Qué problema soluciona exactamente?
Sin este wrapper:
  * useSession() no funcionaría en los componentes.
  * No podría refrescar la sesión automáticamente.
  * No habría estado global de NextAuth en el frontend.
******************************************************************/
