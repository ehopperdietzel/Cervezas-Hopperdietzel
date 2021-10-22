<div id="admin-panel">

  <div id="left-menu">

    <div class="top">
      <div class="text-container">
        <div class="title">HOPPERDIETZEL</div>
        <div class="username"></div>
      </div>
      <div id="loading-indicator" class=""></div>
    </div>

    <div id="menu-sections">

      <div id="users-section-button" class="section-button pointer">
        <img src="img/icons/user.png">
        <div class="section-name">Usuarios</div>
        <div class="select-indicator"></div>
      </div>

      <div id="logout-button" class="section-button pointer">
        <img src="img/icons/logout.png">
        <div class="section-name">Salir</div>
      </div>

    </div>

  </div>

  <div id="right-menu">
    <?php include "users.php";?>
  </div>

  <?php include "modals.php";?>

</div>
