import { Component } from '@angular/core';
import { Modal } from 'src/app/classes/modal';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css']
})
export class UserModalComponent extends Modal{

  public errorMessage : string = "";
  public title : string = "Nuevo Usuario";
  public usersController : any;

  // Form data
  public formData : any =
  {
    firstname : "",
    lastname  : "",
    email     : "",
    password  : "",
    status    : 0
  };

  // Before changes
  public formDataBackup : any = {};

  public formDataReset : any =
  {
    firstname : "",
    lastname  : "",
    email     : "",
    password  : "",
    status    : 0
  };
  
  constructor(protected modalService : ModalService)
  {
    super("users",modalService);
  }

  public createUser() : void
  {
    this.usersController.createUser();
  }

  public formDataChanged() : boolean
  {
    for(let key in this.formData)
    {
      if(!(key in this.formDataBackup))
        return false;
      if(this.formData[key] != this.formDataBackup[key])
        return true;
    }
    
    return false;
  }

  public updateUser() : void
  {
    if(this.formDataChanged())
      this.usersController.updateUser();
  }
  
}
