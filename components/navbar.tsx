"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
// import { logout, getCurrentUser } from "@/lib/auth";
import { LogOut, Home, Plus, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export function Navbar() {
  const router = useRouter();
  // const user = getCurrentUser();

  const { data: session } = useSession();
  const user = session?.user;
  // console.log("User desde Navbar",user);
  // console.log("User.id desde Navbar",user.id);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
    //La fnc nativa singOut destruye el token y limpia la sesion del lado del cliente y del servidor.
    //callbackUrl define a que pagina redirigir dsp del logout.
  };
  if (!user) return null;
  // <nav className="bg-primary text-primary-foreground shadow-lg">
  // <div className="container "></div>
  // </nav>

  return (
    <nav className="bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl md:text-3xl font-bold">Foro 👩‍🦳👨‍🦳</h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => router.push("/")}
              className="h-12 text-base md:text-lg gap-2"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">Inicio</span>
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => router.push(`/perfil/${user.id}`)}
              className="h-12 text-base md:text-lg gap-2"
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">Perfil</span>
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => router.push("/crear-tema")}
              className="h-12 text-base md:text-lg gap-2"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Nuevo Tema</span>
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={handleLogout}
              className="h-12 text-base md:text-lg gap-2"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
