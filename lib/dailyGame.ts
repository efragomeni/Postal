export type GameType = "hangman" | "puzzle" | "crossword";

export interface DailyGameData {
  type: GameType;
  dateStr: string;
  seed: number;
}

export function getDailyGame(): DailyGameData {
  // Use local date string to ensure it changes at midnight local time
  const today = new Date();
  today.setDate(today.getDate() + 5); // Prueba con +1, o +2

  const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  
  // Create a deterministic seed based on the date string
  let seed = 0;
  for (let i = 0; i < dateStr.length; i++) {
    seed = (seed << 5) - seed + dateStr.charCodeAt(i);
    seed |= 0; 
  }
  seed = Math.abs(seed);

  // Rotate between the 3 games
  const gameIndex = seed % 3;
  const types: GameType[] = ["hangman", "crossword", "puzzle"];

  return {
    type: types[gameIndex],
    dateStr,
    seed,
  };
}

// Helpers to get specific daily data based on the seed

export function getDailyHangmanWord(seed: number): string {
  const words = [
    "POSTAL", "CORREO", "MENSAJE", "USUARIO", "SISTEMA", 
    "INTERNET", "TECNOLOGIA", "FORO", "COMUNIDAD", "ARGENTINA",
    "PROVINCIA", "COMPUTADORA", "PLATAFORMA", "SEGURIDAD", "PROGRAMA"
  ];
  return words[seed % words.length];
}

export function getDailyCrossword(seed: number) {
  // Cuadrículas 5x5 simétricas y válidas en español
  const crosswords = [
    {
      grid: [
        ["G", "A", "T", "O", "S"],
        ["A", "B", "A", "J", "O"],
        ["T", "A", "P", "A", "S"],
        ["O", "J", "A", "L", "A"],
        ["S", "O", "S", "A", "S"]
      ],
      clues: {
        across: {
          1: "Felinos domésticos (5)",
          6: "Hacia un lugar inferior (5)",
          7: "Cubiertas de frascos (5)",
          8: "Deseo de que algo suceda (5)",
          9: "Personas sin gracia (5)"
        },
        down: {
          1: "Animales que maúllan (5)",
          2: "En dirección al suelo (5)",
          3: "Aperitivos españoles (5)",
          4: "Dios quiera que pase (5)",
          5: "Comidas sin sal (5)"
        }
      }
    },
    {
      grid: [
        ["R", "O", "M", "A", "S"],
        ["O", "P", "E", "R", "A"],
        ["M", "E", "L", "O", "N"],
        ["A", "R", "O", "M", "A"],
        ["S", "A", "N", "A", "S"]
      ],
      clues: {
        across: {
          1: "Sin punta (fem, pl) (5)",
          6: "Obra teatral cantada (5)",
          7: "Fruta grande y dulce (5)",
          8: "Olor muy agradable (5)",
          9: "Que gozan de buena salud (5)"
        },
        down: {
          1: "De forma obtusa (fem, pl) (5)",
          2: "Teatro musical clásico (5)",
          3: "Fruta de verano jugosa (5)",
          4: "Perfume, fragancia (5)",
          5: "Sin enfermedades (fem) (5)"
        }
      }
    },
    {
      grid: [
        ["T", "A", "C", "O", "S"],
        ["A", "B", "A", "J", "O"],
        ["C", "A", "J", "A", "S"],
        ["O", "J", "A", "L", "A"],
        ["S", "O", "S", "A", "S"]
      ],
      clues: {
        across: {
          1: "Comida típica mexicana (5)",
          6: "En la parte inferior (5)",
          7: "Recipientes de cartón (5)",
          8: "Ojalá, expresión de deseo (5)",
          9: "Carentes de sabor (5)"
        },
        down: {
          1: "Zapatos altos de mujer (5)",
          2: "Hacia abajo (5)",
          3: "Donde guardas objetos mudanza (5)",
          4: "Esperanza de que ocurra (5)",
          5: "Aburridas, sin gracia (5)"
        }
      }
    }
  ];
  return crosswords[seed % crosswords.length];
}

export function getDailyPuzzleImage(seed: number): string {
  const images = [
    "https://picsum.photos/id/10/400/400", // Forest
    "https://picsum.photos/id/11/400/400", // Landscape
    "https://picsum.photos/id/12/400/400", // Beach
    "https://picsum.photos/id/13/400/400", // Mountain
    "https://picsum.photos/id/14/400/400", // Ocean
    "https://picsum.photos/id/15/400/400", // Waterfall
    "https://picsum.photos/id/16/400/400", // Sea
    "https://picsum.photos/id/17/400/400", // Path
  ];
  return images[seed % images.length];
}
