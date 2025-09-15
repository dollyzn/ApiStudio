<?php
$number = $_POST['number'];
$body = $_POST['body'];
$token = $_POST['token'];
$whatsappId = $_POST['whatsappId'];

$body = str_replace("[[[", "\n", $body);

$array = array(
    "number" => $number,
    "body" => $body,
    "whatsappId" => $whatsappId,
);

$json = json_encode($array);

$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_PORT => "8080",
  CURLOPT_URL => "http://localhost:8080/api/messages/send?=",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 180,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => $json,
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer $token",
    "Content-Type: application/json"
  ],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo $err;
} else {
  echo $response;
}
