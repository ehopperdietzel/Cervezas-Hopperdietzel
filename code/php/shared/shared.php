<?php

// Sessión
session_start();

// Zona horaria
date_default_timezone_set("America/Santiago");

// Muestra errores
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

// Error
function httpError($message)
{
  header('HTTP/1.1 500 Internal Server Error');
  exit($message);
  die();
}

function httpSuccess($message = "Ok")
{
  header("HTTP/1.1 200 OK");
  exit($message);
}
?>
