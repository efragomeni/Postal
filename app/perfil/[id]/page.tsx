"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

import { Navbar } from "@/components/navbar";
export default function Perfil() {
  const router = useRouter();
  // const params =useParams()

  return (
    <div className="contenedor-principal min-h-screen bg-secondary">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          size="lg"
          onClick={() => router.push("/")}
          className="mb-6 h-12 text-base md:text-lg gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al Inicio
        </Button>
        <div className="mt-20 flex items-center justify-center bg-secondary p-4 ">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-3">
              <CardTitle className="text-3xl md:text-4xl font-bold text-center">
                <h1>ACA ESTAMOS EN EL PERFIL</h1>
              </CardTitle>
              <CardDescription className="text-lg text-center">
                Aca se pueden modificar los datos:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-3">
                  <label htmlFor="email" className="text-lg font-medium block">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    className="h-14 text-lg text-(--textInputs)"
                  ></Input>
                </div>
                <div className="space-y-3">
                  <label
                    htmlFor="username"
                    className="text-lg font-medium block"
                  >
                    Nombre de usuario:
                  </label>
                  <Input
                    id="username"
                    type="text"
                    className="h-14 text-lg text-(--textInputs)"
                  ></Input>
                </div>
                <div className="space-y-3">
                  <label
                    htmlFor="password"
                    className="text-lg font-medium block"
                  >
                    Contraseña
                  </label>
                  <Input
                    id="password"
                    type="password"
                    className="h-14 text-lg text-(--textInputs)"
                    placeholder="Ingrese su contraseña"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-14 text-xl font-semibold"
                >
                  Actualizar
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
