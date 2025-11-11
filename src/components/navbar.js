document.addEventListener("DOMContentLoaded", () => {
  const header = document.createElement("header");
  header.innerHTML = `
    <nav class="navbar">
      <div class="imagen-navbar">
        <img src="./src/assets/img/POSTAL.png" alt="Logo Postal" />
      </div>
      <div class="contenedor-botones-nav">
        <button class="boton boton-nav">
          <img src="./src/assets/icons/Home.svg" alt="Inicio" /> Inicio
        </button>
        <button class="boton boton-nav">
          <img src="./src/assets/icons/user.svg" alt="Perfil" /> Perfil
        </button>
        <button class="boton boton-nav">
          <img src="./src/assets/icons/Plus.svg" alt="Nuevo tema" /> Nuevo tema
        </button>
        <button class="boton boton-nav">
          <img src="./src/assets/icons/Bell.svg" alt="Avisos" /> Avisos
        </button>
        <button class="boton boton-nav">
          <img src="./src/assets/icons/Exit.svg" alt="Salir" /> Salir
        </button>
      </div>
    </nav>
  `;

  document.body.prepend(header);
});