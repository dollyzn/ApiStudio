<?php 
include("includes/connection.php");
include("includes/functions.php");
?>

<?php
$num = verify_number($_GET['number'] ?? "Número não definido");
$ftdnum = masc_tel($num);
$body = $_GET['body'] ?? "Mensagem não definida";
$ftdbody = verify_body($body);
?>

<!DOCTYPE html>
<html lang="pt-BR">
  <meta charset="UTF-8" />
  <head>
    <meta name="viewport" content="width=device-width" />
    <title>Envio de Código e Senha</title>
    <link rel="stylesheet" href="assets/style.css" />
    <link rel="stylesheet" href="assets/css2.css" />
    <link rel="stylesheet" href="assets/animate.min.css" />
    <link rel="stylesheet" href="assets/introjs.css" />
    <link rel="stylesheet" href="assets/introjs-modern.css" />
    <link rel="icon" type="images/x-icon" href="assets/images/favicon.ico" />
  </head>
  <body>
    <main>
      <div class="header">
        <h1><img src="assets/images/logo.png" width="200px" /></h1>
      </div>
      <div id="container1">
      <div class="select">
        <h1>Enviar por qual WhatsApp?</h1>
        <form id="whatsappSelect">
          <select id="whatsapp" required>
            <option value="">Selecione</option>
            <?php
              $query = $conn->query("SELECT id, name FROM Whatsapps ORDER BY id ASC");
              $registros = $query->fetchAll(PDO::FETCH_ASSOC);

              foreach($registros as $option){
            ?>
            <option value="<?=$option['id']?>"><?=$option['name']?></option>
            <?php
              }
            ?>
          </select>
        </form>
      </div>
      <div class="info">
        <p class="whatsapp">
          WhatsApp:
           <b><span 
           id="name"  
           class="name" 
           style="color: red"
           > 
          Não definido 
          </span></b>
        </p>
        <p>
          Número:
           <b><span i
           id="ftdnum">
          </span></b>
        </p>
      <p class="body" id="message" data-intro='Para alterar a mensagem basta clicar em cima do texto!'>
      </p>
      </div>
       <input
        type="submit"
        form="whatsappSelect"
        onclick="null"
        class="submit"
        value="Enviar"
      />
      </div>

      <div id="container2">
      <div class="select">
        <h1>Selecione a Unidade</h1>
        <form id="whatsappSelect2">
          <select id="whatsapp2" required>
            <option value="">Selecione</option>
            <?php
              $query = $conn->query("SELECT id, feedbackMessage, name FROM Whatsapps ORDER BY id ASC");
              $registros = $query->fetchAll(PDO::FETCH_ASSOC);

              foreach($registros as $option){
                if($option['feedbackMessage'] == null){
                  continue;
                }
            ?>
            <option value="<?=$option['feedbackMessage']?>"><?=$option['name']?></option>
            <?php
              }
            ?>
          </select>
        </form>
      </div>
      <div class="info">
         <p>Unidade 👇</p>
      </div>
      <p class="body" id="name2">
      </p>
            <input
        type="submit"
        form="whatsappSelect2"
        onclick="null"
        class="submit"
        value="Enviar"
      />
            </div>

            <div id="container3">
      <div class="select">
        <h1>Selecione o Atendente</h1>
        <form id="whatsappSelect3">
          <select id="whatsapp3" required>
            <option value="">Selecione</option>
            <?php
              $query = $conn->query("SELECT id, name FROM Users ORDER BY name ASC");
              $registros = $query->fetchAll(PDO::FETCH_ASSOC);

              foreach($registros as $option){
            ?>
            <option value="<?="Att, " . $option['name']?>"><?=$option['name']?></option>
            <?php
              }
            ?>
          </select>
        </form>
      </div>
      <div class="info">
         <p>Atendente 👇</p>
      </div>
      <p class="body" id="name3">
      </p>
            <input
        type="submit"
        form="whatsappSelect3"
        onclick="null"
        class="submit"
        value="Enviar"
      />
            </div>
    </main>
    <script src="js/jquery-3.6.1.js"></script>
    <script src="js/sweetalert2.all.min.js"></script>
    <script src="js/intro.min.js"></script>
    <script src="js/script.js"></script>
    <script>
      formatedNumber = "<?=$ftdnum?>";
      formatedMessage = "<?=$ftdbody?>";
      contact = "<?=$num?>";
      message = "<?=$body?>";
    </script>
  </body>
</html>

