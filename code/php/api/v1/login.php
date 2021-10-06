<?php

include_once("../../shared/validate.php");
include_once("../../shared/jwt.php");

requiredParameters(array("username","password"));

$username = validate($_POST["username"],"text");
$password = validate($_POST["password"],"text");

$root = json_decode(file_get_contents(realpath(dirname(__FILE__)."/../../../configuration/root.json")));

if($root->username == $username && $root->password == $password)
{
  // Sesión usuario root
  httpSuccess(genToken(0));
}
else
{
  httpError("Nombre de usuario o contraseña incorrecta(s).");
}

?>
