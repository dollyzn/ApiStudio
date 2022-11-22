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
         $error = "WhatsApp, mensagem ou número não definidos. Reenvie o código e senha novamente.";
         $json = "nada";
        }else{
         $sucess  = "Mensagem enviada com sucesso! Número: $ftdnum";
        }

?>

<html>
  <meta charset="UTF-8" />
  <head>
    <meta name="viewport" content="width=device-width">
    <title>Enviar Feedback</title>
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
        <h3>Enviar feedback?</h3>
        <form>
          <select id="api" name="whatsappId">
            <option value="">Selecione a Unidade</option>
            <option value="">Não</option>
            <option value="Cero2">Cero Unidade II</option>
            <option value="CeroM">Cero Matriz</option>
            <option value="CeroSJB">Cero São João</option>
            <option value="CeroSFI">Cero São Francisco</option>
          </select>  
        </form>
        <!--<p>Inserir nome do atendente?</p>
        <form>
          <select id="api" name="whatsappId">
            <option value="">Não</option>
            <option value="Att, Daiana">Daiana</option>
            <option value="Att, Fátima">Fátima</option>
            <option value="Att, Thalia">Thalia</option>
          </select>  
        </form>-->
              <script>
      var select = document.getElementById('api')

      select.addEventListener('change', function(){

        atendente = $('#api').val();

          if(atendente == "Cero2"){
          document.getElementById("link").setAttribute("onclick", "window.open('api.php?number=<?=$TEL?>&body=Cero2&whatsappId=<?=$zapid?>', 'mywin', 'width=10, height=10');");
          document.getElementById("link").href="atendente.php?number=<?=$TEL?>&body=Cero Unidade II&whatsappId=<?=$zapid?>";
        }else{if(atendente == "CeroM"){
          document.getElementById("link").setAttribute("onclick", "window.open('api.php?number=<?=$TEL?>&body=CeroM&whatsappId=<?=$zapid?>', 'mywin', 'width=10, height=10');");
          document.getElementById("link").href="atendente.php?number=<?=$TEL?>&body=Cero Matriz&whatsappId=<?=$zapid?>";
        }else{if(atendente == "CeroSFI"){
          document.getElementById("link").setAttribute("onclick", "window.open('api.php?number=<?=$TEL?>&body=CeroSFI&whatsappId=<?=$zapid?>', 'mywin', 'width=10, height=10');");
          document.getElementById("link").href="atendente.php?number=<?=$TEL?>&body=Cero São Francisco&whatsappId=<?=$zapid?>";
        }else{if(atendente == "CeroSJB"){
          document.getElementById("link").setAttribute("onclick", "window.open('api.php?number=<?=$TEL?>&body=CeroSJB&whatsappId=<?=$zapid?>', 'mywin', 'width=10, height=10');");
          document.getElementById("link").href="atendente.php?number=<?=$TEL?>&body=Cero São João&whatsappId=<?=$zapid?>";
        }else{
          document.getElementById("link").setAttribute("onclick", "window.open('api.php?number=<?=$TEL?>&body=Mensagem não definida&whatsappId=<?=$zapid?>', 'mywin', 'width=10, height=10');");
          document.getElementById("link").href="atendente.php?number=<?=$TEL?>&body=Mensagem não definida&whatsappId=<?=$zapid?>";
        }}}}
    console.log(atendente)
      })
      </script>
        <a href="atendente.php?number=<?=$TEL?>&body=Mensagem não definida&whatsappId=<?=$zapid?>" onclick="window.open('api.php?number=<?=$TEL?>&body=Mensagem não definida&whatsappId=<?=$zapid?>','mywin','width=10, height=10');" id="link" class="enviar" style="margin-top: 15px">Enviar</a>
      </div>
  </div>
  </html>

<?php  
curl_setopt_array($curl, [
  CURLOPT_PORT => "8080",
  CURLOPT_URL => "http://localhost:8080/api/messages/send?=",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => $json,
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer 888ede73-062a-4a39-875a-d18faffe3baf",
    "Content-Type: application/json"
  ],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);
?>

<script>window.close();</script>
