// Alternância de tema claro/escuro.
// Aplica o tema salvo (ou o do sistema) imediatamente, antes do primeiro
// paint, para não piscar; depois cuida do clique no botão .btn-theme.
(function () {
  const STORAGE_KEY = "agc-theme";
  const root = document.documentElement;
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return media.matches ? "dark" : "light";
  }

  function updateIcon(theme) {
    const icon = document.querySelector(".btn-theme img");
    if (!icon) return;
    // O ícone exibido representa o tema para o qual o clique vai mudar.
    if (theme === "dark") {
      icon.src = "assets/img/sunny-outline.svg";
      icon.alt = "Ativar tema claro";
    } else {
      icon.src = "assets/img/moon-outline.svg";
      icon.alt = "Ativar tema escuro";
    }
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    updateIcon(theme);
  }

  let currentTheme = getPreferredTheme();
  // Define o atributo já aqui (script roda no <head>, antes do CSS ser
  // aplicado), evitando o flash de tema errado.
  root.setAttribute("data-theme", currentTheme);

  document.addEventListener("DOMContentLoaded", function () {
    updateIcon(currentTheme);

    const toggle = document.querySelector(".btn-theme");
    if (!toggle) return;

    toggle.addEventListener("click", function () {
      currentTheme = currentTheme === "dark" ? "light" : "dark";
      localStorage.setItem(STORAGE_KEY, currentTheme);
      applyTheme(currentTheme);
    });
  });

  // Acompanha a mudança do tema do sistema enquanto o usuário não escolher
  // manualmente um tema (nenhuma preferência salva ainda).
  media.addEventListener("change", function (e) {
    if (localStorage.getItem(STORAGE_KEY)) return;
    currentTheme = e.matches ? "dark" : "light";
    applyTheme(currentTheme);
  });
})();
