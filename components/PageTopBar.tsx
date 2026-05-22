"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";

interface PageTopBarProps {
  /** Si se pasa, muestra el botón "Volver al Inicio". Por defecto apunta a "/". */
  backHref?: string;
  backLabel?: string;
  /** Ocultar los botones de acción (útil en páginas de admin) */
  hideActions?: boolean;
}

/**
 * Barra superior reutilizable con:
 * - Botón Volver (izquierda)
 * - Botones "+ Nueva postal" y "Mis postales" (derecha, solo para usuarios)
 */
export function PageTopBar({
  backHref = "/",
  backLabel = "Volver al Inicio",
  hideActions = false,
}: PageTopBarProps) {
  const router = useRouter();

  return (
    <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
      {/* Botón Volver */}
      <Button
        variant="outline"
        size="lg"
        onClick={() => router.push(backHref)}
        className="h-12 text-base md:text-lg gap-2 cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5" />
        {backLabel}
      </Button>

      {/* Acciones rápidas */}
      {!hideActions && (
        <div className="flex gap-2 shrink-0">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => router.push("/crear-tema")}
            className="h-10 sm:h-12 text-sm sm:text-base md:text-lg gap-2 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Nueva postal</span>
            <span className="sm:hidden">+</span>
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => router.push("/mis-postales")}
            className="h-10 sm:h-12 text-sm sm:text-base md:text-lg gap-2 cursor-pointer"
          >
            <span>Mis postales</span>
          </Button>
        </div>
      )}
    </div>
  );
}
