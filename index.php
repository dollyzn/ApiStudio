<!DOCTYPE html>
<html>
  <meta charset="UTF-8" />
  <head>
    <meta name="viewport" content="width=device-width">
    <title>Envio de Código e Senha</title>
    <link rel="stylesheet" href="style.css" />
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet"/>
    <link type="image/png" rel="favicon" href="logo.ico"/>
    <script src="https://code.jquery.com/jquery-1.10.2.js"></script>

  </head>
  <body>
    <?php
            $protocolo = 'http';
            $url = '://'.$_SERVER['HTTP_HOST'].$_SERVER['SCRIPT_NAME'].'?'.$_SERVER['QUERY_STRING'];
            $components = parse_url($url);
            parse_str($components['query'], $results);

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

            
            if(isset($_GET['number'])){
              $TEL = $_GET['number'];
              $ftdnum = masc_tel($TEL);
            }else{
              $TEL = "Não definido";
              $ftdnum = "Não definido";
            }
            if(isset($_GET['body'])){
              $body = $_GET['body'];
              $ftdbody = str_replace("[[[", " ", $body);
            }else{
              $body = "Mensagem não definida";
              $ftdbody = "Mensagem não definida";
            }
            ?>
    <main>
      <div class="container">
        <h1><img src="logo.png" width="200px" /></h1>
      </div>
      <div class="select">
        <h1>Enviar por qual WhatsApp?</h1>
        <form>
          <select id="wppId" name="whatsappId">
            <option value="">Selecione</option>
            <option value="2">Cero Unidade II</option>
            <option value="4">Cero Matriz</option>
            <option value="5">Cero Matriz 2</option>
            <option value="7">Cero São João</option>
            <option value="3">Cero São Francisco</option>
          </select>  
        </form>
      </div>
      <script>
      var select = document.getElementById('wppId')

      select.addEventListener('change', function(){

        zapid = $('#wppId').val();

          if(zapid == 5){
          document.getElementById("link").href="api.php?number=<?=$TEL?>&body=<?=$body?>&whatsappId=5";
          document.getElementById("zp").innerText = "Cero Matriz 2";
          document.getElementById("zp").style = "font-weight: bold";
        }else{if(zapid == 2){
          document.getElementById("link").href="api.php?number=<?=$TEL?>&body=<?=$body?>&whatsappId=2";
          document.getElementById("zp").innerText = "Cero Unidade II";
          document.getElementById("zp").style = "font-weight: bold";
        }else{if(zapid == 3){
          document.getElementById("link").href="api.php?number=<?=$TEL?>&body=<?=$body?>&whatsappId=3";
          document.getElementById("zp").innerText = "Cero São Francisco";
          document.getElementById("zp").style = "font-weight: bold";
        }else{if(zapid == 4){
          document.getElementById("link").href="api.php?number=<?=$TEL?>&body=<?=$body?>&whatsappId=4";
          document.getElementById("zp").innerText = "Cero Matriz";
          document.getElementById("zp").style = "font-weight: bold";
        }else{if(zapid == 7){
          document.getElementById("link").href="api.php?number=<?=$TEL?>&body=<?=$body?>&whatsappId=7";
          document.getElementById("zp").innerText = "Cero São João";
          document.getElementById("zp").style = "font-weight: bold";
        }else{
          document.getElementById("link").href="api.php?number=<?=$TEL?>&body=<?=$body?>&whatsappId=Não definido";
          document.getElementById("zp").innerText = "Não definido";
          document.getElementById("zp").style = "font-weight: bold; color: red";
        }}}}}
    console.log(zapid)
      })
      </script>
      <div class="num">
        <p class="zap">
          WhatsApp:
          <span  id="zp" style="font-weight: bold; color: red">
          Não definido
          </span>
        </p>
        <div id='res'></div>
        <p>
          Número:
          <span style="font-weight: bold">
           <?php
            echo $ftdnum;
           ?>
          </span>
        </p>
        <p class="body" style="font-weight: bold">
           <?php
            echo $ftdbody;
           ?>
        </p>
        <a href="api.php?number=<?=$TEL?>&body=<?=$body?>&whatsappId=Não definido" id="link" class="enviar">Enviar</a>
      </div>
    </main>
  </body>
</html>
