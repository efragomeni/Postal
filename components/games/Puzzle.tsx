"use client";

import { useState, useEffect } from "react";
import { getDailyPuzzleImage } from "@/lib/dailyGame";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export default function Puzzle({ seed }: { seed: number }) {
  const imageUrl = getDailyPuzzleImage(seed);
  
  // Grid size 3x3
  const gridSize = 3;
  const numTiles = gridSize * gridSize;

  const [tiles, setTiles] = useState<number[]>([]);
  const [isWon, setIsWon] = useState(false);

  // Deterministic random number generator based on seed
  const seededRandom = (s: number) => {
    let x = Math.sin(s++) * 10000;
    return x - Math.floor(x);
  };

  // Helper to check if a permutation is solvable
  // For a 3x3 grid, it's solvable if the number of inversions is even.
  const isSolvable = (arr: number[]) => {
    let inversions = 0;
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] !== numTiles - 1 && arr[j] !== numTiles - 1 && arr[i] > arr[j]) {
          inversions++;
        }
      }
    }
    return inversions % 2 === 0;
  };

  const generateSolvablePuzzle = () => {
    let currentSeed = seed;
    let arr = Array.from({ length: numTiles }, (_, i) => i);
    
    // Shuffle
    do {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom(currentSeed++) * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    } while (!isSolvable(arr) || isWinState(arr)); // Ensure it's solvable and not already won

    return arr;
  };

  const isWinState = (arr: number[]) => {
    return arr.every((val, index) => val === index);
  };

  useEffect(() => {
    setTiles(generateSolvablePuzzle());
    setIsWon(false);
  }, [seed]);

  const handleTileClick = (index: number) => {
    if (isWon) return;

    const emptyIndex = tiles.indexOf(numTiles - 1);
    
    // Check if clicked tile is adjacent to empty tile
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    const emptyRow = Math.floor(emptyIndex / gridSize);
    const emptyCol = emptyIndex % gridSize;

    const isAdjacent = (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
                       (Math.abs(col - emptyCol) === 1 && row === emptyRow);

    if (isAdjacent) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);

      if (isWinState(newTiles)) {
        setIsWon(true);
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Rompecabezas</h2>
      
      {isWon && (
         <div className="text-xl font-bold mb-6 px-6 py-3 rounded-lg bg-green-100 text-green-800 animate-pulse">
            ¡Felicidades, armaste el rompecabezas!
         </div>
      )}

      {/* Helper image preview */}
      <div className="mb-6 flex flex-col items-center">
        <span className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Imagen Original</span>
        <img src={imageUrl} alt="Original" className="w-24 h-24 rounded shadow-md object-cover border-2 border-white" />
      </div>

      <div className="bg-gray-200 p-2 rounded-xl shadow-inner inline-block">
        <div 
          className="grid gap-1 bg-white"
          style={{ 
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            width: "300px", // Fixed width for predictable sizing
            height: "300px",
          }}
        >
          {tiles.map((tileValue, index) => {
            const isEmpty = tileValue === numTiles - 1;
            
            // Calculate background position based on the CORRECT position of this tile
            const correctRow = Math.floor(tileValue / gridSize);
            const correctCol = tileValue % gridSize;
            
            // Percentage positions (for 3x3: 0%, 50%, 100%)
            const bgPosX = correctCol * 50; 
            const bgPosY = correctRow * 50;

            return (
              <div
                key={index}
                onClick={() => handleTileClick(index)}
                className={`relative border transition-all duration-200 cursor-pointer ${
                  isEmpty ? "bg-gray-100 opacity-0 cursor-default" : "shadow-sm hover:opacity-90"
                }`}
                style={{
                  backgroundImage: isEmpty ? "none" : `url(${imageUrl})`,
                  backgroundSize: "300%", // 3x3 grid means image is 3 times the size of a tile
                  backgroundPosition: `${bgPosX}% ${bgPosY}%`,
                }}
              >
              </div>
            );
          })}
        </div>
      </div>

      {/* Dev Reset */}
      <div className="mt-8 flex justify-center w-full">
         <Button variant="ghost" onClick={() => { setTiles(generateSolvablePuzzle()); setIsWon(false); }} className="text-gray-400 hover:text-gray-600 gap-2 cursor-pointer">
            <RefreshCcw className="w-4 h-4" />
            Reiniciar (Local)
         </Button>
      </div>
    </div>
  );
}
