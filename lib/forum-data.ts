export interface Topic {
  id: string;
  title: string;
  author: string;
  content: string;
  createdAt: string;
  replies: Reply[];
}

export interface Reply {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

// Datos iniciales de ejemplo
const initialTopics: Topic[] = [
  {
    id: "1",
    title: "¿Cómo puedo compartir fotos con mi familia?",
    author: "María García",
    content:
      "Hola a todos, me gustaría aprender a compartir fotos con mis nietos. ¿Alguien puede ayudarme?",
    createdAt: new Date("2025-01-15").toISOString(),
    replies: [
      {
        id: "1",
        author: "Juan Pérez",
        content:
          "Hola María, puedes usar WhatsApp o correo electrónico. Es muy fácil.",
        createdAt: new Date("2025-01-15").toISOString(),
      },
      {
        id: "2",
        author: "Ana López",
        content:
          "También puedes crear un álbum en Google Fotos y compartirlo con ellos.",
        createdAt: new Date("2025-01-16").toISOString(),
      },
    ],
  },
  {
    id: "2",
    title: "Recetas de cocina tradicional",
    author: "Carlos Rodríguez",
    content:
      "¿Alguien tiene recetas de cocina tradicional para compartir? Me encantaría aprender nuevas recetas.",
    createdAt: new Date("2025-01-20").toISOString(),
    replies: [
      {
        id: "3",
        author: "Rosa Martínez",
        content:
          "Tengo una receta de paella que es deliciosa. Te la puedo compartir.",
        createdAt: new Date("2025-01-21").toISOString(),
      },
    ],
  },
  {
    id: "3",
    title: "Actividades para mantenerse activo",
    author: "Luis Fernández",
    content: "¿Qué actividades recomiendan para mantenerse activo y saludable?",
    createdAt: new Date("2025-01-25").toISOString(),
    replies: [],
  },
];

export function getTopics(): Topic[] {
  if (typeof window === "undefined") return initialTopics;

  const stored = localStorage.getItem("forum-topics");
  if (stored) {
    return JSON.parse(stored);
  }

  // Guardar datos iniciales
  localStorage.setItem("forum-topics", JSON.stringify(initialTopics));
  return initialTopics;
}

export function getTopic(id: string): Topic | null {
  const topics = getTopics();
  return topics.find((t) => t.id === id) || null;
}

export function createTopic(
  title: string,
  content: string,
  author: string
): Topic {
  const topics = getTopics();
  const newTopic: Topic = {
    id: Date.now().toString(),
    title,
    author,
    content,
    createdAt: new Date().toISOString(),
    replies: [],
  };

  topics.unshift(newTopic);
  localStorage.setItem("forum-topics", JSON.stringify(topics));
  return newTopic;
}

export function addReply(
  topicId: string,
  content: string,
  author: string
): void {
  const topics = getTopics();
  const topic = topics.find((t) => t.id === topicId);

  if (topic) {
    const newReply: Reply = {
      id: Date.now().toString(),
      author,
      content,
      createdAt: new Date().toISOString(),
    };

    topic.replies.push(newReply);
    localStorage.setItem("forum-topics", JSON.stringify(topics));
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
