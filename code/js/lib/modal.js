var eModalBackground,eCurrentModal;

function showModal(modal)
{
  eCurrentModal = modal;
  eCurrentModal.show();
  eModalBackground.css({"display":"flex"});
}

function hideModal()
{
  eModalBackground.hide();
  eCurrentModal.hide();
}

function clickedOutsideModal(event)
{
  if($(event.target).attr('id') == "modal-background")
    hideModal();
}
