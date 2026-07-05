export type GameType = "hangman" | "puzzle" | "crossword";
import { PALABRAS as CRUCIGRAMA_PALABRAS } from "./crossword_words";

export interface DailyGameData {
  type: GameType;
  dateStr: string;
  seed: number;
}

export function getDailyGame(): DailyGameData {
  // Use local date string to ensure it changes at midnight local time
  const today = new Date();
  today.setDate(today.getDate()+2); // Prueba con +1, o +2

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

/*.*.*.* Ahorcado  *.*.*.*/
export interface HangmanWord {
  palabra: string;
  definición: string;
}

export const PALABRAS: HangmanWord[] = [
  {
    "palabra": "Abstraer",
    "definición": "Separar por medio de una operación intelectual las cualidades de un objeto para considerarlas aisladamente."
  },
  {
    "palabra": "Acervo",
    "definición": "Conjunto de bienes, valores o conocimientos que pertenecen a un grupo o comunidad."
  },
  {
    "palabra": "Acicate",
    "definición": "Estímulo que mueve o incita a hacer algo."
  },
  {
    "palabra": "Acuarela",
    "definición": "Técnica de pintura que utiliza colores disueltos en agua sobre papel."
  },
  {
    "palabra": "Afable",
    "definición": "Que es agradable, dulce y suave en la conversación y el trato."
  },
  {
    "palabra": "Alborozo",
    "definición": "Alegría intensa que se manifiesta con gran viveza."
  },
  {
    "palabra": "Alquimia",
    "definición": "Antigua disciplina filosófica y protocientífica que buscaba la transmutación de los metales y la piedra filosofal."
  },
  {
    "palabra": "Ambiguo",
    "definición": "Que puede entenderse de varios modos o admitir distintas interpretaciones."
  },
  {
    "palabra": "Vaguedad",
    "definición": "Falta de precisión, exactitud o claridad en el significado de un término."
  },
  {
    "palabra": "Anacronico",
    "definición": "Que no corresponde a la época en la que se sitúa o que parece propio de otro tiempo."
  },
  {
    "palabra": "Apogeo",
    "definición": "Punto culminante o de mayor intensidad, grandeza o éxito de un proceso o situación."
  },
  {
    "palabra": "Aptitud",
    "definición": "Capacidad o suficiencia para operar competentemente en una determinada actividad."
  },
  {
    "palabra": "Atonito",
    "definición": "Asombrado, estupefacto o desconcertado ante algo extraordinario."
  },
  {
    "palabra": "Audaz",
    "definición": "Que es capaz de emprender acciones arriesgadas sin vacilar y mostrando valentía."
  },
  {
    "palabra": "Autoctono",
    "definición": "Que ha nacido o se ha originado en el mismo lugar donde se encuentra."
  },
  {
    "palabra": "Axioma",
    "definición": "Proposición tan clara y evidente que se admite por sí misma sin necesidad de demostración."
  },
  {
    "palabra": "Banal",
    "definición": "Que es intrascendente, poco importante o común."
  },
  {
    "palabra": "Benevolencia",
    "definición": "Cualidad de la persona que es buena, comprensiva y tolerante."
  },
  {
    "palabra": "Bifurcacion",
    "definición": "Lugar o punto en el que algo se divide en dos ramales o caminos."
  },
  {
    "palabra": "Bohemio",
    "definición": "Estilo de vida que se aparta de las normas sociales establecidas, especialmente asociado a artistas y escritores."
  },
  {
    "palabra": "Brecha",
    "definición": "Abertura o separación que indica una diferencia, interrupción o falta de conexión entre dos cosas."
  },
  {
    "palabra": "Bucolico",
    "definición": "Que evoca o idealiza la vida en el campo, caracterizada por la paz y la tranquilidad."
  },
  {
    "palabra": "Burdo",
    "definición": "Que es tosco, grosero o falto de delicadeza y refinamiento."
  },
  {
    "palabra": "Candidez",
    "definición": "Sencillez, falta de malicia o inocencia extrema en el carácter o el comportamiento."
  },
  {
    "palabra": "Capricho",
    "definición": "Deseo pasajero, extravagante y sin una justificación clara o necesidad real."
  },
  {
    "palabra": "Carisma",
    "definición": "Atractivo o magnetismo personal que ejerce una persona sobre los demás y le hace destacar."
  },
  {
    "palabra": "Caudal",
    "definición": "Cantidad de agua de una corriente, o conjunto de bienes y riquezas que posee una persona."
  },
  {
    "palabra": "Celebre",
    "definición": "Que es muy conocido y admirado por sus buenas cualidades o logros."
  },
  {
    "palabra": "Cenit",
    "definición": "Punto más alto en el cielo con relación a un punto dado sobre la Tierra; momento de mayor gloria."
  },
  {
    "palabra": "Cimiento",
    "definición": "Parte de una construcción que está enterrada y sirve de base y apoyo al resto del edificio."
  },
  {
    "palabra": "Coalescencia",
    "definición": "Proceso por el cual dos o más cosas, como gotas de líquido, se funden o se unen en una sola."
  },
  {
    "palabra": "Coherente",
    "definición": "Que tiene relación lógica y conexión con otras cosas, o que actúa en consecuencia con sus ideas."
  },
  {
    "palabra": "Coloquial",
    "definición": "Propio de la conversación informal, familiar y cotidiana."
  },
  {
    "palabra": "Compendio",
    "definición": "Breve y concisa exposición de lo más importante de un tema o materia amplia."
  },
  {
    "palabra": "Concebir",
    "definición": "Formar una idea, un diseño o un proyecto en la mente."
  },
  {
    "palabra": "Conciso",
    "definición": "Que expresa las ideas con pocas palabras, de forma breve y exacta."
  },
  {
    "palabra": "Confluencia",
    "definición": "Punto en el que se juntan dos o más corrientes de agua, caminos o eventos."
  },
  {
    "palabra": "Congenito",
    "definición": "Que se manifiesta desde el nacimiento y tiene su origen en el desarrollo embrionario o genético."
  },
  {
    "palabra": "Consenso",
    "definición": "Acuerdo producido por consentimiento entre todos los miembros de un grupo."
  },
  {
    "palabra": "Contracara",
    "definición": "Cara o aspecto opuesto y distinto de una misma cosa."
  },
  {
    "palabra": "Corroborar",
    "definición": "Confirmar, dar más seguridad o apoyar una opinión o teoría con nuevos datos o evidencias."
  },
  {
    "palabra": "Cosmopolita",
    "definición": "Dicho de una persona, ciudad o cultura, que está abierta a todas las influencias y manifestaciones de diversos países."
  },
  {
    "palabra": "Criterio",
    "definición": "Regla o norma conforme a la cual se establece un juicio o se toma una decisión."
  },
  {
    "palabra": "Criptico",
    "definición": "Que es enigmático, oscuro y de difícil comprensión."
  },
  {
    "palabra": "Cursi",
    "definición": "Dicho de una persona o cosa que pretende ser elegante o refinada pero resulta ridícula o de mal gusto."
  },
  {
    "palabra": "Debacle",
    "definición": "Gran desastre, ruina o destrucción repentina."
  },
  {
    "palabra": "Deduccion",
    "definición": "Método de razonamiento que consiste en sacar una conclusión particular a partir de principios generales."
  },
  {
    "palabra": "Deficit",
    "definición": "Falta o escasez de algo que se considera necesario, en especial de dinero."
  },
  {
    "palabra": "Deleite",
    "definición": "Placer del ánimo o de los sentidos; gozo muy intenso."
  },
  {
    "palabra": "Deliberar",
    "definición": "Considerar atenta y detenidamente los pros y los contras de una decisión antes de tomarla."
  },
  {
    "palabra": "Demagogia",
    "definición": "Práctica política que apela a las emociones, prejuicios y deseos del pueblo para ganar su apoyo."
  },
  {
    "palabra": "Denodado",
    "definición": "Que actúa con gran valor, decisión y sin temor."
  },
  {
    "palabra": "Denostar",
    "definición": "Insultar, ofender o despreciar a alguien de palabra."
  },
  {
    "palabra": "Depurar",
    "definición": "Limpiar, purificar o quitar imperfecciones a algo."
  },
  {
    "palabra": "Desidia",
    "definición": "Falta de ganas, cuidado o interés en el desarrollo de una acción o tarea."
  },
  {
    "palabra": "Destreza",
    "definición": "Habilidad, agilidad o talento para hacer algo de manera correcta y con facilidad."
  },
  {
    "palabra": "Dicotomia",
    "definición": "División en dos partes de una misma cosa, especialmente cuando son contradictorias o excluyentes."
  },
  {
    "palabra": "Didactico",
    "definición": "Que tiene la intención de enseñar o instruir de manera clara y amena."
  },
  {
    "palabra": "Dilema",
    "definición": "Situación en la que es necesario elegir entre dos opciones igualmente buenas o igualmente desfavorables."
  },
  {
    "palabra": "Dilucidar",
    "definición": "Aclarar, explicar o arrojar luz sobre un asunto que resulta confuso."
  },
  {
    "palabra": "Dinamico",
    "definición": "Que implica movimiento, energía, transformación o constante actividad."
  },
  {
    "palabra": "Discrepancia",
    "definición": "Diferencia, falta de acuerdo o desacuerdo entre dos o más personas o ideas."
  },
  {
    "palabra": "Disentir",
    "definición": "No estar de acuerdo con una idea, declaración o creencia."
  },
  {
    "palabra": "Disimular",
    "definición": "Ocultar o enmascarar con astucia una intención, emoción o la propia identidad."
  },
  {
    "palabra": "Disipar",
    "definición": "Hacer desaparecer una cosa (como el humo, las dudas o la tristeza) dispersándola o desvaneciéndola."
  },
  {
    "palabra": "Disonancia",
    "definición": "Falta de armonía, especialmente en sonidos, ideas o comportamientos."
  },
  {
    "palabra": "Dogma",
    "definición": "Principio o conjunto de ellos que se establecen como base indiscutible de una creencia o sistema."
  },
  {
    "palabra": "Efimero",
    "definición": "Que dura muy poco tiempo o es pasajero."
  },
  {
    "palabra": "Elocuencia",
    "definición": "Capacidad de expresarse de manera persuasiva, fluida y eficaz para conmover o deleitar."
  },
  {
    "palabra": "Elucidar",
    "definición": "Poner en claro un asunto misterioso o complicado; aclarar."
  },
  {
    "palabra": "Empatia",
    "definición": "Capacidad de comprender y compartir los sentimientos, pensamientos y emociones de los demás."
  },
  {
    "palabra": "Empirico",
    "definición": "Que se basa en la experiencia, la observación directa y los sentidos, más que en la teoría."
  },
  {
    "palabra": "Enigma",
    "definición": "Misterio o cosa que no se puede comprender o que es muy difícil de descifrar."
  },
  {
    "palabra": "Epilogo",
    "definición": "Sección final de una obra literaria o cinematográfica que sirve para cerrar o dar conclusión a la historia."
  },
  {
    "palabra": "Equidad",
    "definición": "Justicia natural y rectitud, otorgando a cada individuo lo que le corresponde según sus méritos o necesidades."
  },
  {
    "palabra": "Erudito",
    "definición": "Que tiene un conocimiento profundo y amplio sobre una materia, adquirido mediante el estudio."
  },
  {
    "palabra": "Escepticismo",
    "definición": "Actitud de duda o incredulidad generalizada hacia la verdad de las cosas o la capacidad de conocerlas."
  },
  {
    "palabra": "Esoterico",
    "definición": "Oculto, secreto o de difícil acceso para la mente humana, generalmente asociado a ciencias o doctrinas misteriosas."
  },
  {
    "palabra": "Espontaneo",
    "definición": "Que surge de forma natural, sin premeditación o sin haber sido provocado por estímulos externos."
  },
  {
    "palabra": "Estatico",
    "definición": "Que permanece en un mismo estado, sin experimentar cambios, movimientos o alteraciones."
  },
  {
    "palabra": "Etereo",
    "definición": "Algo extremadamente delicado, ligero o sutil, casi incorpóreo."
  },
  {
    "palabra": "Etimologia",
    "definición": "Estudio del origen de las palabras, de la razón de su existencia, de su significado y de su forma."
  },
  {
    "palabra": "Euforia",
    "definición": "Sensación intensa de alegría, bienestar y optimismo, a menudo desproporcionada con la realidad."
  },
  {
    "palabra": "Exacerbar",
    "definición": "Agravar o aumentar la intensidad de un sentimiento, dolor, enfermedad o situación negativa."
  },
  {
    "palabra": "Excelencia",
    "definición": "Cualidad de ser sobresaliente, de la más alta calidad o tener gran mérito."
  },
  {
    "palabra": "Excentrico",
    "definición": "Que se aparta de lo común, habitual o convencional, especialmente en el comportamiento."
  },
  {
    "palabra": "Exhortar",
    "definición": "Incitar, animar o pedir a alguien con autoridad que realice una acción."
  },
  {
    "palabra": "Exiguo",
    "definición": "Que es muy pequeño, insuficiente o escaso."
  },
  {
    "palabra": "Exotico",
    "definición": "Que es extranjero, inusual, llamativo o que procede de un país o cultura lejana."
  },
  {
    "palabra": "Expansivo",
    "definición": "Que se comunica y expresa sus sentimientos con facilidad, franqueza y alegría."
  },
  {
    "palabra": "Explayarse",
    "definición": "Extenderse o explayarse explicando algo con detalle o abundancia de palabras."
  },
  {
    "palabra": "Explicito",
    "definición": "Que expresa una idea o condición de forma clara, directa y sin ambigüedades."
  },
  {
    "palabra": "Extrapolar",
    "definición": "Aplicar una conclusión o principio obtenido en un ámbito determinado a otro distinto o más general."
  },
  {
    "palabra": "Extravagante",
    "definición": "Que es raro, peculiar, excesivamente original o fuera de lo común."
  },
  {
    "palabra": "Efimero",
    "definición": "Algo que dura poco tiempo."
  },
  {
    "palabra": "Falacia",
    "definición": "Argumento falso o engañoso que parece válido y correcto, pero que oculta un error en su lógica."
  },
  {
    "palabra": "Fascinante",
    "definición": "Que atrae, cautiva o llama poderosamente la atención por su gran atractivo o interés."
  },
  {
    "palabra": "Fertil",
    "definición": "Que tiene la capacidad de producir o engendrar en abundancia."
  },
  {
    "palabra": "Fervor",
    "definición": "Entusiasmo, admiración y dedicación intensa hacia algo o alguien."
  },
  {
    "palabra": "Fidedigno",
    "definición": "Que es digno de ser creído o que es totalmente verdadero y confiable."
  }
];

export function getDailyHangmanWord(seed: number): HangmanWord {
  return PALABRAS[seed % PALABRAS.length];
}


/*.*.*.* Crucigrama dinámico  *.*.*.*/

/** Normaliza una palabra en español: mayúsculas, sin tildes, sin caracteres especiales */
function normalizeSpanish(word: string): string {
  return word
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // elimina diacríticos (tildes, diéresis)
    .replace(/[^A-Z]/g, "");          // solo letras A-Z
}

/** Shuffle determinístico con semilla (LCG) */
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = Math.abs(((s * 1664525) + 1013904223) | 0);
    const j = Math.abs(s) % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Verifica si una palabra puede colocarse en la posición dada.
 * Reglas:
 * 1. No conflictos de letras
 * 2. No extender palabras existentes (celda antes/después libre)
 * 3. No crear palabras paralelas adyacentes
 * 4. Debe intersecar al menos una celda existente
 */
function canPlaceWord(
  gridMap: Map<string, string>,
  word: string,
  direction: "across" | "down",
  startRow: number,
  startCol: number
): boolean {
  const dr = direction === "down" ? 1 : 0;
  const dc = direction === "across" ? 1 : 0;
  const len = word.length;

  // Celda antes del inicio (no puede extender una palabra existente)
  if (gridMap.has(`${startRow - dr},${startCol - dc}`)) return false;
  // Celda después del fin
  if (gridMap.has(`${startRow + dr * len},${startCol + dc * len}`)) return false;

  let intersections = 0;

  for (let i = 0; i < len; i++) {
    const r = startRow + dr * i;
    const c = startCol + dc * i;
    const existing = gridMap.get(`${r},${c}`);

    if (existing !== undefined) {
      // La celda ya existe: debe coincidir con la letra
      if (existing !== word[i]) return false;
      intersections++;
    } else {
      // Celda vacía: verificar que no haya celdas perpendiculares ocupadas
      // (evita palabras paralelas adyacentes)
      const perp1 = `${r + dc},${c + dr}`;
      const perp2 = `${r - dc},${c - dr}`;
      if (gridMap.has(perp1) || gridMap.has(perp2)) return false;
    }
  }

  // Debe tener al menos una intersección con palabras existentes
  return intersections > 0;
}

export interface CrosswordCellData {
  letter: string;
  clueNumber?: number;
  wordIndices: number[];
}

export interface CrosswordPlacedWord {
  word: string;          // Normalizada (sin tildes, mayúsculas)
  originalWord: string;  // Original con tildes
  definicion: string;
  direction: "across" | "down";
  startRow: number;
  startCol: number;
  clueNumber: number;
}

export interface CrosswordLayout {
  placedWords: CrosswordPlacedWord[];
  gridData: (CrosswordCellData | null)[][];
  gridHeight: number;
  gridWidth: number;
}

export function getDailyCrosswordLayout(seed: number): CrosswordLayout {
  // Normalizar y deduplicar todas las palabras
  const allCandidates = CRUCIGRAMA_PALABRAS
    .map(w => ({
      originalWord: w.palabra,
      definicion: w.definicion,
      normalized: normalizeSpanish(w.palabra),
    }))
    .filter(w => w.normalized.length >= 4 && w.normalized.length <= 14)
    // Eliminar duplicados por palabra normalizada
    .filter((w, idx, arr) => arr.findIndex(x => x.normalized === w.normalized) === idx);

  // Ordenar por longitud descendente para maximizar intersecciones
  const byLength = [...allCandidates].sort((a, b) => b.normalized.length - a.normalized.length);

  // Elegir la palabra más larga como eje central, el resto se baraja con la semilla
  const firstWord = byLength[0];
  const restWords = seededShuffle(
    allCandidates.filter(w => w.normalized !== firstWord.normalized),
    seed
  );

  const gridMap = new Map<string, string>(); // "r,c" → letra
  const tempPlaced: Array<{
    word: string;
    originalWord: string;
    definicion: string;
    direction: "across" | "down";
    startRow: number;
    startCol: number;
  }> = [];

  const CENTER = 30; // Coordenadas virtuales centradas

  // Colocar la primera palabra verticalmente en el centro
  const firstStartRow = CENTER - Math.floor(firstWord.normalized.length / 2);
  const firstStartCol = CENTER;
  for (let i = 0; i < firstWord.normalized.length; i++) {
    gridMap.set(`${firstStartRow + i},${firstStartCol}`, firstWord.normalized[i]);
  }
  tempPlaced.push({
    word: firstWord.normalized,
    originalWord: firstWord.originalWord,
    definicion: firstWord.definicion,
    direction: "down",
    startRow: firstStartRow,
    startCol: firstStartCol,
  });

  // Intentar colocar hasta 15 palabras en total
  for (const candidate of restWords) {
    if (tempPlaced.length >= 15) break;
    const norm = candidate.normalized;
    let placed = false;

    // Intentar intersecar con cada palabra ya colocada
    for (const pw of tempPlaced) {
      if (placed) break;
      const perpDir = pw.direction === "across" ? "down" : "across";

      // Iterar por cada letra de la palabra colocada (punto de intersección potencial)
      for (let pi = 0; pi < pw.word.length && !placed; pi++) {
        // Iterar por cada letra del candidato
        for (let ci = 0; ci < norm.length && !placed; ci++) {
          if (pw.word[pi] !== norm[ci]) continue;

          // Calcular posición de inicio del candidato
          let newStartRow: number, newStartCol: number;
          if (pw.direction === "across") {
            newStartRow = pw.startRow - ci;
            newStartCol = pw.startCol + pi;
          } else {
            newStartRow = pw.startRow + pi;
            newStartCol = pw.startCol - ci;
          }

          if (canPlaceWord(gridMap, norm, perpDir, newStartRow, newStartCol)) {
            const dr = perpDir === "down" ? 1 : 0;
            const dc = perpDir === "across" ? 1 : 0;
            for (let i = 0; i < norm.length; i++) {
              gridMap.set(`${newStartRow + dr * i},${newStartCol + dc * i}`, norm[i]);
            }
            tempPlaced.push({
              word: norm,
              originalWord: candidate.originalWord,
              definicion: candidate.definicion,
              direction: perpDir,
              startRow: newStartRow,
              startCol: newStartCol,
            });
            placed = true;
          }
        }
      }
    }
  }

  // Calcular límites de la cuadrícula
  let minRow = Infinity, maxRow = -Infinity;
  let minCol = Infinity, maxCol = -Infinity;
  for (const key of gridMap.keys()) {
    const [r, c] = key.split(",").map(Number);
    minRow = Math.min(minRow, r);
    maxRow = Math.max(maxRow, r);
    minCol = Math.min(minCol, c);
    maxCol = Math.max(maxCol, c);
  }

  const gridHeight = maxRow - minRow + 1;
  const gridWidth  = maxCol  - minCol  + 1;

  // Normalizar coordenadas (origen en 0,0)
  const normalizedPlaced = tempPlaced.map(pw => ({
    ...pw,
    startRow: pw.startRow - minRow,
    startCol: pw.startCol - minCol,
  }));

  // Asignar números de pistas: de arriba-abajo, izquierda-derecha
  const startKeys = new Map<string, number>(); // "r,c" → número de pista
  const sortedByPos = [...normalizedPlaced].sort((a, b) =>
    a.startRow !== b.startRow ? a.startRow - b.startRow : a.startCol - b.startCol
  );
  let clueNum = 1;
  for (const pw of sortedByPos) {
    const key = `${pw.startRow},${pw.startCol}`;
    if (!startKeys.has(key)) startKeys.set(key, clueNum++);
  }

  const placedWords: CrosswordPlacedWord[] = normalizedPlaced.map(pw => ({
    word: pw.word,
    originalWord: pw.originalWord,
    definicion: pw.definicion,
    direction: pw.direction,
    startRow: pw.startRow,
    startCol: pw.startCol,
    clueNumber: startKeys.get(`${pw.startRow},${pw.startCol}`)!,
  }));

  // Construir gridData (array 2D de celdas)
  const gridData: (CrosswordCellData | null)[][] = Array.from(
    { length: gridHeight },
    () => Array(gridWidth).fill(null)
  );

  placedWords.forEach((pw, pwIdx) => {
    const dr = pw.direction === "down" ? 1 : 0;
    const dc = pw.direction === "across" ? 1 : 0;
    for (let i = 0; i < pw.word.length; i++) {
      const r = pw.startRow + dr * i;
      const c = pw.startCol + dc * i;
      if (!gridData[r][c]) {
        gridData[r][c] = { letter: pw.word[i], wordIndices: [pwIdx] };
      } else {
        if (!gridData[r][c]!.wordIndices.includes(pwIdx)) {
          gridData[r][c]!.wordIndices.push(pwIdx);
        }
      }
      if (i === 0) {
        gridData[r][c]!.clueNumber = pw.clueNumber;
      }
    }
  });

  return { placedWords, gridData, gridHeight, gridWidth };
}
/*
export function getDailyPuzzleImage(seed: number): string {
  const images = [
    /*"/img/Puzzle/1.jpeg",
  ];
  return images[seed % images.length];
}
*/