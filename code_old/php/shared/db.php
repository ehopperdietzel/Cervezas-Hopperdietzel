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

// SQL query a JSON
function sqlSearchToJSON($sql)
{
  global $conn;
  $result = $conn->query($sql);

  if($result)
  {
    $rows = array();
    while($r = mysqli_fetch_assoc($result))
        $rows[] = $r;

    return json_encode($rows);
  }
  else
    httpError("MySQL Error:".$conn->error);
}

// SQL query
function sqlQuery($sql, $multi=false)
{
  global $conn;
  if($multi) $result = $conn->multi_query($sql);
  else $result = $conn->query($sql);

  if($result)
    return $result;
  else
    httpError("MySQL Error:".$conn->error);
}

// SQL search array
function sqlSearchToArray($sql)
{
  global $conn;
  $result = $conn->query($sql);

  if($result)
  {
    $rows = array();
    while($r = mysqli_fetch_assoc($result))
        $rows[] = $r;

    return $rows;
  }
  else
    httpError("MySQL Error:".$conn->error);
}

?>
