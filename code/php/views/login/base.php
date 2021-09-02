<html>
  <head>
    <title>Login de Panel de Administrador</title>
    <meta charset="utf-8">

    <!-- Estilos -->
    <link type="text/css" rel="stylesheet" href="css/global.css">
    <link type="text/css" rel="stylesheet" href="css/views/login.css">

    <!-- Scripts -->
    <script type="text/javascript" src="js/lib/jquery-3.6.0.min.js"></script>
    <script type="text/javascript" src="js/views/login/login.js"></script>

  </head>
  <body>
    <div id='login-panel'>
      <div id="title">HOPPERDIETZEL</div>
      <div id="subtitle">Panel de Administrador</div>
      <input id="username-input" class="full-width" type="text" placeholder="Usuario"/><br>
      <input id="password-input" class="full-width" type="password" placeholder="Contraseña"/><br>
      <div id="session-menu" class="text-align-left">
        <input type="checkbox"/> Mantener sesión?
      </div>
      <div id="error-label">Error</div>
      <button id="login-button" class="light-blue full-width">Iniciar sesión</button><br>
      <button id="password-button"class="text-only full-width">Recuperar contraseña</button>
    </div>
  </body>
</html>
