function changeWhatsapp(type) {
  var name = sessionStorage.getItem("name");
  var value = sessionStorage.getItem("whatsappId");

  switch (type) {
    case 1:
      if (value === "") {
        document.getElementById("name").innerText = "Não definido";
        document.getElementById("name").style = "color: red";
      } else {
        document.getElementById("name").innerText = name;
        document.getElementById("name").style = "color: black";
      }
      break;
    case 2:
      if (value === "") {
        document.getElementById("name2").innerText = "Não definido";
        document.getElementById("name2").style = "color: red";
      } else {
        document.getElementById("name2").innerText = name;
        document.getElementById("name2").style = "color: black";
      }
      break;
    case 3:
      if (value === "") {
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
  var option = $("#whatsapp").find(":selected").text();
  var value = $("#whatsapp").find(":selected").val();

  sessionStorage.setItem("name", option);
  sessionStorage.setItem("whatsappId", value);
  changeWhatsapp(1);
});

$("#whatsapp2").change(function () {
  var option = $("#whatsapp2").find(":selected").text();
  var value = $("#whatsapp2").find(":selected").val();

  sessionStorage.setItem("name", option);
  sessionStorage.setItem("body", value);
  changeWhatsapp(2);
});

$("#whatsapp3").change(function () {
  var option = $("#whatsapp3").find(":selected").text();
  var value = $("#whatsapp3").find(":selected").val();

  sessionStorage.setItem("name", option);
  sessionStorage.setItem("body", value);
  changeWhatsapp(3);
});

function sendMessage(type) {
  var number = sessionStorage.getItem("number");
  var texto = sessionStorage.getItem("body");
  var zapid = sessionStorage.getItem("whatsappId");

  switch (type) {
    case 1:
      $.ajax({
        method: "POST",
        url: "includes/api.php",
        data: { number: number, body: texto, whatsappId: zapid },
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
                    document.querySelector("title").innerText =
                      "Enviar Feedback";
                    document.getElementById("container1").style =
                      "display: none";
                    document.getElementById("container2").style =
                      "display: block";
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
                        document.querySelector("title").innerText =
                          "Enviar Nome do Atendente";
                        document.getElementById("container1").style =
                          "display: none";
                        document.getElementById("container2").style =
                          "display: none";
                        document.getElementById("container3").style =
                          "display: block";
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
                            document.getElementById("container1").style =
                              "display: none";
                            document.getElementById("container2").style =
                              "display: none";
                            document.getElementById("container3").style =
                              "display: none";

                            document.querySelector(".header").style =
                              "animation: end 8s 1s forwards, end2 5s 10s forwards;";
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
        data: { number: number, body: texto, whatsappId: zapid },
        crossDomain: true,
        success: function (response) {
          try {
            result = JSON.parse(response);
            switch (result.error) {
              case "SUCCESS":
                if (texto === "") {
                  Swal.fire({
                    title: "Opa!",
                    text: "Esta unidade não possui mensagem de feedback configurada.",
                    showCancelButton: true,
                    confirmButtonColor: "#2e9e60",
                    cancelButtonText: "Voltar",
                    icon: "info",
                    showClass: {
                      popup: "animate__animated animate__fadeInDown",
                    },
                    hideClass: {
                      popup: "animate__animated animate__fadeOutUp",
                    },
                  }).then((result) => {
                    if (result.isConfirmed) {
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
                          document.querySelector("title").innerText =
                            "Enviar Nome do Atendente";
                          document.getElementById("container2").style =
                            "display: none";
                          document.getElementById("container3").style =
                            "display: block";
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
                              document.getElementById("container1").style =
                                "display: none";
                              document.getElementById("container2").style =
                                "display: none";
                              document.getElementById("container3").style =
                                "display: none";

                              document.querySelector(".header").style =
                                "animation: end 8s 1s forwards, end2 5s 10s forwards;";
                            }
                          });
                        }
                      });
                    }
                  });
                } else {
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
                      document.querySelector("title").innerText =
                        "Enviar Nome do Atendente";
                      document.getElementById("container2").style =
                        "display: none";
                      document.getElementById("container3").style =
                        "display: block";
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
                          document.getElementById("container1").style =
                            "display: none";
                          document.getElementById("container2").style =
                            "display: none";
                          document.getElementById("container3").style =
                            "display: none";

                          document.querySelector(".header").style =
                            "animation: end 8s 1s forwards, end2 5s 10s forwards;";
                        }
                      });
                    }
                  });
                }
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
        data: { number: number, body: texto, whatsappId: zapid },
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
                    document.getElementById("container1").style =
                      "display: none";
                    document.getElementById("container2").style =
                      "display: none";
                    document.getElementById("container3").style =
                      "display: none";

                    document.querySelector(".header").style =
                      "animation: end 8s 1s forwards, end2 5s 10s forwards;";
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

window.onload = function showNumber() {
  if (
    !sessionStorage.getItem("formatedNum") ||
    !sessionStorage.getItem("formatedBody") ||
    !sessionStorage.getItem("body") ||
    !sessionStorage.getItem("number")
  ) {
    try {
      sessionStorage.setItem("formatedBody", ftdbody);
      sessionStorage.setItem("formatedNum", ftdnum);
      sessionStorage.setItem("body", text);
      sessionStorage.setItem("number", num);

      if (
        sessionStorage.getItem("number").includes("(") ||
        sessionStorage.getItem("number").includes(")") ||
        sessionStorage.getItem("number").includes("-") ||
        sessionStorage.getItem("number").length < 12
      ) {
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
        const b = Swal.getHtmlContainer().querySelector("b");
      },
    });
  },
});
