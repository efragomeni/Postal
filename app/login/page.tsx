"use client";

import type React from "react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import{Eye, EyeOff} from "lucide-react";

export default function LoginPage() {
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      dni, 
      password,
      redirect: false,
    });

    if (!res?.error) {
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();

      if (session?.user?.role === "admin") {
        router.push("/admin");
      } else {
        if (session.user.mustChangePassword) {
          router.replace(`/perfil/${session.user.id}`);
        } else {
          router.push("/");
        }
      }
    } else {
      console.log(res.error);
      if (res.error == "CredentialsSignin") {
        const mensaje = "Credenciales inválidas";
        setError(mensaje);
        return error;
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          <CardTitle className="text-3xl md:text-4xl font-bold text-center">
            <img className="w-50 m-auto" src="/img/POSTAL.png" alt="logo" />
          </CardTitle>
          <CardDescription className="text-lg text-center">
            Ingrese sus datos para continuar
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* DNI */}
            <div className="space-y-3">
              <label htmlFor="dni" className="text-lg font-medium block">
                DNI + letra
              </label>
              <Input
                id="dni"
                type="text"
                value={dni}
                onChange={(e) => setDni(e.target.value.toUpperCase())}
                className="h-14 text-lg text-(--textInputs)"
                placeholder="Ej: 3628640F"
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="password" className="text-lg font-medium block">
                Contraseña
              </label>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 text-lg pr-12 text-(--textInputs)"
                  placeholder="Ingrese su contraseña"
                />

                {/* Botón para mostrar/ocultar */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff/>: <Eye/>}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-base font-semibold text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="outline"
              className="w-full h-14 text-xl font-semibold"
            >
              Ingresar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
