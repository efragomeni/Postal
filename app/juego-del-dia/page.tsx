"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getDailyGame, DailyGameData } from "@/lib/dailyGame";

import Hangman from "@/components/games/Hangman";
import Crossword from "@/components/games/Crossword";
import Puzzle from "@/components/games/Puzzle";
import { PageTopBar } from "@/components/PageTopBar";

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
        <PageTopBar />

        <div className={`${
          dailyGame.type === "crossword"
            ? "max-w-[calc(100vw-2rem)] xl:max-w-[1350px]"
            : "max-w-4xl"
        } mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 w-full`}>
          <div className="bg-gradient-to-r from-[#1a365d] to-blue-500 p-4 md:p-6 m-3 md:m-6 rounded-2xl text-white text-center shadow-md">
            <h1 className="text-xl md:text-3xl lg:text-4xl font-bold mb-1 md:mb-2">Juego del Día</h1>
            <p className="text-blue-100 text-sm md:text-base font-medium">Un desafío nuevo cada día. ¡Suerte!</p>
          </div>
          
          <div className="p-3 md:p-6 lg:p-10">
            {dailyGame.type === "hangman" && <Hangman seed={dailyGame.seed} />}
            {dailyGame.type === "crossword" && <Crossword seed={dailyGame.seed} />}
            {dailyGame.type === "puzzle" && <Puzzle seed={dailyGame.seed} />}
          </div>
        </div>
      </main>
    </div>
  );
}
