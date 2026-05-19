"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getDailyGame, DailyGameData } from "@/lib/dailyGame";

import Hangman from "@/components/games/Hangman";
import Crossword from "@/components/games/Crossword";
import Puzzle from "@/components/games/Puzzle";

export default function JuegoDelDiaPage() {
  const { status } = useSession();
  const router = useRouter();
  const [dailyGame, setDailyGame] = useState<DailyGameData | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  useEffect(() => {
    // Only calculate on client to avoid hydration mismatch due to timezones
    setDailyGame(getDailyGame());
  }, []);

  if (status === "loading" || !dailyGame) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <h1 className="text-2xl font-semibold">Cargando juego...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
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

        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6 text-white text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Juego del Día</h1>
            <p className="text-purple-100 font-medium">Un desafío nuevo cada día. ¡Suerte!</p>
          </div>
          
          <div className="p-6 md:p-10">
            {dailyGame.type === "hangman" && <Hangman seed={dailyGame.seed} />}
            {dailyGame.type === "crossword" && <Crossword seed={dailyGame.seed} />}
            {dailyGame.type === "puzzle" && <Puzzle seed={dailyGame.seed} />}
          </div>
        </div>
      </main>
    </div>
  );
}
