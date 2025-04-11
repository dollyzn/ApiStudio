<?php

function verify_body($body) {
      if (isset($body) && $body != "Mensagem não definida") {
          $link_prefix = 'https://ceroimagem.com.br';
          $add_info_text = false;
  
          // Verifica e remove o link no início, se presente
          if (strpos($body, $link_prefix) === 0) {
              $body = trim(substr($body, strlen($link_prefix)));
              $add_info_text = true;
          }
  
          $body = str_replace(array("\r\n", "\n", "\r", "[[["), 'brkln', $body);
  
          if ($add_info_text) {
            $info_text = "brklnbrklnPara ter acesso ao seu exame online:brkln" .
            "1° Acesse o site www.ceroimagem.com.brbrkln" .
            "2° Clique na área \"Portal do Paciente\"brkln" .
            "3° Em seguida, vá até a aba \"Exames On-line\"brkln" .
            "4° Digite o código e a senha recebidos e clique em \"Entrar\"";
              $body .= $info_text;
          }
  
          return $body;
      } else {
          return "Mensagem não definida";
      }
  }  
  

function verify_number($num) {

      if(isset($num) && $num != "Não definido") {

      $num = str_replace("(", "", $num);
      $num = str_replace(")", "", $num);
      $num = str_replace("-", "", $num);
      $num = str_replace(" ", "", $num);


      return $num;
      } else {
      
      return "Não definido";
      }
}

function masc_tel($num) {

 if($num != "Não definido"){           
    $tam = strlen(preg_replace("/[^0-9]/", "", $num));
      if ($tam == 13) {
            return "+".substr($num,0,$tam-11)." (".substr($num,$tam-11,2).") ".substr($num,$tam-9,5)."-".substr($num,-4);
      } if ($tam == 12) {
            return "+".substr($num,0,$tam-10)." (".substr($num,$tam-10,2).") ".substr($num,$tam-8,4)."-".substr($num,-4); 
      } if ($tam == 11) {
            return " (".substr($num,0,2).") ".substr($num,2,5)."-".substr($num,7,11);
      } if ($tam == 10) {
            return " (".substr($num,0,2).") ".substr($num,2,4)."-".substr($num,6,10);
      } if ($tam <= 9) { 
            return substr($num,0,$tam-4)."-".substr($num,-4);
      }
    } else {
            return "Não definido";
    }
}