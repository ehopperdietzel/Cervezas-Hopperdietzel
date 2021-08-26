<?php

// Verifica sesión de administrador
if(isset($_SESSION['userID']))
{
  include "php/views/admin.php";
}
else
{
  include "php/views/login.php";
}
?>
