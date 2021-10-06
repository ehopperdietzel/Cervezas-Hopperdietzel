<?php

include_once("shared.php");

$JWTSecret = "hola";

function base64url_encode($data)
{
  $b64 = base64_encode($data);
  if ($b64 === false) {
    return false;
  }
  $url = strtr($b64, '+/', '-_');
  return rtrim($url, '=');
}

function base64url_decode($data, $strict = false)
{
  $b64 = strtr($data, '-_', '+/');
  return base64_decode($b64, $strict);
}

// Genera un token a partir del id de un usuario
function genToken($userID)
{
  global $JWTSecret;

  $header = base64url_encode(json_encode(array
  (
    "alg" => "HS256",
    "typ" => "JWT"
  )));

  $payload = base64url_encode(json_encode(array
  (
    "usr" => strval($userID)
  )));

  return $header.".".$payload.".".hash_hmac("sha256",$header.".".$payload,$JWTSecret,true);
}

// Valida un token, si es válido retorna el id del usuario, si es inválido genera un http error.
function validateToken($token)
{
  global $JWTSecret;

  $tokenParts = explode(".", $token);

  $hash = hash_hmac("sha256",$tokenParts[0].".".$tokenParts[1],$JWTSecret,true);

  if($hash == $tokenParts[2])
  {
    return strval(json_decode(base64url_decode($tokenParts[1]))["usr"]);
  }
  else
  {
    httpError("Invalid token.");
  }
}
?>
