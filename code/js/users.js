var eUsersSectionButton,eAddUserButton;

function loadUsersSection()
{
  eAllSectionButtons.find(".select-indicator").hide();
  eUsersSectionButton.find(".select-indicator").show();
}

function addUser()
{
  showModal(eUserModal);
}
