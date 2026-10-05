
(function () {
  const button = document.querySelector(".whatsapp-float");
  const about = document.querySelector("#about");
  if (!button || !about || !("IntersectionObserver" in window)) return;

  button.classList.add("is-waiting");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
      
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
          button.classList.remove("is-waiting");
          observer.disconnect();
        }
      });
    },
   
    { rootMargin: "0px 0px -50% 0px" }
  );

  observer.observe(about);
})();
