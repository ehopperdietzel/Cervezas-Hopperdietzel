<?php

include "../php/shared/db.php";

function createTable($section, $conn, $sql)
{
  if ($conn->query($sql) === TRUE)
  {
    echo "<li>".$section." table created successfully.</li>";
    return true;
  }
  else
  {
    echo "<li style='color:red'>".$conn->error."</li>";
    return false;
  }
}

// Create connection
$conn = new mysqli($db->hostname, $db->username, $db->password);

// Check connection
if ($conn->connect_error)
    die("Connection failed: " . $conn->connect_error);

// Create database
$sql = "CREATE DATABASE ".$db->database;

echo "<h1>Setting Up Database</h1><ul style='font-family:verdana;color:green'>";

if ($conn->query($sql) === TRUE)
    echo "<li>Database created successfully.</li>";
else
    echo "<li style='color:red'>".$conn->error."</li>";

// Convierte a UTF 8
$sql = "ALTER DATABASE ".$db->database." CHARACTER SET utf8 COLLATE utf8_general_ci";

if ($conn->query($sql) === TRUE)
    echo "<li>Database converted to UTF-8.</li>";
else
    echo "<li style='color:red'>".$conn->error."</li>";

// Connects to the db
$conn = new mysqli($db->hostname, $db->username, $db->password, $db->database);

// Check connection
if ($conn->connect_error)
    die("<li style='color:red'>Connection failed: ".$conn->connect_error."</li>");

// Create tables

// Usuarios
$sql = "CREATE TABLE users (
  id INT(2) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  firstname VARCHAR(32),
  lastname VARCHAR(32),
  username VARCHAR(32),
  password VARCHAR(32),
  active BIT(1) DEFAULT b'1'
)";

createTable("Users", $conn, $sql);


$conn->close();

echo "</ul>"
?>
