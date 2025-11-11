document.addEventListener("DOMContentLoaded", () => {
  const header = document.createElement("header");
  header.innerHTML = `
    <nav class="navbar">
      <div class="imagen-navbar">
        <img src="../../src/assets/img/POSTAL.png" alt="Logo Postal" />
      </div>
      <div class="contenedor-botones-nav">
        <button id="btnInicio" class="boton boton-nav">
          <img src="../../src/assets/icons/Home.svg" alt="Inicio" /> Inicio
        </button>
        <button id="btnPerfil" class="boton boton-nav">
          <img src="../../src/assets/icons/user.svg" alt="Perfil" /> Perfil
        </button>
        <button id="btnNuevoTema" class="boton boton-nav">
          <img src="../../src/assets/icons/Plus.svg" alt="Nuevo tema" /> Nuevo tema
        </button>
        <button id="btnAvisos" class="boton boton-nav">
          <img src="../../src/assets/icons/Bell.svg" alt="Avisos" /> Avisos
        </button>
        <button id="btnSalir" class="boton boton-nav">
          <img src="../../src/assets/icons/Exit.svg" alt="Salir" /> Salir
        </button>
      </div>
    </nav>
  `;

  document.body.prepend(header);

  // Asignamos las redirecciones
  document.getElementById("btnInicio").addEventListener("click", () => {
    location.href = "../../pages/usuarios/home.html";
  });

  document.getElementById("btnPerfil").addEventListener("click", () => {
    location.href = "../../pages/usuarios/perfil.html";
  });

  document.getElementById("btnNuevoTema").addEventListener("click", () => {
    location.href = "../../pages/usuarios/nuevo-tema.html";
  });

  document.getElementById("btnAvisos").addEventListener("click", () => {
    location.href = "../../pages/usuarios/avisos.html";
  });

  document.getElementById("btnSalir").addEventListener("click", () => {
    location.href = "../../index.html";
  });
});
