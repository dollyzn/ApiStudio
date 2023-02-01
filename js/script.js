const animationSwalShowClass = "animate__animated animate__zoomIn";
const animationSwalHideClass = "animate__animated animate__zoomOut";

function getCookie(k) {
  var cookies = " " + document.cookie;
  var key = " " + k + "=";
  var start = cookies.indexOf(key);

  if (start === -1) return null;

  var pos = start + key.length;
  var last = cookies.indexOf(";", pos);

  if (last !== -1) return cookies.substring(pos, last);

  return cookies.substring(pos);
}

$("document").ready(function () {
  if (!getCookie("introjs-dontShowAgain")) {
    setTimeout(function () {
      Swal.close();
      introJs()
        .setOptions({
          doneLabel: "Ok!",
          dontShowAgain: true,
          dontShowAgainLabel: "Não mostrar novamente",
          dontShowAgainCookieDays: "7",
          showBullets: false,
          disableInteraction: true,
          showButtons: false,
        })
        .start();
    }, 1000);
  }
  $("#message1").val(message);
});

$(".body")
  .each(function () {
    this.setAttribute("style", "height: 100 px;");
  })
  .on("input", function () {
    this.style.height = 0;
    this.style.height = this.scrollHeight + "px";
  });

$("#whatsapp").change(function () {
  var name = $("#whatsapp").find(":selected").text();
  var id = $("#whatsapp").find(":selected").val();

  sessionStorage.setItem("whatsappId", id);
  changeWhatsapp(1, name);
});

$("#whatsapp2").change(function () {
  var message = $("#whatsapp2").find(":selected").val();

  changeWhatsapp(2, message);
});

$("#whatsapp3").change(function () {
  var message = $("#whatsapp3").find(":selected").val();

  changeWhatsapp(3, message);
});

function changeWhatsapp(type, name) {
  switch (type) {
    case 1:
      if (name === "Selecione") {
        $("#name").text("Não definido");
      } else {
        $("#name").text(name);
      }
      break;
    case 2:
      if (name === "Selecione") {
        $("#message2").val("Não definido");
      } else {
        $("#message2").val(name);
      }
      break;
    case 3:
      if (name === "Selecione") {
        $("#message3").val("Não definido");
      } else {
        $("#message3").val(name);
      }
      break;
  }
}

$("#whatsappSelect").submit(function (e) {
  e.preventDefault();
  var message = $("#message1").val();
  sendMessage(1, message);
});

$("#whatsappSelect2").submit(function (e) {
  e.preventDefault();
  var message = $("#message2").val();
  sendMessage(2, message);
});

$("#whatsappSelect3").submit(function (e) {
  e.preventDefault();
  var message = $("#message3").val();
  sendMessage(3, message);
});

function sendMessage(type, message) {
  var number = contact;
  var body = message;
  var whatsappId = sessionStorage.getItem("whatsappId");

  switch (type) {
    case 1:
      $.ajax({
        method: "POST",
        url: "includes/api.php",
        data: { number: number, body: body, whatsappId: whatsappId },
        success: function (response) {
          try {
            result = JSON.parse(response);
            switch (result.error) {
              case "SUCCESS":
                setFeedbackSelectVisible();
                break;
              case "ERR_SENDING_WAPP_MSG":
                Swal.fire({
                  title: "Ocorreu um erro!",
                  text: "Talvez o WhatsApp esteja desconectado.",
                  icon: "error",
                  showConfirmButton: false,
                  showClass: {
                    popup: animationSwalShowClass,
                  },
                  hideClass: {
                    popup: animationSwalHideClass,
                  },
                });
                break;
              case "ERR_WAPP_INVALID_CONTACT":
                Swal.fire({
                  title: "Ocorreu um erro!",
                  text: "Verifique o número do paciente.",
                  icon: "error",
                  showConfirmButton: false,
                  showClass: {
                    popup: animationSwalShowClass,
                  },
                  hideClass: {
                    popup: animationSwalHideClass,
                  },
                });
                break;
              default:
                throw result.error;
            }
          } catch (e) {
            Swal.fire({
              title: "Ocorreu um erro!",
              text: e,
              icon: "error",
              showConfirmButton: false,
              showClass: {
                popup: animationSwalShowClass,
              },
              hideClass: {
                popup: animationSwalHideClass,
              },
            });
          }
        },
      });
      break;
    case 2:
      $.ajax({
        method: "POST",
        url: "includes/api.php",
        data: { number: number, body: body, whatsappId: whatsappId },
        crossDomain: true,
        success: function (response) {
          try {
            result = JSON.parse(response);
            switch (result.error) {
              case "SUCCESS":
                setAttendantSelectVisible();
                break;
              default:
                throw result.error;
            }
          } catch (e) {
            Swal.fire({
              title: "Ocorreu um erro!",
              text: e,
              icon: "error",
              showConfirmButton: false,
              showClass: {
                popup: animationSwalShowClass,
              },
              hideClass: {
                popup: animationSwalHideClass,
              },
            });
          }
        },
      });
      break;
    case 3:
      $.ajax({
        method: "POST",
        url: "includes/api.php",
        data: { number: number, body: body, whatsappId: whatsappId },
        crossDomain: true,
        success: function (response) {
          try {
            result = JSON.parse(response);
            switch (result.error) {
              case "SUCCESS":
                Swal.fire({
                  title: "Mensagem enviada com sucesso!",
                  text: "Todas as mensagens foram enviadas com sucesso!",
                  icon: "success",
                  timer: 5000,
                  timerProgressBar: true,
                  showConfirmButton: false,
                  showClass: {
                    popup: animationSwalShowClass,
                  },
                  hideClass: {
                    popup: animationSwalHideClass,
                  },
                  allowOutsideClick: false,
                }).then((result) => {
                  if (result.dismiss === Swal.DismissReason.timer) {
                    hideAll();
                  }
                });
                break;
              default:
                throw result.error;
            }
          } catch (e) {
            Swal.fire({
              title: "Ocorreu um erro!",
              text: e,
              icon: "error",
              showConfirmButton: false,
              showClass: {
                popup: animationSwalShowClass,
              },
              hideClass: {
                popup: animationSwalHideClass,
              },
            });
          }
        },
      });
      break;
  }
}

$(document).on({
  ajaxStart: function () {
    Swal.fire({
      title: "Processando...",
      text: "Por favor, aguarde!",
      showClass: {
        popup: animationSwalShowClass,
      },
      hideClass: {
        popup: animationSwalHideClass,
      },
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  },
});

function setFeedbackSelectVisible() {
  $("title").text("Enviar Feedback");
  $(".body").text("");
  $("#container1").css("display", "none");
  $("#container2").css("display", "block");
  $("#container3").css("display", "none");
}

function setAttendantSelectVisible() {
  $("title").text("Enviar Nome do Atendente");
  $(".body").text("");
  $("#container1").css("display", "none");
  $("#container2").css("display", "none");
  $("#container3").css("display", "block");
}

function hideAll() {
  sessionStorage.clear();
  $("title").text("Finalizado");
  $("#container1").css("display", "none");
  $("#container2").css("display", "none");
  $("#container3").css("display", "none");

  document.querySelector(".header").style = "animation: end 5s 1s forwards";
}
