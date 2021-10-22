<?php

include_once("db.php");

mysqlConnect();

function valida_rut($r = false){
    if((!$r) or (is_array($r)))
        return false; /* Hace falta el rut */

    if(!$r = preg_replace('|[^0-9kK]|i', '', $r))
        return false; /* Era código basura */

    if(!((strlen($r) == 8) or (strlen($r) == 9)))
        return false; /* La cantidad de carácteres no es válida. */

    $v = strtoupper(substr($r, -1));
    if(!$r = substr($r, 0, -1))
        return false;

    if(!((int)$r > 0))
        return false; /* No es un valor numérico */

    $x = 2; $s = 0;
    for($i = (strlen($r) - 1); $i >= 0; $i--){
        if($x > 7)
            $x = 2;
        $s += ($r[$i] * $x);
        $x++;
    }
    $dv=11-($s % 11);
    if($dv == 10)
        $dv = 'K';
    if($dv == 11)
        $dv = '0';
    if($dv == $v)
        return number_format($r, 0, '', '.').'-'.$v; /* Formatea el RUT */
    return false;
}

function validate($str,$type,$len=-1,$emptyCheck = false)
{

  global $conn;

  http_response_code(400);

  if($type == "number")
    $str = strval($str);

  if($emptyCheck && strlen($str) == 0)
    httpError("Faltan campos por completar.");


  if($len != -1 && $len < strlen($str))
  {
    switch ($type)
    {
      case 'name':
      {
        httpError("Nombre demasiado largo.");
        break;
      }
      case 'rut':
      {
        httpError("RUT demasiado largo.");
        break;
      }
      case 'phone':
      {
        httpError("Teléfono demasiado largo.");
        break;
      }
      case 'email':
      {
        httpError("Email demasiado largo.");
        break;
      }
      case 'number':
      {
        httpError("Número demasiado largo.");
        break;
      }
      case 'text':
      {
        httpError("Texto demasiado largo.");
        break;
      }
      case 'url':
      {
        httpError("URL demasiado largo.");
        break;
      }
    }
  }

  switch ($type)
  {
    case 'name':
    {
      $str = mysqli_real_escape_string($conn,ucfirst(strtolower(trim($str))));
      if(!preg_match("/^([A-Za-zÀ-ÖØ-öø-þ\s]*)$/",$str))
      httpError("El nombre contiene carácteres inválidos.");
      break;
    }
    case 'userStatus':
    {
      $str = validate($str,"number",1);
      if($str != "0" && $str != "1")
      httpError("Estado de usuario inválido.");
      break;
    }
    case 'city':
    {
      $str = validate($str,"number",6);
      $count = count(sqlSearchToArray("SELECT * FROM cities WHERE id=".$str));
      if($count == 0) httpError("Ciudad no disponible.");
      break;
    }
    case 'sector':
    {
      $str = validate($str,"number",6);
      $count = count(sqlSearchToArray("SELECT * FROM sectors WHERE id=".$str));
      if($count == 0) httpError("Sector no disponible.");
      break;
    }
    case 'college':
    {
      $str = validate($str,"number",6);
      $count = count(sqlSearchToArray("SELECT * FROM colleges WHERE id=".$str));
      if($count == 0) httpError("Colegio no disponible.");
      break;
    }
    case 'course':
    {
      $str = validate($str,"number",3);
      $count = count(sqlSearchToArray("SELECT * FROM courses WHERE id=".$str));
      if($count == 0) httpError("Curso no disponible.");
      break;
    }
    case 'university':
    {
      $str = validate($str,"number",6);
      $count = count(sqlSearchToArray("SELECT * FROM universities WHERE id=".$str));
      if($count == 0) httpError("Universidad no disponible.");
      break;
    }
    case 'career':
    {
      $str = validate($str,"number",6);
      $count = count(sqlSearchToArray("SELECT * FROM careers WHERE id=".$str));
      if($count == 0) httpError("Carrera no disponible.");
      break;
    }
    case 'agePreference':
    {
      $str = validate($str,"number",1);
      $count = count(sqlSearchToArray("SELECT * FROM agePreferences WHERE id=".$str));
      if($count == 0) httpError("Edad no disponible.");
      break;
    }
    case 'accountState':
    {
      $str = validate($str,"number",1);
      $count = count(sqlSearchToArray("SELECT * FROM accountStates WHERE id=".$str));
      if($count == 0) httpError("El estado de cuenta no existe.");
      break;
    }
    case 'depositStatus':
    {
      $str = validate($str,"number",1);
      $count = count(sqlSearchToArray("SELECT * FROM depositStates WHERE id=".$str));
      if($count == 0) httpError("Estado de depósito inválido.");
      break;
    }
    case 'deposit':
    {
      $str = validate($str,"number",16);
      $count = count(sqlSearchToArray("SELECT * FROM deposits WHERE id=".$str));
      if($count == 0) httpError("El depósito no existe.");
      break;
    }
    case 'subject':
    {
      $str = validate($str,"number",2);
      $count = count(sqlSearchToArray("SELECT * FROM subjects WHERE id=".$str));
      if($count == 0) httpError("Tópico no disponible.");
      break;
    }
    case 'bank':
    {
      $str = validate($str,"number",6);
      $count = count(sqlSearchToArray("SELECT * FROM banks WHERE id=".$str));
      if($count == 0) httpError("Banco no disponible.");
      break;
    }
    case 'weekDay':
    {
      $str = validate($str,"number",2);
      $count = count(sqlSearchToArray("SELECT id FROM weekDays WHERE id=".$str));
      if($count == 0) httpError("Día de semana inexistente.");
      break;
    }
    case 'hour':
    {
      $str = validate($str,"number",2);
      $count = count(sqlSearchToArray("SELECT id FROM hours WHERE id=".$str));
      if($count == 0) httpError("Horario inexistente.");
      break;
    }
    case 'month':
    {
      $str = validate($str,"number",2);
      $count = count(sqlSearchToArray("SELECT id FROM months WHERE id=".$str));
      if($count == 0) httpError("Mes inexistente.");
      break;
    }
    case 'bankType':
    {
      $str = validate($str,"number",6);
      $count = count(sqlSearchToArray("SELECT * FROM bankAccountTypes WHERE id=".$str));
      if($count == 0) httpError("Tipo de cuenta bancaria no disponible.");
      break;
    }
    case 'tutor':
    {
      $str = validate($str,"number",6);
      $count = count(sqlSearchToArray("SELECT id FROM tutors WHERE id=".$str));
      if($count == 0) httpError("El tutor no exíste.");
      break;
    }
    case 'user':
    {
      $str = validate($str,"number",2);
      $count = count(sqlSearchToArray("SELECT id FROM users WHERE id=".$str));
      if($count == 0) httpError("El usuario no exíste.");
      break;
    }
    case 'rut':
    {
      $str = valida_rut(trim($str));
      if($str == false) httpError("RUT inválido.\nDebe tener el formato 00.000.000-X");
      break;
    }
    case 'phone':
    {
      $str = trim($str);
      if(!preg_match("/^[\(]?[\+]?(\d{2}|\d{3})[\)]?[\s]?((\d{6}|\d{8})|(\d{3}[\*\.\-\s]){2}\d{3}|(\d{2}[\*\.\-\s]){3}\d{2}|(\d{4}[\*\.\-\s]){1}\d{4})|\d{8}|\d{10}|\d{12}$/",$str))
      httpError("Número de teléfono inválido.");
      break;
    }
    case 'email':
    {
      $str = trim($str);
      if(!preg_match("/^[_.0-9a-zA-Z-]+@([0-9a-zA-Z][0-9a-zA-Z-]+.)+[a-zA-Z]{2,6}$/i",$str))
      httpError("Correo inválido.");
      break;
    }
    case 'number':
    {
      if(!is_numeric($str))
      httpError("Solo números.");
      break;
    }
    case 'text':
    {
      $str = mysqli_real_escape_string($conn,htmlspecialchars(trim($str)));
      break;
    }
    case 'search':
    {
      $str = mysqli_real_escape_string($conn,htmlspecialchars(trim($str)));
      break;
    }
    case 'base64':
    {
      if ( ! preg_match('%^[a-zA-Z0-9/+]*={0,2}$%', $str))
        httpError("Formato de imagen incorrecto");
      break;
    }
    case 'json':
    {
      $str = json_decode($str);
      if(json_last_error() != JSON_ERROR_NONE)
      httpError("Solo números.");
      break;
    }
    case 'url':
    {
      $str = trim($str);

      $regex = "((https?|ftp)\:\/\/)?"; // SCHEME
      $regex .= "([a-z0-9+!*(),;?&=\$_.-]+(\:[a-z0-9+!*(),;?&=\$_.-]+)?@)?"; // User and Pass
      $regex .= "([a-z0-9-.]*)\.([a-z]{2,3})"; // Host or IP
      $regex .= "(\:[0-9]{2,5})?"; // Port
      $regex .= "(\/([a-z0-9+\$_-]\.?)+)*\/?"; // Path
      $regex .= "(\?[a-z+&\$_.-][a-z0-9;:@&%=+\/\$_.-]*)?"; // GET Query
      $regex .= "(#[a-z_.-][a-z0-9+\$_.-]*)?"; // Anchor

      if(!preg_match("/^$regex$/", $str)) httpError("URL inválido.");
      break;
    }

  }

  http_response_code(200);
	return $str;
}

// Verífica parámetros requeridos
function requiredParameters($required,$method = "POST")
{
  $error = false;
  if($method == "POST")
  {
    foreach($required as $field)
    {
      if (!isset($_POST[$field]))
      {
        $error = true;
        break;
      }
    }
  }
  else if($method == "GET")
  {
    foreach($required as $field)
    {
      if (!isset($_GET[$field]))
      {
        $error = true;
        break;
      }
    }
  }

  if ($error)
    httpError("Request error, missing parameters.");

}
?>
