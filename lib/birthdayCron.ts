import cron from "node-cron"; //Ejecuta funciones en momentos especificos como una alarma o despertador.
import User from "@/models/user";
import Topic from "@/models/topic";

/**
 * Compara cumpleaños usando UTC para evitar desfasajes de zona horaria. (mini relojero obsesivo jaja)
 */
function isTodayUTC(birthDate: Date): boolean {
  const now = new Date();

  return (
    birthDate.getUTCDate() === now.getUTCDate() &&
    birthDate.getUTCMonth() === now.getUTCMonth()
  );
}

export function startBirthdayCron() {
  //Se ejecuta minuto 1 hora 0, todos los dias, todos los meses, todas las semanas.
  cron.schedule("1 0 * * *", async () => {
    console.log("Buscando cumpleaños del día...");

    //Obtenemos todos los usuarios.
    const users = await User.find();
    //Recorremos los users
    for (const user of users) {
      //Si hay alguno sin fecha (porque quedo de lo viejo) lo saltea
      if (!user.fecnac) continue;

      //Fecha de nac pasa a date.
      const bday = new Date(user.fecnac);

      const isBirthday = isTodayUTC(bday);

      const alreadyPosted =
        user.lastBirthdayPost &&
        new Date(user.lastBirthdayPost).getUTCFullYear() ===
          new Date().getUTCFullYear();

      if (isBirthday && !alreadyPosted) {
        console.log("Creando topic automático para:", user.username);

        await Topic.create({
          author: user._id,
          profileImage: user.profileImage,
          title: `🎉 ¡Cumpleaños de ${user.username}!`,
          content: `Hoy es el cumpleaños de ${user.username}! 🎂🎉`,
          type: "birthday",
        });

        user.lastBirthdayPost = new Date();
        await user.save();
      }
    }
  });
}

/**
 * Para probar manualmente desde /api/test-birthday
 */
export async function runBirthdayCheckOnce() {
  console.log("Forzando chequeo manual de cumpleaños...");

  const users = await User.find();

  for (const user of users) {
    if (!user.fecnac) continue;

    const bday = new Date(user.fecnac);
    const today = new Date();

    console.log("------------");
    console.log("Usuario:", user.username);
    console.log("Cumple (UTC):", bday.toISOString());
    console.log("Hoy (UTC):", today.toISOString());

    const isBirthday = isTodayUTC(bday);

    console.log("¿Es hoy su cumpleaños (UTC)?", isBirthday);

    const alreadyPosted =
      user.lastBirthdayPost &&
      new Date(user.lastBirthdayPost).getUTCFullYear() ===
        today.getUTCFullYear();

    if (isBirthday && !alreadyPosted) {
      console.log("POST CREADO (PRUEBA):", user.username);

      await Topic.create({
        author: user._id,
        profileImage: user.profileImage,
        title: `🎉 ¡Cumpleaños de ${user.username}!`,
        content: `Hoy es el cumpleaños de ${user.username}! 🎂🎉`,
        type: "birthday",
      });

      user.lastBirthdayPost = today;
      await user.save();
    }
  }

  console.log("Chequeo manual finalizado.");
}
