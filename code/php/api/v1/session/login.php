<?php

include_once("../../../shared/validate.php");

session_start();

requiredParameters(array("username","password"));

$username = validate($_POST["username"],"text");
$password = validate($_POST["password"],"text");

$root = json_decode(file_get_contents(realpath(dirname(__FILE__)."/../../../../configuration/root.json")));

if($root->username == $username && $root->password == $password)
{
  $_SESSION["userID"] = 0;
  httpSuccess("Inicio de sesión como usuario root.");
}
else
{
  httpError("Nombre de usuario o contraseña incorrecta(s).");
}

?>
