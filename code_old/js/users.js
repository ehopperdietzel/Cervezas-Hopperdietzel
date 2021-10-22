var eUsersSectionButton,eAddUserButton,eUserModalNameInput,
eUserModalLastnameInput,eUserModalEmailInput,eUserModalPasswordInput,
eUserModalStatusSelect,eUserModalCancelButton,eUserModalCreateButton,
eUserModalSaveButton,eUserModalErrorLabel,eUserTableBody;

var addingUser = false;
var usersList = [];
var editedUser = null;

function loadUsersSection()
{
  eAllSectionButtons.find(".select-indicator").hide();
  eUsersSectionButton.find(".select-indicator").show();
  getUserList();
}

function addUser()
{
  eUserModalNameInput.val("");
  eUserModalLastnameInput.val("");
  eUserModalEmailInput.val("");
  eUserModalPasswordInput.val("");
  eUserModalStatusSelect.val("1");
  eUserModalSaveButton.hide();
  eUserModalCreateButton.show();
  eUserModalErrorLabel.hide();
  showModal(eUserModal);
}

function createUser()
{
  if(addingUser)return;
  addingUser = true;
  showLoadingIndicator();
  $.ajax({
    url : 'php/api/v1/users.php',
    data :
    {
      token         : token,
      request       : "create",
      name          : eUserModalNameInput.val(),
      lastname      : eUserModalLastnameInput.val(),
      email         : eUserModalEmailInput.val(),
      password      : eUserModalPasswordInput.val(),
      status        : parseInt(eUserModalStatusSelect.val())
    },
    type : 'POST',
    success : function(res)
    {
      if(debug) console.log(res);

      appendUserToTable({
        firstname:eUserModalNameInput.val(),
        lastname:eUserModalLastnameInput.val(),
        email:eUserModalEmailInput.val(),
        password:eUserModalPasswordInput.val(),
        status:parseInt(eUserModalStatusSelect.val())
      });

      hideLoadingIndicator();
      hideModal();
      addingUser = false;
    },
    error : function(xhr, status)
    {
      if(debug) console.log(xhr);
      eUserModalErrorLabel.html(xhr.responseText).show();
      hideLoadingIndicator();
      addingUser = false;
    }
  });
}

function getUserList()
{
  showLoadingIndicator();
  $.ajax({
    url : 'php/api/v1/users.php',
    data :
    {
      token         : token,
      request       : "list"
    },
    type : 'POST',
    success : function(res)
    {
      if(debug) console.log(res);
      usersList = JSON.parse(res);
      printUserList();
      hideLoadingIndicator();
    },
    error : function(xhr, status)
    {
      if(debug) console.log(xhr);
      hideLoadingIndicator();
    }
  });
}

function editUser(user)
{
  editedUser = user;
  eUserModalNameInput.val(user.firstname);
  eUserModalLastnameInput.val(user.lastname);
  eUserModalEmailInput.val(user.email);
  eUserModalPasswordInput.val(user.password);
  eUserModalStatusSelect.val(user.status);
  eUserModalSaveButton.show();
  eUserModalCreateButton.hide();
  eUserModalErrorLabel.hide();
  showModal(eUserModal);
}

function updateUser()
{
  showLoadingIndicator();

  var data =
  {
    token         : token,
    userId        : editedUser.id,
    request       : "update"
  };

  if(eUserModalNameInput.val() != editedUser.firstname)
    data.firstname = eUserModalNameInput.val();
  if(eUserModalLastnameInput.val() != editedUser.lastname)
    data.lastname = eUserModalLastnameInput.val();
  if(eUserModalEmailInput.val() != editedUser.email)
    data.email = eUserModalEmailInput.val();
  if(eUserModalPasswordInput.val() != editedUser.password)
    data.password = eUserModalPasswordInput.val();
  if(parseInt(eUserModalStatusSelect.val()) != parseInt(editedUser.status))
    data.status = eUserModalStatusSelect.val();

  $.ajax({
    url : 'php/api/v1/users.php',
    data : data,
    type : 'POST',
    success : function(res)
    {
      if(debug) console.log(res);
      //usersList = JSON.parse(res);
      //printUserList();
      //hideLoadingIndicator();
      hideModal();
      getUserList();
    },
    error : function(xhr, status)
    {
      if(debug) console.log(xhr);
      hideLoadingIndicator();
    }
  });
}

function appendUserToTable(user)
{
  var data = [
    [
      {
        text: "Editar",
        action: function ()
        {
          editUser(user);
        }
      }
    ]
  ];

  var html = "";
  html += "<tr userId='"+user.firstname+"'>";
  html += "<td>"+user.firstname+"</td>";
  html += "<td>"+user.lastname+"</td>";
  html += "<td>"+user.email+"</td>";
  //html += "<td>"+user.password+"</td>";
  html += "<td>********</td>";
  if(user.status == 1)
    html += "<td class='habilitado'>Habilitado</td>";
  else
    html += "<td class='deshabilitado'>Deshabilitado</td>";
  html += "</tr>";

  var row = $(html);
  row.contextMenu(data);
  row.appendTo(eUserTableBody);
}

function printUserList()
{
  eUserTableBody.empty();
  for(var i = 0; i < usersList.length; i++)
  {
    appendUserToTable(usersList[i]);
  }
}
