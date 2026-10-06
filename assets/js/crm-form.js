// Orflie CRM - Captura de Formulário
// Envia os dados dos formulários do topo (#form-hero) e de contato
// (#form-contato) para o webhook do CRM.
(function () {
  var WEBHOOK_URL =
    "https://orflia.ai/api/webhooks/formulario/b7886825-dbc4-43e9-ba53-10bc1e4aced7";
  var STATUS_DURATION_MS = 3000;

  // Aviso logo abaixo do botão de enviar, no lugar do alert()
  function showStatus(form, type, message) {
    var status = form.querySelector(".form-status");
    if (!status) {
      status = document.createElement("p");
      status.className = "form-status";
      status.setAttribute("role", "status");
      status.setAttribute("aria-live", "polite");
      form.appendChild(status);
    }

    clearTimeout(status._hideTimer);
    status.textContent = message;
    status.classList.remove("form-status--success", "form-status--error");
    status.classList.add("form-status--" + type);
    status.hidden = false;
    // força o reflow pra transição de entrada rodar
    void status.offsetWidth;
    status.classList.add("is-visible");

    status._hideTimer = setTimeout(function () {
      status.classList.remove("is-visible");
      status.addEventListener(
        "transitionend",
        function () {
          if (!status.classList.contains("is-visible")) status.hidden = true;
        },
        { once: true }
      );
    }, STATUS_DURATION_MS);
  }

  // Texto que vai pro CRM para cada opção de segmento
  var SEGMENT_LABELS = {
    dentista: "Dentista",
    clinica: "Clínica médica ou estética",
    advogado: "Advogado",
    consultor: "Consultor / Coach",
    terapeuta: "Terapeuta",
    outro: "Outro",
  };

  function sendToCrm(form) {
    var button = form.querySelector('[type="submit"]');
    if (button) button.disabled = true; // evita envio duplicado

    var data = {};
    new FormData(form).forEach(function (v, k) {
      data[k] = v;
    });

    // Converte o value do segmento (ex.: "clinica") para texto legível e,
    // como o form de contato não tem campo de mensagem, manda como mensagem.
    if (data.segment) {
      data.segment = SEGMENT_LABELS[data.segment] || data.segment;
      if (!data.message) data.message = "Segmento: " + data.segment;
    }

    fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(function (r) {
        // Nem toda resposta vem em JSON: se o status for 2xx, já conta
        // como sucesso; se vier JSON com ok: false, conta como erro.
        return r
          .json()
          .catch(function () {
            return {};
          })
          .then(function (res) {
            if (!r.ok || res.ok === false) {
              throw new Error("CRM respondeu " + r.status);
            }
          });
      })
      .then(function () {
        showStatus(form, "success", "Obrigado! Entraremos em contato em breve.");
        form.reset();
      })
      .catch(function (err) {
        console.error(err);
        showStatus(
          form,
          "error",
          "Não foi possível enviar agora. Tente novamente ou fale com a gente pelo WhatsApp."
        );
      })
      .finally(function () {
        if (button) button.disabled = false;
      });
  }

  // Escuta no documento (e não em cada form) pra funcionar mesmo que o
  // formulário seja renderizado depois do script.
  document.addEventListener("submit", function (e) {
    var form = e.target;
    if (!form.matches || !form.matches("#form-hero, #form-contato")) return;
    e.preventDefault();
    sendToCrm(form);
  });
})();
