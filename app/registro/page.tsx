"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


import { signIn } from "next-auth/react";
// import { register } from "@/lib/auth";

export default function RegistroPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  //Para el modal
  const [showError, setShowError] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !password || !confirmPassword) {
      setError("Por favor complete todos los campos");
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,12}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "La contraseña debe tener entre 6 y 12 caracteres, incluir al menos una mayúscula, una minúscula y un número."
      );
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (res.status === 409) {
        setError(
          "El correo electrónico ya está registrado. Inicia sesión o usa otro email."
        );
        setShowError(true);
        return;
      }

      if (!res.ok) {
        setError("Error al registrar usuario. Intente nuevamente.");
        setShowError(true);
        return;
      }
      if (res.ok) {
        // Login automático después de crear el usuario como dijo el profe
        const loginResult = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (loginResult?.ok) {
          router.push("/");
        } else {
          router.push("/login"); // si fallara lo manda al login
        }
      }
    } catch (error) {
      setError(`error en el servidor. 500 ${error}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          <CardTitle className="text-3xl md:text-4xl font-bold text-center">
            Crear Cuenta
          </CardTitle>
          <CardDescription className="text-lg text-center">
            Complete el formulario para registrarse
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="username" className="text-lg font-medium block">
                Usuario
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="text-[#FFF] h-14 text-lg"
                placeholder="Elija un nombre de usuario"
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="email" className="text-lg font-medium block">
                Correo Electrónico
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-[#FFF] h-14 text-lg"
                placeholder="su-email@ejemplo.com"
              />
            </div>

            <div className="space-y-3">
              <label htmlFor="password" className="text-lg font-medium block">
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-[#FFF] h-14 text-lg"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div className="space-y-3">
              <label
                htmlFor="confirmPassword"
                className="text-lg font-medium block"
              >
                Confirmar Contraseña
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="text-[#FFF] h-14 text-lg"
                placeholder="Repita su contraseña"
              />
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-base">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-14 text-xl font-semibold">
              Crear Cuenta
            </Button>

            <div className="text-center pt-2">
              <p className="text-lg text-muted-foreground">
                ¿Ya tienes cuenta?{" "}
                <Link
                  href="/login"
                  className="text-primary font-semibold hover:underline"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
      {/* 🔔 Modal de error */}
      {/* <AlertDialog open={showError} onOpenChange={setShowError}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>⚠️ Error</AlertDialogTitle>
            <AlertDialogDescription>{error}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowError(false)}>
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </div>
  );
}
