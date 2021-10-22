<?php

include_once("../../shared/validate.php");
include_once("../../shared/jwt.php");

requiredParameters(array("request"));

// Se conecta a la base de datos
mysqlConnect();

// Arqutectura de software
// MVC
// Clean architecture

switch ($_POST["request"])
{
  // Crear usuario
  case 'create':
  {
    // Verifica parámetros
    requiredParameters(array("token","name","lastname","email","password","status"));

    // Verifica que el id de usuario sea
    if(validateToken($_POST["token"]) != "0")
      httpError("Unauthorized user.");

    // Valida parámetros
    $name     = validate($_POST["name"],      "name",       32,true);
    $lastname = validate($_POST["lastname"],  "name",       32,true);
    $email    = validate($_POST["email"],     "email",      64,true);
    $password = validate($_POST["password"],  "text",       43,true);
    $status   = validate($_POST["status"],    "userStatus", 1 ,true);

    // Verifica que el email no se encuentre en uso
    $sql = "SELECT email FROM users WHERE email='".$email."'";

    if(sqlQuery($sql)->num_rows != 0)
      httpError("El email es utilizado por otro usuario.");

    $sql = "INSERT INTO users (firstname, lastname, email, password,status) VALUES ('".$name."','".$lastname."','".$email."','".$password."',".$status.")";
    sqlQuery($sql);
    httpSuccess(strval($conn->insert_id));

  } break;

  // Listar usuarios
  case 'list':
  {
    // Verifica parámetros
    requiredParameters(array("token"));

    // Verifica token
    $tokenId = validateToken($_POST["token"]);

    $sql = "";

    // Si es el usuario root se incluye la contraseña en los resultados
    if($tokenId==0)
      $sql = "SELECT id,firstname,lastname,email,password,status FROM users ORDER BY firstname";
    else
      $sql = "SELECT id,firstname,lastname,email,status FROM users ORDER BY firstname";

    $res = sqlSearchToJSON($sql);
    httpSuccess($res);

  } break;
  // Modificar usuario
  case 'update':
  {
    // Verifica parámetros
    requiredParameters(array("token","userId"));

    // Verifica que el id de usuario sea root
    if(validateToken($_POST["token"]) != "0")
      httpError("Unauthorized user.");

    // Valida id de usuario a modificar
    $userId = validate($_POST["userId"],"user",2,true);

    // Update sql
    $update_sql = "UPDATE users SET ";

    if(isset($_POST["firstname"]))
    {
      $firstname = validate($_POST["firstname"],"name",32,true);
      $update_sql = $update_sql."firstname='".$firstname."',";
    }
    if(isset($_POST["lastname"]))
    {
      $lastname = validate($_POST["lastname"],"name",32,true);
      $update_sql = $update_sql."lastname='".$lastname."',";
    }
    if(isset($_POST["email"]))
    {
      $email = validate($_POST["email"],"email",64,true);

      // Verifica que el email no se encuentre en uso
      $sql = "SELECT email FROM users WHERE email='".$email."'";

      if(sqlQuery($sql)->num_rows != 0)
        httpError("El email es utilizado por otro usuario.");

      $update_sql = $update_sql."email='".$email."',";
    }
    if(isset($_POST["password"]))
    {
      $password = validate($_POST["password"],"text",43,true);
      $update_sql = $update_sql."password='".$password."',";
    }
    if(isset($_POST["status"]))
    {
      $status = validate($_POST["status"],"userStatus", 1 ,true);
      $update_sql = $update_sql."status=".$status.",";
    }

    if($update_sql == "UPDATE users SET ")
      httpError("Modifique al menos un parámetro.");

    $update_sql = substr_replace($update_sql ,"", -1)." WHERE id=".$userId;

    sqlQuery($update_sql);
    httpSuccess("Ok");

  } break;
  default:
    // code...
    break;
}


?>
