"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  getDailyCrosswordLayout,
  CrosswordPlacedWord,
  CrosswordCellData,
} from "@/lib/dailyGame";
import { Button } from "@/components/ui/button";
import { RefreshCcw, CheckCircle2, ArrowRight, ArrowDown } from "lucide-react";

const CELL_SIZE = 36; // px por celda

export default function Crossword({ seed }: { seed: number }) {
  const layout = useMemo(() => getDailyCrosswordLayout(seed), [seed]);
  const { placedWords, gridData, gridHeight, gridWidth } = layout;

  // Estado de entrada del usuario: "fila,col" → letra
  const [userInput, setUserInput] = useState<Map<string, string>>(new Map());
  const [isWon, setIsWon] = useState(false);

  // Palabra activa y celda activa
  const [activeWordIdx, setActiveWordIdx] = useState<number | null>(null);
  const [activeCell, setActiveCell] = useState<{ r: number; c: number } | null>(null);

  // Refs a los inputs para foco programático
  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  useEffect(() => {
    setUserInput(new Map());
    setIsWon(false);
    setActiveWordIdx(null);
    setActiveCell(null);
    inputRefs.current.clear();
  }, [seed]);

  // ─── Helpers ─────────────────────────────────────────────────────────────
  const getUserLetter = (r: number, c: number) => userInput.get(`${r},${c}`) ?? "";

  const checkWin = useCallback(
    (input: Map<string, string>) => {
      for (const pw of placedWords) {
        const dr = pw.direction === "down" ? 1 : 0;
        const dc = pw.direction === "across" ? 1 : 0;
        for (let i = 0; i < pw.word.length; i++) {
          const r = pw.startRow + dr * i;
          const c = pw.startCol + dc * i;
          if ((input.get(`${r},${c}`) ?? "") !== pw.word[i]) return;
        }
      }
      setIsWon(true);
    },
    [placedWords]
  );

  /** Calcula si una celda pertenece a la palabra activa */
  const isInActiveWord = useCallback(
    (r: number, c: number) => {
      if (activeWordIdx === null) return false;
      const pw = placedWords[activeWordIdx];
      if (!pw) return false;
      const dr = pw.direction === "down" ? 1 : 0;
      const dc = pw.direction === "across" ? 1 : 0;
      for (let i = 0; i < pw.word.length; i++) {
        if (pw.startRow + dr * i === r && pw.startCol + dc * i === c) return true;
      }
      return false;
    },
    [activeWordIdx, placedWords]
  );

  /** Avanza el foco a la siguiente celda vacía en la palabra activa */
  const advanceFocus = useCallback(
    (r: number, c: number, input: Map<string, string>) => {
      if (activeWordIdx === null) return;
      const pw = placedWords[activeWordIdx];
      if (!pw) return;
      const dr = pw.direction === "down" ? 1 : 0;
      const dc = pw.direction === "across" ? 1 : 0;
      const pos = pw.direction === "down" ? r - pw.startRow : c - pw.startCol;
      // Avanzar a la siguiente celda de la palabra
      if (pos < pw.word.length - 1) {
        const nr = r + dr;
        const nc = c + dc;
        inputRefs.current.get(`${nr},${nc}`)?.focus();
        setActiveCell({ r: nr, c: nc });
      }
    },
    [activeWordIdx, placedWords]
  );

  // ─── Manejadores ──────────────────────────────────────────────────────────
  const handleInput = useCallback(
    (r: number, c: number, value: string) => {
      if (isWon) return;
      // Tomar solo la última letra ingresada, en mayúsculas, solo A-Z
      const char = value
        ? value
            .toUpperCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^A-Z]/g, "")
            .slice(-1)
        : "";

      const newMap = new Map(userInput);
      if (char) {
        newMap.set(`${r},${c}`, char);
      } else {
        newMap.delete(`${r},${c}`);
      }
      setUserInput(newMap);

      if (char) advanceFocus(r, c, newMap);

      checkWin(newMap);
    },
    [isWon, userInput, advanceFocus, checkWin]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, r: number, c: number) => {
      if (e.key === "Backspace" && !getUserLetter(r, c) && activeWordIdx !== null) {
        // Retroceder foco al eliminar en celda vacía
        const pw = placedWords[activeWordIdx];
        if (!pw) return;
        const dr = pw.direction === "down" ? 1 : 0;
        const dc = pw.direction === "across" ? 1 : 0;
        const pos = pw.direction === "down" ? r - pw.startRow : c - pw.startCol;
        if (pos > 0) {
          const pr = r - dr;
          const pc = c - dc;
          inputRefs.current.get(`${pr},${pc}`)?.focus();
          setActiveCell({ r: pr, c: pc });
        }
      }
      // Navegación con flechas dentro de la palabra activa
      if (activeWordIdx !== null) {
        const pw = placedWords[activeWordIdx];
        if (!pw) return;
        const isH = pw.direction === "across";
        if (isH && e.key === "ArrowRight") {
          e.preventDefault();
          const nc = c + 1;
          if (nc <= pw.startCol + pw.word.length - 1)
            inputRefs.current.get(`${r},${nc}`)?.focus();
        }
        if (isH && e.key === "ArrowLeft") {
          e.preventDefault();
          const nc = c - 1;
          if (nc >= pw.startCol) inputRefs.current.get(`${r},${nc}`)?.focus();
        }
        if (!isH && e.key === "ArrowDown") {
          e.preventDefault();
          const nr = r + 1;
          if (nr <= pw.startRow + pw.word.length - 1)
            inputRefs.current.get(`${nr},${c}`)?.focus();
        }
        if (!isH && e.key === "ArrowUp") {
          e.preventDefault();
          const nr = r - 1;
          if (nr >= pw.startRow) inputRefs.current.get(`${nr},${c}`)?.focus();
        }
      }
    },
    [getUserLetter, activeWordIdx, placedWords]
  );

  const handleCellClick = useCallback(
    (r: number, c: number, cell: CrosswordCellData) => {
      // Si se hace click en la misma celda con múltiples palabras → alternar dirección
      if (
        activeCell?.r === r &&
        activeCell?.c === c &&
        cell.wordIndices.length > 1
      ) {
        const other = cell.wordIndices.find((id) => id !== activeWordIdx);
        if (other !== undefined) setActiveWordIdx(other);
        return;
      }
      setActiveCell({ r, c });
      setActiveWordIdx(cell.wordIndices[0] ?? null);
    },
    [activeCell, activeWordIdx]
  );

  const handleClueClick = useCallback(
    (pwIdx: number) => {
      const pw = placedWords[pwIdx];
      if (!pw) return;
      setActiveWordIdx(pwIdx);
      setActiveCell({ r: pw.startRow, c: pw.startCol });
      inputRefs.current.get(`${pw.startRow},${pw.startCol}`)?.focus();
    },
    [placedWords]
  );

  const handleReset = () => {
    setUserInput(new Map());
    setIsWon(false);
    setActiveWordIdx(null);
    setActiveCell(null);
  };

  // ─── Datos de pistas ──────────────────────────────────────────────────────
  const acrossWords = useMemo(
    () =>
      placedWords
        .map((pw, idx) => ({ pw, idx }))
        .filter(({ pw }) => pw.direction === "across")
        .sort((a, b) => a.pw.clueNumber - b.pw.clueNumber),
    [placedWords]
  );

  const downWords = useMemo(
    () =>
      placedWords
        .map((pw, idx) => ({ pw, idx }))
        .filter(({ pw }) => pw.direction === "down")
        .sort((a, b) => a.pw.clueNumber - b.pw.clueNumber),
    [placedWords]
  );

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-8 w-full select-none">
      {/* Encabezado */}
      <div className="text-center">
        <h2 className="text-xl md:text-3xl font-extrabold text-[#1a365d] tracking-tight mb-2">Crucigrama del Día</h2>
        <p className="text-gray-500 text-sm mt-1">
          {placedWords.length} palabra{placedWords.length !== 1 ? "s" : ""} para descifrar
        </p>
      </div>

      {/* Banner de victoria */}
      {isWon && (
        <div className="flex items-center gap-3 bg-green-50 border-2 border-green-400 text-green-800 px-6 py-3 rounded-2xl font-bold text-lg shadow-md animate-bounce">
          <CheckCircle2 className="w-6 h-6 text-green-600" />
          ¡Felicitaciones! ¡Resolviste el crucigrama! 🎉
        </div>
      )}

      {/* Contenedor principal de dos columnas en pantallas grandes */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 w-full justify-center">
        {/* Columna Izquierda: Leyenda y Cuadrícula */}
        <div className="flex flex-col items-center gap-4 shrink-0 max-w-full">
          {/* Leyenda de dirección activa */}
          {activeWordIdx !== null && !isWon && (
            <div className="flex items-center gap-2 text-sm text-indigo-700 font-medium bg-indigo-50 border border-indigo-200 px-4 py-1.5 rounded-full">
              {placedWords[activeWordIdx]?.direction === "across" ? (
                <>
                  <ArrowRight className="w-4 h-4" />
                  Horizontal
                </>
              ) : (
                <>
                  <ArrowDown className="w-4 h-4" />
                  Vertical
                </>
              )}
              &nbsp;&mdash;&nbsp;Pista&nbsp;
              <strong>{placedWords[activeWordIdx]?.clueNumber}</strong>
            </div>
          )}

          {/* Cuadrícula */}
          <div className="overflow-auto max-w-full pb-2 bg-gray-50 border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div
              className="relative bg-transparent"
              style={{
                width: gridWidth * CELL_SIZE,
                height: gridHeight * CELL_SIZE,
              }}
            >
              {gridData.map((row, r) =>
                row.map((cell, c) => {
                  if (!cell) return null;

                  const userLetter = getUserLetter(r, c);
                  const inWord = isInActiveWord(r, c);
                  const isSelected =
                    activeCell?.r === r && activeCell?.c === c;
                  const isCorrect = isWon || userLetter === cell.letter;
                  const isWrong = userLetter && !isWon && userLetter !== cell.letter;

                  return (
                    <div
                      key={`cell-${r}-${c}`}
                      className={[
                        "absolute border transition-colors duration-100",
                        isSelected
                          ? "border-2 border-indigo-600 bg-indigo-200 z-10"
                          : inWord
                          ? "border border-indigo-300 bg-indigo-50"
                          : "border border-gray-400 bg-white",
                        isWon ? "!bg-green-100 !border-green-500" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      style={{
                        top: r * CELL_SIZE,
                        left: c * CELL_SIZE,
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                      }}
                      onClick={() => handleCellClick(r, c, cell)}
                    >
                      {/* Número de pista */}
                      {cell.clueNumber && (
                        <span
                          className="absolute top-0 left-0.5 leading-none font-bold text-gray-500 pointer-events-none"
                          style={{ fontSize: "8px", lineHeight: "10px" }}
                        >
                          {cell.clueNumber}
                        </span>
                      )}

                      {/* Input de la celda */}
                      <input
                        ref={(el) => {
                          const key = `${r},${c}`;
                          if (el) inputRefs.current.set(key, el);
                          else inputRefs.current.delete(key);
                        }}
                        type="text"
                        inputMode="text"
                        value={userLetter}
                        onChange={(e) => handleInput(r, c, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, r, c)}
                        onFocus={() => {
                          setActiveCell({ r, c });
                          // Mantener la palabra activa si la celda pertenece a ella, sino usar la primera
                          if (
                            activeWordIdx !== null &&
                            cell.wordIndices.includes(activeWordIdx)
                          ) {
                            // keep
                          } else {
                            setActiveWordIdx(cell.wordIndices[0] ?? null);
                          }
                        }}
                        disabled={isWon}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="characters"
                        spellCheck={false}
                        maxLength={1}
                        className={[
                          "absolute inset-0 w-full h-full text-center font-bold uppercase bg-transparent border-none outline-none cursor-pointer",
                          "pt-2", // espacio para el número de pista
                          isWon
                            ? "text-green-700"
                            : isWrong
                            ? "text-orange-500"
                            : isCorrect && userLetter
                            ? "text-gray-800"
                            : "text-gray-800",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        style={{ fontSize: CELL_SIZE * 0.48 }}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Pistas */}
        <div
          className="w-full flex-1 min-w-[280px] max-w-2xl bg-white border border-gray-200 rounded-2xl p-6 shadow-sm overflow-y-auto"
          style={{
            maxHeight: `calc(${gridHeight * CELL_SIZE}px + 5rem)`,
          }}
        >
          <h3 className="text-lg font-bold text-gray-700 mb-4 text-center border-b border-gray-200 pb-2">
            📋 Pistas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-x-8 gap-y-4">
            {/* Horizontales */}
            <div>
              <h4 className="font-bold text-indigo-600 mb-2 flex items-center gap-1.5 text-sm uppercase tracking-wide border-b border-indigo-100 pb-1">
                <ArrowRight className="w-4 h-4" /> Horizontales
              </h4>
              <ul className="space-y-1">
                {acrossWords.map(({ pw, idx }) => {
                  const isActive = activeWordIdx === idx;
                  return (
                    <li
                      key={`a-${pw.clueNumber}`}
                      className={[
                        "flex gap-2 text-sm rounded-lg px-2 py-1.5 cursor-pointer transition-colors",
                        isActive
                          ? "bg-indigo-100 font-semibold text-indigo-900"
                          : "hover:bg-gray-100 text-gray-700",
                      ].join(" ")}
                      onClick={() => handleClueClick(idx)}
                    >
                      <span className="font-bold text-indigo-500 shrink-0 w-5 text-right">
                        {pw.clueNumber}.
                      </span>
                      <span className="leading-snug">{pw.definicion}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Verticales */}
            <div className="mt-4 sm:mt-0 lg:mt-0">
              <h4 className="font-bold text-indigo-600 mb-2 flex items-center gap-1.5 text-sm uppercase tracking-wide border-b border-indigo-100 pb-1">
                <ArrowDown className="w-4 h-4" /> Verticales
              </h4>
              <ul className="space-y-1">
                {downWords.map(({ pw, idx }) => {
                  const isActive = activeWordIdx === idx;
                  return (
                    <li
                      key={`d-${pw.clueNumber}`}
                      className={[
                        "flex gap-2 text-sm rounded-lg px-2 py-1.5 cursor-pointer transition-colors",
                        isActive
                          ? "bg-indigo-100 font-semibold text-indigo-900"
                          : "hover:bg-gray-100 text-gray-700",
                      ].join(" ")}
                      onClick={() => handleClueClick(idx)}
                    >
                      <span className="font-bold text-indigo-500 shrink-0 w-5 text-right">
                        {pw.clueNumber}.
                      </span>
                      <span className="leading-snug">{pw.definicion}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Botón reiniciar */}
      <Button
        variant="ghost"
        onClick={handleReset}
        className="text-gray-400 hover:text-gray-600 gap-2 cursor-pointer mt-2"
      >
        <RefreshCcw className="w-4 h-4" />
        Reiniciar
      </Button>
    </div>
  );
}
