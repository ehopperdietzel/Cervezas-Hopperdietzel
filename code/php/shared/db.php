<?php

include_once("shared.php");

// Credenciales MySQL
$db = json_decode(file_get_contents(realpath(dirname(__FILE__)."/../../configuration/db.json")));

// MySQL
$conn;

// Connect to mysql
function mysqlConnect()
{
  global $db, $conn;

  // Connects to the db
  $conn = new mysqli($db->hostname, $db->username, $db->password, $db->database);

  // Check connection
  if ($conn->connect_error)
      httpError("Database connection failed.");
}

?>
