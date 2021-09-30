var token,userID;

$(document).ready(function()
{
  // Referencia los elementos del DOM
  getDOMElements();

  // Eventos
  genDOMEvents();

  // Verifica sessión
  checkSession();
});

function getDOMElements()
{
  eLoginPanel           = $("#login-panel");
  eAdminPanel           = $("#admin-panel");

  // Login panel
  eUsernameInput        = $("#username-input");
  ePasswordInput        = $("#password-input");
  eKeepSessionCheckbox  = $("#session-menu input");
  eLoginButton          = $("#login-button");
  eErrorLabel           = $("#error-label");
  eForgotPasswordButton = $("#password-button");

  // Admin panel
  eUsernameLabel        = $("#left-menu .username");
  eLogoutButton         = $("#logout-button");
}

function genDOMEvents()
{
  eLoginButton.click(login);
  eLogoutButton.click(logout);
}

function checkSession()
{
  token = localStorage.getItem("token");

  // Si no ha iniciado sesión
  if(token === null)
  {
    eAdminPanel.hide();
    eLoginPanel.fadeIn(256);
  }
  else
  {
    userID = parseInt(JSON.parse(atob(token.split(".")[1]))["usr"]);

    eLoginPanel.hide();

    // Si ha iniciado como usuario root
    if(userID == 0)
    {
      eUsernameLabel.html("Usuario Root");
      eAdminPanel.fadeIn(256);
    }
  }
}
