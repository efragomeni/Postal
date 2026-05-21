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

/*.*.*.* Ahorcado  *.*.*.*/
export interface HangmanWord {
  palabra: string;
  definición: string;
}

export function getDailyHangmanWord(seed: number): HangmanWord {
  // const words = [
  //   "POSTAL", "CORREO", "MENSAJE", "USUARIO", "SISTEMA", 
  //   "INTERNET", "TECNOLOGIA", "FORO", "COMUNIDAD", "ARGENTINA",
  //   "PROVINCIA", "COMPUTADORA", "PLATAFORMA", "SEGURIDAD", "PROGRAMA"
  // ];
  
  const words=[

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
    "palabra": "Ambigüedad",
    "definición": "Cualidad de ambiguo, inexactitud o incertidumbre."
  },
  {
    "palabra": "Anacrónico",
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
    "palabra": "Atónito",
    "definición": "Asombrado, estupefacto o desconcertado ante algo extraordinario."
  },
  {
    "palabra": "Audaz",
    "definición": "Que es capaz de emprender acciones arriesgadas sin vacilar y mostrando valentía."
  },
  {
    "palabra": "Autóctono",
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
    "palabra": "Bifurcación",
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
    "palabra": "Bucólico",
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
    "palabra": "Célebre",
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
    "palabra": "Congénito",
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
    "palabra": "Críptico",
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
    "palabra": "Deducción",
    "definición": "Método de razonamiento que consiste en sacar una conclusión particular a partir de principios generales."
  },
  {
    "palabra": "Déficit",
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
    "palabra": "Dicotomía",
    "definición": "División en dos partes de una misma cosa, especialmente cuando son contradictorias o excluyentes."
  },
  {
    "palabra": "Didáctico",
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
    "palabra": "Dinámico",
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
    "palabra": "Efímero",
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
    "palabra": "Empatía",
    "definición": "Capacidad de comprender y compartir los sentimientos, pensamientos y emociones de los demás."
  },
  {
    "palabra": "Empírico",
    "definición": "Que se basa en la experiencia, la observación directa y los sentidos, más que en la teoría."
  },
  {
    "palabra": "Enigma",
    "definición": "Misterio o cosa que no se puede comprender o que es muy difícil de descifrar."
  },
  {
    "palabra": "Epílogo",
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
    "palabra": "Esotérico",
    "definición": "Oculto, secreto o de difícil acceso para la mente humana, generalmente asociado a ciencias o doctrinas misteriosas."
  },
  {
    "palabra": "Espontáneo",
    "definición": "Que surge de forma natural, sin premeditación o sin haber sido provocado por estímulos externos."
  },
  {
    "palabra": "Estático",
    "definición": "Que permanece en un mismo estado, sin experimentar cambios, movimientos o alteraciones."
  },
  {
    "palabra": "Etereo",
    "definición": "Algo extremadamente delicado, ligero o sutil, casi incorpóreo."
  },
  {
    "palabra": "Etimología",
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
    "palabra": "Excéntrico",
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
    "palabra": "Exótico",
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
    "palabra": "Efímero",
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
    "palabra": "Fértil",
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
    ]


  return words[seed % words.length];
}


/*.*.*.* Crucigrama  *.*.*.*/
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
