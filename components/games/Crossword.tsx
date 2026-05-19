"use client";

import { useState, useEffect, useRef } from "react";
import { getDailyCrossword } from "@/lib/dailyGame";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export default function Crossword({ seed }: { seed: number }) {
  const crossword = getDailyCrossword(seed);
  const size = crossword.grid.length; // usually 5

  // User input state
  const [gridState, setGridState] = useState<string[][]>(
    Array(size).fill("").map(() => Array(size).fill(""))
  );
  
  const [isWon, setIsWon] = useState(false);

  // Input refs for auto-focus navigation
  const inputRefs = useRef<Array<Array<HTMLInputElement | null>>>(
    Array(size).fill(null).map(() => Array(size).fill(null))
  );

  useEffect(() => {
    setGridState(Array(size).fill("").map(() => Array(size).fill("")));
    setIsWon(false);
  }, [seed, size]);

  const handleChange = (row: number, col: number, value: string) => {
    if (isWon) return;
    
    // Allow empty string to delete, or get last character for single char
    const char = value ? value.charAt(value.length - 1).toUpperCase() : "";
    
    const newGrid = [...gridState];
    newGrid[row] = [...newGrid[row]];
    newGrid[row][col] = char;
    setGridState(newGrid);

    // Auto-focus logic: move to next cell (right, then down) if a character was entered
    if (char) {
      if (col < size - 1) {
        inputRefs.current[row][col + 1]?.focus();
      } else if (row < size - 1) {
        inputRefs.current[row + 1][0]?.focus();
      }
    }

    // Check if won
    checkWin(newGrid);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, row: number, col: number) => {
    if (e.key === "Backspace" && !gridState[row][col]) {
      // If backspace on empty cell, move focus back
      if (col > 0) {
        inputRefs.current[row][col - 1]?.focus();
      } else if (row > 0) {
        inputRefs.current[row - 1][size - 1]?.focus();
      }
    } else if (e.key === "ArrowRight" && col < size - 1) {
      inputRefs.current[row][col + 1]?.focus();
    } else if (e.key === "ArrowLeft" && col > 0) {
      inputRefs.current[row][col - 1]?.focus();
    } else if (e.key === "ArrowDown" && row < size - 1) {
      inputRefs.current[row + 1][col]?.focus();
    } else if (e.key === "ArrowUp" && row > 0) {
      inputRefs.current[row - 1][col]?.focus();
    }
  };

  const checkWin = (currentGrid: string[][]) => {
    let won = true;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (currentGrid[r][c] !== crossword.grid[r][c]) {
          won = false;
          break;
        }
      }
      if (!won) break;
    }
    if (won) {
      setIsWon(true);
    }
  };

  const isCellCorrect = (r: number, c: number) => {
    return gridState[r][c] !== "" && gridState[r][c] === crossword.grid[r][c];
  };

  const isCellFilled = (r: number, c: number) => {
    return gridState[r][c] !== "";
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Crucigrama 5x5</h2>
      
      {isWon && (
         <div className="text-xl font-bold mb-6 px-6 py-3 rounded-lg bg-green-100 text-green-800 animate-pulse">
            ¡Felicidades, resolviste el crucigrama!
         </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-4xl justify-center">
        {/* Grid */}
        <div className="bg-gray-900 p-2 rounded-lg shadow-md shrink-0 w-fit mx-auto lg:mx-0">
          <div 
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
          >
            {gridState.map((row, r) => (
              row.map((cell, c) => (
                <div key={`${r}-${c}`} className="relative w-12 h-12 md:w-16 md:h-16">
                  {/* Small number in top left for clues (diagonal indices are 1,2,3,4,5) */}
                  {(r === c) && (
                    <span className="absolute top-0.5 left-1 text-[10px] md:text-xs font-semibold text-gray-500 z-10 pointer-events-none">
                      {r + 1}
                    </span>
                  )}
                  <input
                    ref={(el) => {
                       inputRefs.current[r][c] = el;
                    }}
                    type="text"
                    value={cell}
                    onChange={(e) => handleChange(r, c, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, r, c)}
                    disabled={isWon}
                    className={`w-full h-full text-center text-xl md:text-2xl font-bold uppercase border-none focus:ring-2 focus:ring-indigo-500 rounded-sm
                      ${isWon ? "bg-green-100 text-green-800 font-extrabold" : "bg-white text-gray-800"}
                      ${!isWon && isCellFilled(r, c) && !isCellCorrect(r, c) ? "text-orange-600" : ""}
                    `}
                    maxLength={2} // Allows overwriting without deleting first
                  />
                </div>
              ))
            ))}
          </div>
        </div>

        {/* Clues */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-6 w-full lg:max-w-xs">
          <div className="flex-1">
            <h3 className="font-bold text-lg border-b-2 border-indigo-500 mb-3 pb-1">Horizontales</h3>
            <ul className="space-y-2 text-sm md:text-base">
              {Object.entries(crossword.clues.across).map(([num, clue]) => (
                <li key={`a-${num}`} className="flex gap-2">
                  <span className="font-bold text-indigo-600 w-4">{num}.</span>
                  <span>{clue}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg border-b-2 border-indigo-500 mb-3 pb-1">Verticales</h3>
            <ul className="space-y-2 text-sm md:text-base">
              {Object.entries(crossword.clues.down).map(([num, clue]) => (
                <li key={`d-${num}`} className="flex gap-2">
                  <span className="font-bold text-indigo-600 w-4">{num}.</span>
                  <span>{clue}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Dev Reset */}
      <div className="mt-8 flex justify-center w-full">
         <Button variant="ghost" onClick={() => { setGridState(Array(size).fill("").map(() => Array(size).fill(""))); setIsWon(false); }} className="text-gray-400 hover:text-gray-600 gap-2 cursor-pointer">
            <RefreshCcw className="w-4 h-4" />
            Reiniciar (Local)
         </Button>
      </div>
    </div>
  );
}
