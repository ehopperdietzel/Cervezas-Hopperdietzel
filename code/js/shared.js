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
  // Paneles
  eLoginPanel                 = $("#login-panel");
  eAdminPanel                 = $("#admin-panel");

  // Elementos del login panel
  eUsernameInput              = $("#username-input");
  ePasswordInput              = $("#password-input");
  eKeepSessionCheckbox        = $("#session-menu input");
  eLoginButton                = $("#login-button");
  eErrorLabel                 = $("#error-label");
  eForgotPasswordButton       = $("#password-button");

  // Elementos del admin panel
  eAllSectionButtons          = $("#menu-sections .section-button");
  eUsersSectionButton         = $("#users-section-button");
  eUsernameLabel              = $("#left-menu .username");
  eLogoutButton               = $("#logout-button");

  // Sección Usuarios
  eAddUserButton              = $("#add-user-button");
  eUserModal                  = $("#users-modal");
  eUserModalNameInput         = $("#user-name-input");
  eUserModalLastnameInput     = $("#user-lastname-input");
  eUserModalUsernameInput     = $("#user-username-input");
  eUserModalEmailInput        = $("#user-email-input");
  eUserModalStatusSelect      = $("#user-status-select");
  eUserModalCancelButton      = $("#user-status-select");
  eUserModalCancelButton      = $("#user-status-select");

  // Modales
  eModalBackground            = $("#modal-background");

}

function genDOMEvents()
{
  eModalBackground.click(clickedOutsideModal);
  eLoginButton.click(login);
  eLogoutButton.click(logout);
  eUsersSectionButton.click(loadUsersSection);

  // Sección usuarios
  eAddUserButton.click(addUser);
}
