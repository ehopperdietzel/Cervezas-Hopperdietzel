var eAdminPanel,eUsernameLabel;

var eLogoutButton;

function logout()
{
  localStorage.removeItem("token");
  checkSession();
}
