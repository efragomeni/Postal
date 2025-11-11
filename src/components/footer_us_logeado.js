document.addEventListener("DOMContentLoaded", () => {
  const footer = document.createElement("footer");
  footer.innerHTML = `
    <div class="contenedor-botones-nav-footer">
        <!-- Arreglar Iconos para q sean como los del figma -->
        <button class="boton boton-nav">
          <img src="../../src/assets/icons/Home.svg" alt="" />
        </button>
        <button class="boton boton-nav">
          <img src="../../src/assets/icons/user.svg" alt="" /></button
        ><button class="boton boton-nav">
          <img src="../../src/assets/icons/Plus.svg" alt="" /></button
        ><button class="boton boton-nav">
          <img src="../../src/assets/icons/Bell.svg" alt="" /></button
        ><button class="boton boton-nav">
          <img src="../../src/assets/icons/Exit.svg" alt="" />
        </button>
      </div>
    `;

  document.body.prepend(footer);
});
