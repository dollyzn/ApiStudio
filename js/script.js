function changeWhatsapp(type) {
  var name = sessionStorage.getItem("name");
  var id = sessionStorage.getItem("whatsappId");

  switch (type) {
    case 1:
      if (name === "Selecione") {
        document.getElementById("name").innerText = "Não definido";
        document.getElementById("name").style = "color: red";
      } else {
        document.getElementById("name").innerText = name;
        document.getElementById("name").style = "color: black";
      }
      break;
    case 2:
      if (name === "Selecione") {
        document.getElementById("name2").innerText = "Não definido";
        document.getElementById("name2").style = "color: red";
      } else {
        document.getElementById("name2").innerText = name;
        document.getElementById("name2").style = "color: black";
      }
      break;
    case 3:
      if (name === "Selecione") {
        document.getElementById("name3").innerText = "Não definido";
        document.getElementById("name3").style = "color: red";
      } else {
        document.getElementById("name3").innerText = name;
        document.getElementById("name3").style = "color: black";
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

$("#whatsapp").change(function () {
  var name = $("#whatsapp").find(":selected").text();
  var id = $("#whatsapp").find(":selected").val();

  sessionStorage.setItem("name", name);
  sessionStorage.setItem("whatsappId", id);
  changeWhatsapp(1);
});

$("#whatsapp2").change(function () {
  var name = $("#whatsapp2").find(":selected").text();
  var feedbackMessage = $("#whatsapp2").find(":selected").val();

  sessionStorage.setItem("name", name);
  sessionStorage.setItem("body", feedbackMessage);
  changeWhatsapp(2);
});

$("#whatsapp3").change(function () {
  var name = $("#whatsapp3").find(":selected").text();
  var attendantMessage = $("#whatsapp3").find(":selected").val();

  sessionStorage.setItem("name", name);
  sessionStorage.setItem("body", attendantMessage);
  changeWhatsapp(3);
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
                          confirmButtonColor: "#2e9e60",
                          confirmButtonText: "OK",
                          showClass: {
                            popup: "animate__animated animate__fadeInDown",
                          },
                          hideClass: {
                            popup: "animate__animated animate__fadeOutUp",
                          },
                          allowOutsideClick: false,
                        }).then((result) => {
                          if (result.isConfirmed) {
                            closeAll();
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
                      confirmButtonColor: "#2e9e60",
                      confirmButtonText: "OK",
                      showClass: {
                        popup: "animate__animated animate__fadeInDown",
                      },
                      hideClass: {
                        popup: "animate__animated animate__fadeOutUp",
                      },
                      allowOutsideClick: false,
                    }).then((result) => {
                      if (result.isConfirmed) {
                        closeAll();
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
                  confirmButtonColor: "#2e9e60",
                  confirmButtonText: "OK",
                  showClass: {
                    popup: "animate__animated animate__fadeInDown",
                  },
                  hideClass: {
                    popup: "animate__animated animate__fadeOutUp",
                  },
                  allowOutsideClick: false,
                }).then((result) => {
                  if (result.isConfirmed) {
                    closeAll();
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

function populate_Storage() {
  sessionStorage.clear();

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

function setFeedbackSelectVisible() {
  document.querySelector("title").innerText = "Enviar Feedback";
  document.getElementById("container1").style = "display: none";
  document.getElementById("container2").style = "display: block";
  document.getElementById("container3").style = "display: none";
}

function setAttendantSelectVisible() {
  document.querySelector("title").innerText = "Enviar Nome do Atendente";
  document.getElementById("container1").style = "display: none";
  document.getElementById("container2").style = "display: none";
  document.getElementById("container3").style = "display: block";
}

function closeAll() {
  sessionStorage.clear();
  document.querySelector("title").innerText = "Finalizado";
  document.getElementById("container1").style = "display: none";
  document.getElementById("container2").style = "display: none";
  document.getElementById("container3").style = "display: none";

  document.querySelector(".header").style =
    "animation: end 8s 1s forwards, end2 5s 10s forwards;";
}

window.onload = function showNumber() {
  populate_Storage();

  document.getElementById("ftdnum").innerText =
    sessionStorage.getItem("formatedNum");

  document.querySelector(".body").innerText =
    sessionStorage.getItem("formatedBody");
};

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
