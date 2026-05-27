"use client";
import { useRouter, usePathname } from "next/navigation";
import { Home, User, LogOut, Bell, Trash, Gamepad2, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRef, useState, useEffect } from "react";

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  const dropupRef = useRef<HTMLDivElement>(null);
  const adminDropupRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [adminNotifs, setAdminNotifs] = useState<any[]>([]);
  const [adminOpen, setAdminOpen] = useState(false);

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
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, [user]);

  // Cargar notificaciones admin (denuncias)
  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const loadAdmin = async () => {
      try {
        const res = await fetch("/api/admin/notifications");
        const data = await res.json();
        setAdminNotifs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    };

    loadAdmin();
    const interval = setInterval(loadAdmin, 60000);
    return () => clearInterval(interval);
  }, [user]);

  // Marcar como leídas al abrir el dropdown de usuario
  useEffect(() => {
    if (open) {
      fetch("/api/notifications", { method: "PATCH" }).catch(console.error);
    }
  }, [open]);

  // Marcar como leídas al abrir el dropdown de admin
  useEffect(() => {
    if (adminOpen) {
      fetch("/api/admin/notifications", { method: "PATCH" }).catch(console.error);
    }
  }, [adminOpen]);

  // efecto para cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropupRef.current &&
        !dropupRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
      if (
        adminDropupRef.current &&
        !adminDropupRef.current.contains(event.target as Node)
      ) {
        setAdminOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropupRef, adminDropupRef]);

  if (!user) return null;

  const isAdmin = user.role === "admin";
  const hasUnread = notifications.some((n) => !n.read);
  const hasAdminUnread = adminNotifs.some((n) => !n.read);

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-primary text-primary-foreground border-t border-gray-700 shadow-lg md:hidden z-50">
      <div className="flex justify-around items-center h-20 px-2">
        {/* 1. Inicio */}
        <Button
          variant={pathname === (isAdmin ? "/admin" : "/") ? "default" : "ghost"}
          onClick={() => router.push(isAdmin ? "/admin" : "/")}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 ${
            pathname === (isAdmin ? "/admin" : "/")
              ? "bg-[var(--color-acento)] text-white scale-105"
              : "hover:bg-[var(--color-acento)] hover:text-white"
          }`}
        >
          <Home className="w-7 h-7" />
        </Button>

        {/* 2. Juego del día (usuario) o Ver postales (admin) */}
        {!isAdmin ? (
          <Button
            variant={pathname === "/juego-del-dia" ? "default" : "ghost"}
            onClick={() => router.push("/juego-del-dia")}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 ${
              pathname === "/juego-del-dia"
                ? "bg-[var(--color-acento)] text-white scale-105"
                : "hover:bg-[var(--color-acento)] hover:text-white"
            }`}
          >
            <Gamepad2 className="w-7 h-7" />
          </Button>
        ) : (
          <Button
            variant={pathname === "/admin/postales" ? "default" : "ghost"}
            onClick={() => router.push("/admin/postales")}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 ${
              pathname === "/admin/postales"
                ? "bg-[var(--color-acento)] text-white scale-105"
                : "hover:bg-[var(--color-acento)] hover:text-white"
            }`}
          >
            <LayoutList className="w-7 h-7" />
          </Button>
        )}

        {/* 3. Avisos (User notifications or Admin complaints) */}
        {isAdmin ? (
          <div className="relative" ref={adminDropupRef}>
            <Button
              variant={hasAdminUnread ? "destructive" : "ghost"}
              onClick={() => setAdminOpen((s) => !s)}
              aria-expanded={adminOpen}
              aria-haspopup="true"
              className="flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 relative"
            >
              <Bell className="w-7 h-7" />
              {hasAdminUnread && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] px-1 rounded-full animate-pulse pointer-events-none">
                  {adminNotifs.filter((n) => !n.read).length}
                </span>
              )}
            </Button>

            {adminOpen && (
              <div
                className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-80 max-w-[90vw] bg-white shadow-xl rounded-lg p-3 space-y-2 z-50 text-gray-900 border border-gray-200"
                role="menu"
                aria-label="Denuncias"
              >
                {adminNotifs.length === 0 ? (
                  <p className="text-sm text-gray-500 p-2 text-center">No hay denuncias</p>
                ) : (
                  adminNotifs.map((n: any) => (
                    <div
                      key={n._id}
                      className={`p-2 rounded flex justify-between items-start cursor-pointer transition-colors hover:bg-gray-50 ${
                        n.read ? "bg-gray-100" : "bg-orange-100 text-orange-950"
                      }`}
                      onClick={() => {
                        setAdminOpen(false);
                        router.push(n.link);
                      }}
                      role="menuitem"
                    >
                      <div className="flex-1 pr-2">
                        <p className="text-sm font-medium">{n.message}</p>
                        <span className="text-[10px] text-gray-500 block mt-1">
                          {new Date(n.createdAt).toLocaleString("es-AR")}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="relative" ref={dropupRef}>
            <Button
              variant={hasUnread ? "destructive" : "ghost"}
              onClick={() => setOpen((s) => !s)}
              aria-expanded={open}
              aria-haspopup="true"
              className="flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 relative"
            >
              <Bell className="w-7 h-7" />
              {hasUnread && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] px-1 rounded-full animate-pulse pointer-events-none">
                  {notifications.filter((n) => !n.read).length}
                </span>
              )}
            </Button>

            {open && (
              <div
                className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-80 max-w-[90vw] bg-white shadow-xl rounded-lg p-3 space-y-2 z-50 text-gray-900 border border-gray-200"
                role="menu"
                aria-label="Notificaciones"
              >
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-500 p-2 text-center">No tenés notificaciones</p>
                ) : (
                  notifications.map((n: any) => (
                    <div
                      key={n._id}
                      className={`p-2 rounded flex justify-between items-start transition-colors ${
                        n.read ? "bg-gray-100" : "bg-blue-100 text-blue-950"
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
                        <p className="text-sm font-medium">{n.message}</p>
                        <span className="text-[10px] text-gray-500 block mt-1">
                          {new Date(n.createdAt).toLocaleString("es-AR")}
                        </span>
                      </div>

                      <button
                        title="Eliminar notificación"
                        className="ml-2 mt-1 text-gray-500 hover:text-red-600 transition-colors"
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

        {/* 4. Perfil */}
        <Button
          variant={pathname.startsWith(`/perfil/`) ? "default" : "ghost"}
          onClick={() => router.push(`/perfil/${user.id}`)}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 ${
            pathname.startsWith(`/perfil/`)
              ? "bg-[var(--color-acento)] text-white scale-105"
              : "hover:bg-[var(--color-acento)] hover:text-white"
          }`}
        >
          <img
            src={user.profileImage || "/default.jpg"}
            alt={user.name}
            className={`w-7 h-7 rounded-full object-cover border border-white/20 shrink-0 ${
              pathname.startsWith(`/perfil/`) ? "ring-2 ring-white" : ""
            }`}
          />
        </Button>

        {/* 5. Salir */}
        <Button
          variant="ghost"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 hover:bg-[var(--color-acento)] hover:text-white"
        >
          <LogOut className="w-7 h-7" />
        </Button>
      </div>
    </nav>
  );
}
