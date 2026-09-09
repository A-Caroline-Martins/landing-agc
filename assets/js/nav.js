// Menu mobile (hamburguer) — abre/fecha o .menu em telas pequenas
(function () {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("navMenu");

  if (!toggle || !menu) return;

  function closeMenu() {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.querySelector("i").className = "fa-solid fa-bars";
  }

  function toggleMenu() {
    const isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.querySelector("i").className = isOpen
      ? "fa-solid fa-xmark"
      : "fa-solid fa-bars";
  }

  toggle.addEventListener("click", toggleMenu);

  // fecha o menu ao clicar em qualquer link (navegação por âncora)
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // fecha o menu se a tela for redimensionada para desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });
})();
