var eLoginPanel,eUsernameInput,ePasswordInput,eKeepSessionCheckbox,eLoginButton,eErrorLabel,eForgotPasswordButton;

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
    success : function(res)
    {
        localStorage.setItem("token", res);
        checkSession();
    },
    error : function(xhr, status)
    {
        eErrorLabel.html(xhr.responseText).show();
    }
});
}
