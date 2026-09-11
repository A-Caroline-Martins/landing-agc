// Animações de entrada ao rolar a página (scroll reveal).
// A classe .reveal só é aplicada por aqui — se o JS não rodar, nenhum
// elemento fica escondido, então o site continua funcionando sem animação.
(function () {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const observer = prefersReducedMotion
    ? null
    : new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
      );

  function reveal(el, delayMs) {
    if (!el) return;
    el.classList.add("reveal");
    if (delayMs) el.style.transitionDelay = delayMs + "ms";
    if (prefersReducedMotion) {
      el.classList.add("is-visible");
    } else {
      observer.observe(el);
    }
  }

  // Cartões e itens repetidos: entram em cascata (delay crescente,
  // limitado para o grupo não demorar demais pra terminar de aparecer).
  function revealGroup(containerSelector, itemSelector, staggerMs, maxSteps) {
    document.querySelectorAll(containerSelector).forEach((container) => {
      container.querySelectorAll(itemSelector).forEach((item, i) => {
        reveal(item, Math.min(i, maxSteps || 5) * staggerMs);
      });
    });
  }

  // Blocos de texto/título de cada seção — fade simples, sem cascata.
  const singleSelectors = [
    ".about-texts",
    ".about-image",
    ".how-container > .eyebrow",
    ".how-container > .services-title",
    ".how-container > .services-description",
    ".agc-demo-container > .eyebrow",
    ".agc-demo-container > .services-title",
    ".agc-demo-container > .services-description",
    ".technology-content",
    ".technology-image",
    ".urgency-container > *",
    ".objection-container > *",
    ".pricing-container > .eyebrow",
    ".pricing-container > .services-title",
    ".pricing-container > .services-description",
    ".services-container > .eyebrow",
    ".services-container > .services-title",
    ".services-container > .services-description",
    ".services-bottom",
    ".testimonials-container > .eyebrow",
    ".testimonials-container > .services-title",
    ".faq-container > .eyebrow",
    ".faq-container > .services-title",
    ".contact-container > .eyebrow",
    ".contact-title",
    ".contact-description",
    ".contact-form",
    ".partners-container > *",
    ".final-cta-badge",
    ".final-cta-title",
    ".final-cta-description",
    ".final-cta-buttons",
    ".final-cta-note",
    ".final-cta-badges",
  ].join(",");

  document.querySelectorAll(singleSelectors).forEach((el) => reveal(el));

  revealGroup(".steps-grid", ".step-card", 90);
  revealGroup(".services-grid", ".service-card", 80);
  revealGroup(".testimonials-grid", ".testimonial-card", 90);
  revealGroup(".pricing-grid", ".pricing-card", 100);
  revealGroup(".faq-list", ".faq-item", 70);
  revealGroup(".chat-body", ".chat-bubble", 250);
  revealGroup(".technology-features", ".technology-feature", 100);
  revealGroup(".about-stats", ".about-stat", 90);
})();
