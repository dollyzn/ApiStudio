window.onload = function showNumber() {
  sessionStorage.clear();
  populateStorage();

  setTimeout(function () {
    Swal.close();
    introJs()
      .setOptions({
        doneLabel: "Ok!",
        dontShowAgain: true,
        dontShowAgainLabel: "Não mostrar novamente",
        dontShowAgainCookieDays: "7",
      })
      .start();
  }, 1000);

  $("#ftdnum").text(formatedNumber);
  $(".body").text(formatedMessage);
};

function populateStorage(name, id, body) {
  if (name || id || body) {
    if (name) {
      sessionStorage.setItem("name", name);
    }
    if (id) {
      sessionStorage.setItem("whatsappId", id);
    }
    if (body) {
      sessionStorage.setItem("body", body);
    }
    return;
  }

  try {
    sessionStorage.setItem("formatedBody", formatedMessage);
    sessionStorage.setItem("formatedNum", formatedNumber);
    sessionStorage.setItem("body", message);
    sessionStorage.setItem("number", contact);

    if (!$.isNumeric(sessionStorage.getItem("number"))) {
      throw "error";
    }
  } catch {
    Swal.fire({
      title: "Ocorreu um erro!",
      text: "Verifique o número do paciente.",
      confirmButtonColor: "#C90056",
      icon: "error",
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    });
  }
}

$("#message").click(function () {
  if (formatedNumber != "Número não definido") {
    Swal.fire({
      title: "Digite a mensagem personalizada",
      input: "textarea",
      confirmButtonColor: "#2e9e60",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Salvar",
      inputPlaceholder: "Mensagem...",
      inputLabel: "Sua mensagem aqui 👇",
      inputValue: sessionStorage.getItem("body"),
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "Você precisa digitar algo!";
        } else {
          $(".body").text(value);
          populateStorage(undefined, undefined, value);
        }
      },
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    });
  } else {
    Swal.fire({
      title: "Ocorreu um erro!",
      text: "Verifique o número do paciente.",
      confirmButtonColor: "#C90056",
      icon: "error",
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    });
  }
});

$("#whatsapp").change(function () {
  var name = $("#whatsapp").find(":selected").text();
  var id = $("#whatsapp").find(":selected").val();

  populateStorage(name, id);
  changeWhatsapp(1, name);
});

$("#whatsapp2").change(function () {
  var name = $("#whatsapp2").find(":selected").text();
  var feedbackMessage = $("#whatsapp2").find(":selected").val();

  populateStorage(name, undefined, feedbackMessage);
  changeWhatsapp(2, name);
});

$("#whatsapp3").change(function () {
  var name = $("#whatsapp3").find(":selected").text();
  var attendantMessage = $("#whatsapp3").find(":selected").val();

  populateStorage(name, undefined, attendantMessage);
  changeWhatsapp(3, name);
});

function changeWhatsapp(type, name) {
  switch (type) {
    case 1:
      if (name === "Selecione") {
        $("#name").text("Não definido");
        $("#name").css("color", "red");
      } else {
        $("#name").text(name);
        $("#name").css("color", "black");
      }
      break;
    case 2:
      if (name === "Selecione") {
        $("#name2").text("Não definido");
        $("#name2").css("color", "red");
      } else {
        $("#name2").text(name);
        $("#name2").css("color", "black");
      }
      break;
    case 3:
      if (name === "Selecione") {
        $("#name3").text("Não definido");
        $("#name3").css("color", "red");
      } else {
        $("#name3").text(name);
        $("#name3").css("color", "black");
      }
      break;
  }
}

$("#whatsappSelect").submit(function (e) {
  e.preventDefault();
  sendMessage(1);
});

$("#whatsappSelect2").submit(function (e) {
  e.preventDefault();
  sendMessage(2);
});

$("#whatsappSelect3").submit(function (e) {
  e.preventDefault();
  sendMessage(3);
});

function sendMessage(type) {
  var number = sessionStorage.getItem("number");
  var body = sessionStorage.getItem("body");
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
                Swal.fire({
                  title: "Mensagem enviada com sucesso!",
                  text: "Enviar link para feedback?",
                  icon: "success",
                  showDenyButton: true,
                  confirmButtonColor: "#2e9e60",
                  denyButtonColor: "#C90056",
                  confirmButtonText: "Sim!",
                  denyButtonText: "Não",
                  showClass: {
                    popup: "animate__animated animate__fadeInDown",
                  },
                  hideClass: {
                    popup: "animate__animated animate__fadeOutUp",
                  },
                  allowOutsideClick: false,
                }).then((result) => {
                  if (result.isConfirmed) {
                    sessionStorage.removeItem("body");
                    setFeedbackSelectVisible();
                  } else if (result.isDenied) {
                    Swal.fire({
                      title: "Certo!",
                      text: "Enviar nome do atendente?",
                      icon: "success",
                      showDenyButton: true,
                      confirmButtonColor: "#2e9e60",
                      denyButtonColor: "#C90056",
                      confirmButtonText: "Sim!",
                      denyButtonText: "Não",
                      showClass: {
                        popup: "animate__animated animate__fadeInDown",
                      },
                      hideClass: {
                        popup: "animate__animated animate__fadeOutUp",
                      },
                      allowOutsideClick: false,
                    }).then((result) => {
                      if (result.isConfirmed) {
                        sessionStorage.removeItem("body");
                        setAttendantSelectVisible();
                      } else if (result.isDenied) {
                        Swal.fire({
                          title: "Ok!!",
                          text: "O código e senha foi enviado sucesso!",
                          icon: "success",
                          timer: 5000,
                          timerProgressBar: true,
                          showConfirmButton: false,
                          showClass: {
                            popup: "animate__animated animate__fadeInDown",
                          },
                          hideClass: {
                            popup: "animate__animated animate__fadeOutUp",
                          },
                          allowOutsideClick: false,
                        }).then((result) => {
                          if (result.dismiss === Swal.DismissReason.timer) {
                            hideAll();
                          }
                        });
                      }
                    });
                  }
                });
                break;
              case "ERR_SENDING_WAPP_MSG":
                Swal.fire({
                  title: "Ocorreu um erro!",
                  text: "Talvez o WhatsApp esteja desconectado.",
                  confirmButtonColor: "#C90056",
                  icon: "error",
                  showClass: {
                    popup: "animate__animated animate__fadeInDown",
                  },
                  hideClass: {
                    popup: "animate__animated animate__fadeOutUp",
                  },
                });
                break;
              case "ERR_WAPP_INVALID_CONTACT":
                Swal.fire({
                  title: "Ocorreu um erro!",
                  text: "Verifique o número do paciente.",
                  confirmButtonColor: "#C90056",
                  icon: "error",
                  showClass: {
                    popup: "animate__animated animate__fadeInDown",
                  },
                  hideClass: {
                    popup: "animate__animated animate__fadeOutUp",
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
              confirmButtonColor: "#C90056",
              icon: "error",
              showClass: {
                popup: "animate__animated animate__fadeInDown",
              },
              hideClass: {
                popup: "animate__animated animate__fadeOutUp",
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
                Swal.fire({
                  title: "Mensagem enviada com sucesso!",
                  text: "Enviar nome do atendente?",
                  icon: "success",
                  showDenyButton: true,
                  confirmButtonColor: "#2e9e60",
                  denyButtonColor: "#C90056",
                  confirmButtonText: "Sim!",
                  denyButtonText: "Não",
                  showClass: {
                    popup: "animate__animated animate__fadeInDown",
                  },
                  hideClass: {
                    popup: "animate__animated animate__fadeOutUp",
                  },
                  allowOutsideClick: false,
                }).then((result) => {
                  if (result.isConfirmed) {
                    setAttendantSelectVisible();
                  } else if (result.isDenied) {
                    Swal.fire({
                      title: "Ok!",
                      text: "Todas as mensagens foram enviadas com sucesso!",
                      icon: "success",
                      timer: 5000,
                      timerProgressBar: true,
                      showConfirmButton: false,
                      showClass: {
                        popup: "animate__animated animate__fadeInDown",
                      },
                      hideClass: {
                        popup: "animate__animated animate__fadeOutUp",
                      },
                      allowOutsideClick: false,
                    }).then((result) => {
                      if (result.dismiss === Swal.DismissReason.timer) {
                        hideAll();
                      }
                    });
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
              confirmButtonColor: "#C90056",
              icon: "error",
              showClass: {
                popup: "animate__animated animate__fadeInDown",
              },
              hideClass: {
                popup: "animate__animated animate__fadeOutUp",
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
                    popup: "animate__animated animate__fadeInDown",
                  },
                  hideClass: {
                    popup: "animate__animated animate__fadeOutUp",
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
              confirmButtonColor: "#C90056",
              icon: "error",
              showClass: {
                popup: "animate__animated animate__fadeInDown",
              },
              hideClass: {
                popup: "animate__animated animate__fadeOutUp",
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
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
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

  document.querySelector(".header").style =
    "animation: end 5s 1s forwards, end2 5s 6s forwards;";
}
