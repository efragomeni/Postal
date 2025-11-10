"use client";

import type React from "react";

import { useState } from "react";
import { signIn } from "next-auth/react";
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


export default function LoginPage() {
   const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Email o contraseña incorrectos");
    } else {
      router.push("/"); // por ejemplo, una página privada
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          <CardTitle className="text-3xl md:text-4xl font-bold text-center">
            Foro Comunitario
          </CardTitle>
          <CardDescription className="text-lg text-center">
            Ingrese sus datos para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="username" className="text-lg font-medium block">
                Email
              </label>
              <Input
                id="username"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 text-lg text-(--textInputs)"
                placeholder="Ingrese su email"
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
                className="h-14 text-lg text-(--textInputs)"
                placeholder="Ingrese su contraseña"
              />
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-base">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full h-14 text-xl font-semibold">
              Ingresar
            </Button>

            <div className="text-center pt-2">
              <p className="text-lg text-muted-foreground">
                ¿No tienes cuenta?{" "}
                <Link
                  href="/registro"
                  className="text-primary font-semibold hover:underline"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
