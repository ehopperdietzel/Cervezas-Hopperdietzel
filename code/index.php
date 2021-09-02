<?php

// Ruteo de sesiones

session_start();

// Verifica sesión
if(isset($_SESSION['userID']))
{
  // Usuario root
  if($_SESSION['userID'] == 0)
    include "php/views/admin/base.php";

  // Usuario admin
  else
    include "php/views/admin.php";
}
// No ha iniciado sesión ( panel de login )
else
{
  include "php/views/login/base.php";
}
?>
