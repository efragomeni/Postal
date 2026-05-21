"use client";

import { useState, useEffect } from "react";
import { getDailyHangmanWord, type HangmanWord } from "@/lib/dailyGame";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export default function Hangman({ seed }: { seed: number }) {
  const hangmanData = getDailyHangmanWord(seed);
  const word = hangmanData.palabra.toUpperCase();
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [mistakes, setMistakes] = useState(0);
  const [showModal, setShowModal] = useState(false);
  
  const MAX_MISTAKES = 6;
  const alphabet = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

  // Only run once when the seed changes to ensure deterministic state initialization
  useEffect(() => {
    setGuessedLetters(new Set());
    setMistakes(0);
    setShowModal(false);
  }, [seed]);

  const handleGuess = (letter: string) => {
    if (guessedLetters.has(letter) || isGameOver || isGameWon) return;

    const newGuessed = new Set(guessedLetters);
    newGuessed.add(letter);
    setGuessedLetters(newGuessed);

    if (!word.includes(letter)) {
      setMistakes((prev) => prev + 1);
    }
  };

  const isGameWon = word.split("").every((letter) => guessedLetters.has(letter));
  const isGameOver = mistakes >= MAX_MISTAKES;

  useEffect(() => {
    if (isGameWon) {
      setShowModal(true);
    }
  }, [isGameWon]);

  // Simple SVG Hangman drawing based on mistakes
  const renderHangman = () => (
    <svg height="250" width="200" className="mx-auto stroke-current text-gray-800 dark:text-gray-200">
      {/* Base */}
      <line x1="10" y1="240" x2="190" y2="240" strokeWidth="4" />
      <line x1="50" y1="240" x2="50" y2="20" strokeWidth="4" />
      <line x1="50" y1="20" x2="130" y2="20" strokeWidth="4" />
      <line x1="130" y1="20" x2="130" y2="50" strokeWidth="4" />
      
      {/* Head */}
      {mistakes > 0 && <circle cx="130" cy="70" r="20" strokeWidth="4" fill="none" />}
      {/* Body */}
      {mistakes > 1 && <line x1="130" y1="90" x2="130" y2="150" strokeWidth="4" />}
      {/* Left Arm */}
      {mistakes > 2 && <line x1="130" y1="100" x2="100" y2="130" strokeWidth="4" />}
      {/* Right Arm */}
      {mistakes > 3 && <line x1="130" y1="100" x2="160" y2="130" strokeWidth="4" />}
      {/* Left Leg */}
      {mistakes > 4 && <line x1="130" y1="150" x2="100" y2="190" strokeWidth="4" />}
      {/* Right Leg */}
      {mistakes > 5 && <line x1="130" y1="150" x2="160" y2="190" strokeWidth="4" />}
    </svg>
  );

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Ahorcado</h2>
      
      <div className="mb-8">
        {renderHangman()}
      </div>

      <div className="flex gap-2 flex-wrap justify-center mb-8 px-4">
        {word.split("").map((letter, i) => (
          <div 
            key={i} 
            className="w-10 h-12 md:w-12 md:h-14 border-b-4 border-gray-800 flex items-center justify-center text-2xl md:text-3xl font-bold uppercase"
          >
            {(guessedLetters.has(letter) || isGameOver) ? letter : ""}
          </div>
        ))}
      </div>

      {isGameOver && !isGameWon && (
        <div className="text-xl font-bold mb-6 px-6 py-3 rounded-lg bg-red-100 text-red-800">
          Fin del juego. ¡Mejor suerte mañana!
        </div>
      )}

      <div className="grid grid-cols-7 gap-2 max-w-lg w-full">
        {alphabet.map((letter) => {
          const isGuessed = guessedLetters.has(letter);
          const isCorrect = isGuessed && word.includes(letter);
          const isWrong = isGuessed && !word.includes(letter);
          
          return (
            <button
              key={letter}
              onClick={() => handleGuess(letter)}
              disabled={isGuessed || isGameOver || isGameWon}
              className={`h-12 rounded font-bold text-lg transition-colors cursor-pointer
                ${isCorrect ? "bg-green-500 text-white" : ""}
                ${isWrong ? "bg-gray-300 text-gray-500 opacity-50" : ""}
                ${!isGuessed ? "bg-indigo-100 text-indigo-900 hover:bg-indigo-200" : ""}
              `}
            >
              {letter}
            </button>
          )
        })}
      </div>
      
      {/* Dev Reset for testing ONLY (doesn't change the daily word) */}
      <div className="mt-8 flex justify-center w-full">
         <Button variant="ghost" onClick={() => { setGuessedLetters(new Set()); setMistakes(0); setShowModal(false); }} className="text-gray-400 hover:text-gray-600 gap-2 cursor-pointer">
            <RefreshCcw className="w-4 h-4" />
            Reiniciar (Local)
         </Button>
      </div>

      {/* Modal de definición */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-3xl font-bold mb-4 text-green-600">¡Felicidades!</h3>
            <div className="mb-6">
              <p className="text-xl font-semibold text-gray-800 mb-4">
                La palabra era: <span className="text-blue-600">{word}</span>
              </p>
              <div className="bg-gray-100 p-4 rounded">
                <p className="text-gray-700 text-lg">
                  <span className="font-semibold">Definición:</span> {hangmanData.definición}
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowModal(false)}
              className=" cursor-pointer w-full bg-green-600 hover:bg-green-600 text-white"
            >
              Cerrar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
