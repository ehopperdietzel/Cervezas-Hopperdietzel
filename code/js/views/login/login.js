var eUsernameInput,ePasswordInput,eKeepSessionCheckbox,eLoginButton,eErrorLabel,eForgotPasswordButton;

$(document).ready(function()
{
  // Referencia los elementos del DOM
  getDOMElements();

  // Eventos
  genDOMEvents();
});

function getDOMElements()
{
  eUsernameInput        = $("#username-input");
  ePasswordInput        = $("#password-input");
  eKeepSessionCheckbox  = $("#session-menu input");
  eLoginButton          = $("#login-button");
  eErrorLabel           = $("#error-label");
  eForgotPasswordButton = $("#password-button");
}

function genDOMEvents()
{
  eLoginButton.click(login);
}

function login()
{
  var username = eUsernameInput.val();
  var password = ePasswordInput.val();

  if(!username || !password || username === "" || password === "")
  {
    eErrorLabel.html("Ingrese el nombre de usuario y contraseña.").show();
    return;
  }

  $.ajax({
    url : 'php/api/v1/session/login.php',
    data :
    {
      username : username,
      password : password
    },
    type : 'POST',
    success : function(json)
    {
        window.location.href = "/";
    },
    error : function(xhr, status)
    {
        eErrorLabel.html(xhr.responseText).show();
    }
});
}
