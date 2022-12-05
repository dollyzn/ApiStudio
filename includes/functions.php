<?php

if(isset($_POST['number'])){
   $tel = $_POST['number'];
   $ftdnum = masc_tel($tel);
   echo $ftdnum;
}

function masc_tel($num) {

    $tam = strlen(preg_replace("/[^0-9]/", "", $num));
      if ($tam == 13) {
            return "+".substr($num,0,$tam-11)."(".substr($num,$tam-11,2).")".substr($num,$tam-9,5)."-".substr($num,-4);
      } if ($tam == 12) {
            return "+".substr($num,0,$tam-10)."(".substr($num,$tam-10,2).")".substr($num,$tam-8,4)."-".substr($num,-4); 
      } if ($tam == 11) {
            return "(".substr($num,0,2).")".substr($num,2,5)."-".substr($num,7,11);
      } if ($tam == 10) {
            return "(".substr($num,0,2).")".substr($num,2,4)."-".substr($num,6,10);
      } if ($tam <= 9) { 
            return substr($num,0,$tam-4)."-".substr($num,-4);
      }
}