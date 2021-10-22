<?php

include_once("../../shared/validate.php");
include_once("../../shared/jwt.php");

requiredParameters(array("email","password"));

$email = validate($_POST["email"],"text");
$password = validate($_POST["password"],"text");

$root = json_decode(file_get_contents(realpath(dirname(__FILE__)."/../../../configuration/root.json")));

if($root->username == $email && $root->password == $password)
{
  // Sesión usuario root
  httpSuccess(genToken(0));
}
else
{
  httpError("Email o contraseña incorrecta(s).");
}

?>
