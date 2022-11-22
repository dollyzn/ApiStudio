<!DOCTYPE html>
<?php

$protocolo = 'http';
$url = '://'.$_SERVER['HTTP_HOST'].$_SERVER['SCRIPT_NAME'].'?'.$_SERVER['QUERY_STRING'];

$url = str_replace("[[[", "%0A", $url);
$components = parse_url($url);

parse_str($components['query'], $results);
$curl = curl_init();

$json = json_encode($results);

if(isset($_GET['number'])){
   $TEL = $_GET['number'];
}else{
   $number = "Não definido";
}if(isset($_GET['body'])){
   $body = $_GET['body'];
   $body = str_replace("[[[", " ", $body);
}else{
   $body = "Mensagem não definida";
}if(isset($_GET['whatsappId'])){
  $zapid  = $_GET['whatsappId'];
}

function masc_tel($TEL) {
    $tam = strlen(preg_replace("/[^0-9]/", "", $TEL));
      if ($tam == 13) { // COM CÓDIGO DE ÁREA NACIONAL E DO PAIS e 9 dígitos
      return "+".substr($TEL,0,$tam-11)."(".substr($TEL,$tam-11,2).")".substr($TEL,$tam-9,5)."-".substr($TEL,-4);
      }
      if ($tam == 12) { // COM CÓDIGO DE ÁREA NACIONAL E DO PAIS
      return "+".substr($TEL,0,$tam-10)."(".substr($TEL,$tam-10,2).")".substr($TEL,$tam-8,4)."-".substr($TEL,-4);
      }
      if ($tam == 11) { // COM CÓDIGO DE ÁREA NACIONAL e 9 dígitos
      return "(".substr($TEL,0,2).")".substr($TEL,2,5)."-".substr($TEL,7,11);
      }
      if ($tam == 10) { // COM CÓDIGO DE ÁREA NACIONAL
      return "(".substr($TEL,0,2).")".substr($TEL,2,4)."-".substr($TEL,6,10);
      }
      if ($tam <= 9) { // SEM CÓDIGO DE ÁREA
      return substr($TEL,0,$tam-4)."-".substr($TEL,-4);
      }
  }

  $ftdnum = masc_tel($TEL);


    if($_GET['number'] == "Não definido" || $_GET['body'] == "Mensagem não definida" || $_GET['whatsappId'] == "Não definido" || $_GET['whatsappId'] == "" ){
         $error = "Mensagem, número ou WhatsApp não definidos. Reenvie o código e senha novamente.";
         $json = "nada";
        }else{
         $sucess  = "Feedback enviado com sucesso! Número: $ftdnum";
        }

?>

<html>
  <meta charset="UTF-8" />
  <head>
    <meta name="viewport" content="width=device-width">
    <title>Selecionar Atendente</title>
    <link rel="stylesheet" href="style.css" />
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet"/>
    <link type="image/png" rel="favicon" href="logo.ico"/>
    <script src="https://code.jquery.com/jquery-1.10.2.js"></script>
  </head>
  <div class="container">
        <h1><img src="logo.png" width="200px" /></h1>
  </div>
  <div class="num" style="padding: 50px 10% 0px 10%">
  <p style="font-size: 20pt; font-weight: bold">
    <span>
      <?php
      if(isset($sucess)){
      echo $sucess;
       }else{
      echo $error;
       }
      ?>
      </span>
  </p>
    <p class="body" style="font-weight: bold">
       <?php
       if(isset($sucess)){
         echo $body;
         }else{
         echo "";
         }
        ?>
    </p>
    <div class="select">
        <h3>Enviar nome do atendente?</h3>
        <form>
          <select id="atendente" name="whatsappId">
            <option value="">Não</option>
            <option value="Daiana">Daiana</option>
            <option value="Fatima">Fátima</option>
            <option value="Thalia">Thalia</option>
            <option value="Stefany">Stéfany</option>
            <option value="Patricia">Patrícia</option>
            <option value="Marcos">Marcos</option>
            <option value="Mayane">Mayane</option>
            <option value="Kissila">Kíssila</option>
            <option value="Franciele">Franciele</option>
          </select>  
        </form>
        <script>
      var select = document.getElementById('atendente')

      select.addEventListener('change', function(){

        atendente = $('#atendente').val();

          if(atendente == "Daiana"){
          document.getElementById("link").setAttribute("onclick", "window.open('api.php?number=<?=$TEL?>&body=Att, Daiana&whatsappId=<?=$zapid?>', 'mywin', 'width=10, height=10');");
          document.getElementById("link").href="finalizar.php?number=<?=$TEL?>&body=Cero Imagem Digital®&whatsappId=<?=$zapid?>";
        }else{if(atendente == "Fatima"){
          document.getElementById("link").setAttribute("onclick", "window.open('api.php?number=<?=$TEL?>&body=Att, Fátima&whatsappId=<?=$zapid?>', 'mywin', 'width=10, height=10');");
          document.getElementById("link").href="finalizar.php?number=<?=$TEL?>&body=Cero Imagem Digital®&whatsappId=<?=$zapid?>";
        }else{if(atendente == "Thalia"){
          document.getElementById("link").setAttribute("onclick", "window.open('api.php?number=<?=$TEL?>&body=Att, Thalia&whatsappId=<?=$zapid?>', 'mywin', 'width=10, height=10');");
          document.getElementById("link").href="finalizar.php?number=<?=$TEL?>&body=Cero Imagem Digital®&whatsappId=<?=$zapid?>";
        }else{if(atendente == "Stefany"){
          document.getElementById("link").setAttribute("onclick", "window.open('api.php?number=<?=$TEL?>&body=Att, Stéfany&whatsappId=<?=$zapid?>', 'mywin', 'width=10, height=10');");
          document.getElementById("link").href="finalizar.php?number=<?=$TEL?>&body=Cero Imagem Digital®&whatsappId=<?=$zapid?>";
        }else{if(atendente == "Patricia"){
          document.getElementById("link").setAttribute("onclick", "window.open('api.php?number=<?=$TEL?>&body=Att, Patrícia&whatsappId=<?=$zapid?>', 'mywin', 'width=10, height=10');");
          document.getElementById("link").href="finalizar.php?number=<?=$TEL?>&body=Cero Imagem Digital®&whatsappId=<?=$zapid?>";
        }else{if(atendente == "Marcos"){
          document.getElementById("link").setAttribute("onclick", "window.open('api.php?number=<?=$TEL?>&body=Att, Marcos&whatsappId=<?=$zapid?>', 'mywin', 'width=10, height=10');");
          document.getElementById("link").href="finalizar.php?number=<?=$TEL?>&body=Cero Imagem Digital®&whatsappId=<?=$zapid?>";
        }else{if(atendente == "Mayane"){
          document.getElementById("link").setAttribute("onclick", "window.open('api.php?number=<?=$TEL?>&body=Att, Mayane&whatsappId=<?=$zapid?>', 'mywin', 'width=10, height=10');");
          document.getElementById("link").href="finalizar.php?number=<?=$TEL?>&body=Cero Imagem Digital®&whatsappId=<?=$zapid?>";
        }else{if(atendente == "Kissila"){
          document.getElementById("link").setAttribute("onclick", "window.open('api.php?number=<?=$TEL?>&body=Att, Kissila&whatsappId=<?=$zapid?>', 'mywin', 'width=10, height=10');");
          document.getElementById("link").href="finalizar.php?number=<?=$TEL?>&body=Cero Imagem Digital®&whatsappId=<?=$zapid?>";
        }else{if(atendente == "Franciele"){
          document.getElementById("link").setAttribute("onclick", "window.open('api.php?number=<?=$TEL?>&body=Att, Franciele&whatsappId=<?=$zapid?>', 'mywin', 'width=10, height=10');");
          document.getElementById("link").href="finalizar.php?number=<?=$TEL?>&body=Cero Imagem Digital®&whatsappId=<?=$zapid?>";
        }else{
          document.getElementById("link").setAttribute("onclick", "window.open('api.php?number=<?=$TEL?>&body=Nome não definido&whatsappId=<?=$zapid?>', 'mywin', 'width=10, height=10');");
          document.getElementById("link").href="finalizar.php?number=<?=$TEL?>&body=Nome do atendente não definido&whatsappId=<?=$zapid?>";
        }}}}}}}}}
    console.log(atendente)
      })
      </script>
        <a href="finalizar.php?number=<?=$TEL?>&body=Nome do atendente não definido&whatsappId=<?=$zapid?>" onclick="window.open('api.php?number=<?=$TEL?>&body=Nome não definido&whatsappId=<?=$zapid?>','mywin','width=10, height=10');" id="link" class="enviar" style="margin-top: 15px">Enviar</a>
      </div>
  </html>
