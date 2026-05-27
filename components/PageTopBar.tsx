"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";

interface PageTopBarProps {
  /** Si se pasa, muestra el botón "Volver al Inicio". Por defecto apunta a "/". */
  backHref?: string;
  backLabel?: string;
  /** Ocultar el botón Volver */
  hideBack?: boolean;
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
  hideBack = false,
  hideActions = false,
}: PageTopBarProps) {
  const router = useRouter();

  return (
    <div className={`mb-4 md:mb-6 flex items-center ${hideBack ? 'justify-end' : 'justify-between'} gap-2 md:gap-4 flex-wrap`}>
      {/* Botón Volver */}
      {!hideBack && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(backHref)}
          className="h-9 md:h-12 text-sm md:text-lg gap-1 md:gap-2 cursor-pointer px-3 md:px-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">{backLabel}</span>
          <span className="sm:hidden">Volver</span>
        </Button>
      )}

      {/* Acciones rápidas */}
      {!hideActions && (
        <div className="flex gap-2 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push("/crear-tema")}
            className="h-9 md:h-12 text-sm md:text-lg gap-1 md:gap-2 cursor-pointer px-2 md:px-4"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline sm:inline">Nueva postal</span>
            <span className="xs:hidden sm:hidden">Nueva postal</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.push("/mis-postales")}
            className="h-9 md:h-12 text-sm md:text-lg gap-1 md:gap-2 cursor-pointer px-2 md:px-4"
          >
            <span>Mis postales</span>
          </Button>
        </div>
      )}
    </div>
  );
}
