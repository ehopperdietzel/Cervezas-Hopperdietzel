<div id="modal-background">

  <!-- add user modal -->
  <div id="users-modal" class="modal">
    <div class="title">Nuevo usuario</div>
    <input id="user-name-input" type="text" placeholder="Nombre"/>
    <input id="user-lastname-input" type="text" placeholder="Apellido"/>
    <input id="user-email-input" type="text" placeholder="Email"/>
    <input id="user-password-input" type="text" placeholder="Contraseña"/>
    <div class="select">
      <select id="user-status-select">
        <option value=1>Habilitado</option>
        <option value=0>Deshabilitado</option>
      </select>
    </div>
    <div id="user-error-label" class="error-label">Error</div>
    <div class="buttons-container">
      <button id="user-create-button" class="light-green">Añadir</button>
      <button id="user-save-button" class="light-blue">Guardar</button>
      <button id="user-cancel-button" class="gray">Cancelar</button>
    </div>
  </div>

</div>
