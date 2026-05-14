"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useChat } from "./ChatContext";

/**
 * Detecta ?openChat=userId en la URL (viene de las notificaciones de mensajes),
 * busca la info del usuario y abre el popup de chat automáticamente.
 */
export function ChatUrlHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { openChat } = useChat();

  useEffect(() => {
    const chatUserId = searchParams.get("openChat");
    if (!chatUserId) return;

    async function fetchAndOpen() {
      try {
        const res = await fetch(`/api/users/${chatUserId}`);
        if (res.ok) {
          const user = await res.json();
          openChat({
            id: user._id,
            name: user.name,
            lastname: user.lastname,
            profileImage: user.profileImage,
          });
          // Limpiar el query param de la URL sin recargar
          router.replace(pathname);
        }
      } catch (err) {
        console.error("Error al abrir chat desde notificación:", err);
      }
    }

    fetchAndOpen();
  }, [searchParams]);

  return null;
}
