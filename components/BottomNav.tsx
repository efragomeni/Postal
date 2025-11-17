"use client";
import { useRouter, usePathname } from "next/navigation";
import { Home, Plus, User, LogOut, Bell, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRef, useState, useEffect } from "react";

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  const dropupRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      setNotifications((prev) => prev.filter((n: any) => n._id !== id));
    } catch (err) {
      console.error("Error al borrar notificación", err);
    }
  };
  // Cargar notificaciones iniciales y cada 60 segundos
  useEffect(() => {
    if (!user || user.role === "admin") return;

    const load = async () => {
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        setNotifications(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    };

    load();
    const interval = setInterval(load, 60000); // cada 60 segundos
    return () => clearInterval(interval);
  }, [user]);

  // Marcar como leídas al abrir el dropdown
  useEffect(() => {
    if (open) {
      fetch("/api/notifications", { method: "PATCH" }).catch(console.error);
    }
  }, [open]);

  // efecto para cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropupRef.current &&
        !dropupRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropupRef]);

  if (!user) return null;



  const isAdmin = user.role === "admin";
  const hasUnread = notifications.some((n) => !n.read);

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-primary text-primary-foreground border-t border-gray-700 shadow-lg md:hidden z-50">
      <div className="flex justify-around items-center h-20 px-4">

        <Button
          variant={
            pathname === (isAdmin ? "/admin" : "/") ? "default" : "ghost"
          }
          onClick={() => router.push(isAdmin ? "/admin" : "/")}
          className={`flex flex-col items-center gap-1 transition-all duration-200 ${
            pathname === (isAdmin ? "/admin" : "/")
              ? "bg-[var(--color-acento)] text-white scale-105"
              : "hover:bg-[var(--color-acento)] hover:text-white hover:scale-105"
          }`}
        >
          <Home className="w-10 h-10" />
        </Button>
        <Button
          variant={pathname.startsWith(`/perfil/`) ? "default" : "ghost"}
          onClick={() => router.push(`/perfil/${user.id}`)}
          className={`flex flex-col items-center gap-1 transition-all duration-200 ${
            pathname.startsWith(`/perfil/`)
              ? "bg-[var(--color-acento)] text-white scale-105"
              : "hover:bg-[var(--color-acento)] hover:text-white hover:scale-105"
          }`}
        >
          <User className="w-10 h-10" />
        </Button>

        {!isAdmin && (
          <Button
            variant={pathname.startsWith(`/crear-tema`) ? "default" : "ghost"}
            onClick={() => router.push("/crear-tema")}
            className={`flex flex-col items-center gap-1 transition-all duration-200 ${
              pathname.startsWith(`/crear-tema`)
                ? "bg-[var(--color-acento)] text-white scale-105"
                : "hover:bg-[var(--color-acento)] hover:text-white hover:scale-105"
            }`}
          >
            <Plus className="w-10 h-10" />
          </Button>
        )}

        {!isAdmin && (
          <div className="relative" ref={dropupRef}>
            <Button
              variant={hasUnread ? "destructive" : "ghost"} // cambia color si hay notificaciones nuevas
              size="lg"
              onClick={() => setOpen((s) => !s)}
              aria-expanded={open}
              aria-haspopup="true"
              className={`h-12 text-base md:text-lg gap-2 flex items-center transition-colors duration-300`}
            >
              <Bell className="w-5 h-5" />
              {hasUnread && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full animate-pulse pointer-events-none">
                  {notifications.filter((n) => !n.read).length}
                </span>
              )}
            </Button>

            {open && (
              <div
                className="absolute right-0 bottom-full mb-2 w-80 bg-white shadow-xl rounded-lg p-3 space-y-2 z-50"
                role="menu"
                aria-label="Notificaciones"
              >
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No tenés notificaciones
                  </p>
                ) : (
                  notifications.map((n: any) => (
                    <div
                      key={n._id}
                      className={`p-2 rounded flex justify-between items-start ${
                        n.read ? "bg-gray-100" : "bg-blue-100"
                      }`}
                      role="menuitem"
                    >
                      <div
                        className="cursor-pointer flex-1 pr-2"
                        onClick={() => {
                          setOpen(false);
                          router.push(n.link);
                        }}
                      >
                        <p className="text-sm">{n.message}</p>
                        <span className="text-xs text-gray-500">
                          {new Date(n.createdAt).toLocaleString("es-AR")}
                        </span>
                      </div>

                      <button
                        title="Eliminar notificación"
                        className="ml-2 mt-1 text-gray-600 hover:text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(n._id);
                        }}
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        <Button
          variant="ghost"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex flex-col items-center gap-1 transition-all duration-200 hover:bg-[var(--color-acento)] hover:text-white hover:scale-105"
        >
          <LogOut className="w-10 h-10" />
        </Button>
      </div>
    </nav>
  );
}
