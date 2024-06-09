<?php 
include("includes/connection.php");
include("includes/functions.php");

$number = verify_number($_GET['number'] ?? "Não definido");
$contact = masc_tel($number);
$body = $_GET['body'] ?? "Mensagem não definida";
$message = verify_body($body);
?>

<!DOCTYPE html>
<html lang="pt-BR">
  <meta charset="UTF-8" />
  <head>
    <meta name="viewport" content="width=device-width" />
    <title>Envio de Código e Senha</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/style.css" />
    <link rel="stylesheet" href="assets/animate.min.css" />
    <link rel="stylesheet" href="assets/introjs.css" />
    <link rel="stylesheet" href="assets/introjs-modern.css" />
    <link rel="icon" type="images/x-icon" href="assets/images/favicon.ico" />
  </head>
  <body>
    <main>
      <div class="header">
        <img src="assets/images/logo.png" width="200px" draggable="false" />
      </div>
      <div id="container1">
        <div class="select" unselectable="on" >
          <h1>Enviar por qual WhatsApp?</h1>
          <form id="whatsappSelect">
            <select id="whatsapp" required>
             <option value="">Selecione</option>
             <?php
              $query = $conn->query("SELECT id, token, name FROM public.\"Whatsapps\" ORDER BY id ASC");
               $registros = $query->fetchAll(PDO::FETCH_ASSOC);
               foreach($registros as $option){
             ?>
             <option value="<?=$option['id'] . '|' . $option['token']?>"><?=$option['name']?></option>
             <?php
               }
             ?>
            </select>
          </form>
        </div>
        <div class="info">
          <div class="whatsapp" unselectable="on" >
            <img id="rotate" src="assets/images/icon.png" width="40px" draggable="false" />
            De: <span id="name" class="name">Não definido</span>
          </div>
          <div class="patient" unselectable="on" >
            <img id="rotate" src="assets/images/zapicon.png" width="40px" draggable="false" />
            Para: <span><?=$contact?></span>
          </div>
        </div>
        <textarea class="body"  id="message1" form="whatsappSelect" required rows="2" placeholder="Mensagem não definida" data-intro='Para alterar a mensagem basta clicar em cima do texto!'></textarea>
         <input type="submit" form="whatsappSelect" class="submit" value="Enviar"/>
      </div>
      <div id="container2">
        <div class="select" unselectable="on" >
          <h1>Selecione a Unidade</h1>
          <form id="whatsappSelect2">
            <select id="whatsapp2" required>
             <option value="">Selecione</option>
             <?php
               $query = $conn->query("SELECT id, \"ratingMessage\", name FROM public.\"Whatsapps\" ORDER BY id ASC");
               $registros = $query->fetchAll(PDO::FETCH_ASSOC);
 
               foreach($registros as $option){
                 if($option['ratingMessage'] == null){
                   continue;
                 }
             ?>
             <option value="<?=$option['ratingMessage']?>"><?=$option['name']?></option>
             <?php
               }
             ?>
            </select>
          </form>
        </div>
        <div class="info">
          <div class="feedback">
          <img id="rotate" src="assets/images/message.png" width="40px" draggable="false" />
          Mensagem  
          </div> 
          <img id="arrow" src="assets/images/downarrow.png" width="15px" draggable="false" />
        </div>
        <textarea class="body" id="message2" form="whatsappSelect2" required rows="2" placeholder="Não definido"></textarea>
        <input type="submit" form="whatsappSelect2" class="submit" value="Enviar"/>
      </div>
      <div id="container3">
        <div class="select" unselectable="on" >
          <h1>Selecione o Atendente</h1>
          <form id="whatsappSelect3">
            <select id="whatsapp3" required>
              <option value="">Selecione</option>
              <?php
                $query = $conn->query("SELECT id, name FROM public.\"Users\" ORDER BY name ASC");
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
          <div class="attendant">
          <img id="rotate" src="assets/images/message.png" width="40px" draggable="false" />
          Mensagem
          </div>
          <img id="arrow" src="assets/images/downarrow.png" width="15px" draggable="false" />
        </div>
        <textarea class="body" id="message3" form="whatsappSelect3" required rows="5" placeholder="Não definido"></textarea>
        <input type="submit" form="whatsappSelect3" class="submit" value="Enviar"/>
      </div>
    </main>
    <script src="js/jquery-3.6.1.js"></script>
    <script src="js/sweetalert2.all.min.js"></script>
    <script src="js/intro.min.js"></script>
    <script src="js/script.js"></script>
    <script>
      message = "<?=$message?>";
      message = message.replace(/brkln/gi, "\n");
      contact = "<?=$number?>";
      formatedContact = "<?=$contact?>"
    </script>
  </body>
</html>

