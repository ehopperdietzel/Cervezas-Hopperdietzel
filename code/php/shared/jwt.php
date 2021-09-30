<?php

include_once("shared.php");

$JWTSecret = "misupercodigosecreto";

// Genera un token a partir del id de un usuario
function genToken($userID)
{
  global $JWTSecret;

  $header = base64_encode(json_encode(array
  (
    "alg" => "HS256",
    "typ" => "JWT"
  )));

  $payload = base64_encode(json_encode(array
  (
    "usr" => strval($userID)
  )));

  return $header.".".$payload.".".hash("sha256",$header.".".$payload.".".$JWTSecret);
}

// Valida un token, si es válido retorna el id del usuario, si es inválido genera un http error.
function validateToken($token)
{
  global $JWTSecret;

  $tokenParts = explode(".", $token);

  $hash = hash("sha256",$tokenParts[0].".".$tokenParts[1].".".$JWTSecret);

  if($hash == $tokenParts[2])
  {
    return strval(json_decode(base64_decode($tokenParts[1]))["usr"]);
  }
  else
  {
    httpError("Invalid token.");
  }
}
?>
