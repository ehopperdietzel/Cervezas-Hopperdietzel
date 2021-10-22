var eLoginPanel,eLoginEmailInput,eLoginPasswordInput,eLoginKeepSessionCheckbox,eLoginButton,eLoginErrorLabel,eLoginForgotPasswordButton;

function login()
{
  var email = eLoginEmailInput.val();
  var password = eLoginPasswordInput.val();

  if(!email || !password || email === "" || password === "")
  {
    eErrorLabel.html("Ingrese email y contraseña.").show();
    return;
  }

  $.ajax({
    url : 'php/api/v1/login.php',
    data :
    {
      email : email,
      password : password
    },
    type : 'POST',
    success : function(res)
    {
      if(debug)console.log(res);
      localStorage.setItem("token", res);
      checkSession();
    },
    error : function(xhr, status)
    {
      if(debug)console.log(xhr);
      eLoginErrorLabel.html(xhr.responseText).show();
    }
  });
}

function logout()
{
  localStorage.removeItem("token");
  checkSession();
}

var decode = function(input)
{
    // Replace non-url compatible chars with base64 standard chars
    input = input
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    // Pad out with standard base64 required padding characters
    var pad = input.length % 4;
    if(pad) {
      if(pad === 1) {
        throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
      }
      input += new Array(5-pad).join('=');
    }

    return atob(input);
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
    userID = parseInt(JSON.parse(decode(token.split(".")[1]))["usr"]);

    eLoginPanel.hide();

    // Si ha iniciado como usuario root
    if(userID == 0)
    {
      eUsernameLabel.html("Usuario Root");
      eAdminPanel.fadeIn(256);
      loadUsersSection();
    }
  }
}
