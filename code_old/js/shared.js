var token,userID;

var debug = true;

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
  eLoginEmailInput            = $("#login-email-input");
  eLoginPasswordInput         = $("#login-password-input");
  eLoginKeepSessionCheckbox   = $("#login-session-menu input");
  eLoginButton                = $("#login-button");
  eLoginErrorLabel            = $("#login-error-label");
  eLoginForgotPasswordButton  = $("#login-password-button");

  // Elementos del admin panel
  eAllSectionButtons          = $("#menu-sections .section-button");
  eUsersSectionButton         = $("#users-section-button");
  eUsernameLabel              = $("#left-menu .username");
  eLogoutButton               = $("#logout-button");
  eLoadingIndicator           = $("#loading-indicator");

  // Sección Usuarios
  eAddUserButton              = $("#add-user-button");
  eUserModal                  = $("#users-modal");
  eUserModalNameInput         = $("#user-name-input");
  eUserModalLastnameInput     = $("#user-lastname-input");
  eUserModalEmailInput        = $("#user-email-input");
  eUserModalPasswordInput     = $("#user-password-input");
  eUserModalStatusSelect      = $("#user-status-select");
  eUserModalCancelButton      = $("#user-cancel-button");
  eUserModalCreateButton      = $("#user-create-button");
  eUserModalSaveButton        = $("#user-save-button");
  eUserModalErrorLabel        = $("#user-error-label");
  eUserTableBody              = $("#user-table tbody");

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
  eUserModalCancelButton.click(hideModal);
  eUserModalCreateButton.click(createUser);
  eUserModalSaveButton.click(updateUser);
}

function showLoadingIndicator()
{
  eLoadingIndicator.addClass("loading");
}

function hideLoadingIndicator()
{
  eLoadingIndicator.removeClass("loading");
}
