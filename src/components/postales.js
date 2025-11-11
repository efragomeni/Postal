document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.querySelector("#contenedorPostales");

  try {
    const respuesta = await fetch("../../src/data/datos-prueba-postales.json");
    const postales = await respuesta.json();

    // Limpiamos el contenedor antes de agregar las postales
    contenedor.innerHTML = "";
    
    postales.forEach((post) => {
      console.log(post.imagen)
      // Evitamos mostrar post vacíos
      if (!post.titulo.trim()) return;

      // Creamos el contenedor principal de la postal
      const divPostal = document.createElement("div");
      divPostal.classList.add("postal");

      // Insertamos el contenido usando tu estructura HTML y estilos
      divPostal.innerHTML = `
        <h1>${post.titulo}</h1>
        
        <div class="postal-us">
          <img src="${post.imagen}">
          <h3>${post.usuario}</h3>
        </div>

        <div class="postal-fecha">
          <img src="../../src/assets/icons/calendar.svg" alt="calendar">
          <h3>${post.date}</h3>
        </div>

        <div class="postal-contenido">
          ${post.contenido}
        </div>

        <div class="postal-replies">
          <img src="../../src/assets/icons/chat.svg" alt="globo">
          <h3>${Object.keys(post.replies).length} respuestas</h3>
        </div>
      `;

      // Agregamos la postal al contenedor principal
      contenedor.appendChild(divPostal);
    });
  } catch (error) {
    console.error("Error al cargar las postales:", error);
  }
});
