import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { UserModalComponent } from 'src/app/components/modals/user-modal/user-modal.component';
import { UsersService } from 'src/app/services/users.service';
import { LoadingIndicatorService } from 'src/app/services/loading-indicator.service';
import { ContextMenuService } from 'src/app/services/context-menu.service';

@Component({
  selector: 'users-section',
  templateUrl: './users-section.component.html',
  styleUrls: ['./users-section.component.css']
})
export class UsersSectionComponent implements OnInit {

  public keys : Array<string> = ["firstname","lastname","email","password","status"];
  public usersModal : UserModalComponent;
  public columns : Array<any> = [
    {
      title:'Nombre',
      key:'firstname',
      type:'text',
      width:120,
      visible:true
    },
    {
      title:'Apellido',
      key:'lastname',
      type:'text',
      width:120,
      visible:true
    },
    {
      title:'Email',
      key:'email',
      type:'text',
      width:150,
      visible:true
    },
    {
      title:'Contraseña',
      key:'password',
      type:'text',
      width:100,
      visible:true
    },
    {
      title:'Estado',
      key:'status',
      type:'statusText',
      width:150,
      visible:true
    }];

  public rows : Array<any> = [];

  constructor(private modals:ModalService, 
              private usersService : UsersService,
              public contextMenuService : ContextMenuService,
              public loadingIndicatorService : LoadingIndicatorService)
  {
    this.usersModal = this.modals.getModal("users");
  }

  ngOnInit(): void 
  {
    this.usersModal.usersController = this;
    this.getUsers('');
  }

  public getUsers(query : string)
  {
    this.loadingIndicatorService.loadingStates["getUsersWithPassword"] = true;
    this.usersService.getUsers(query).subscribe(
    res => 
    {
      this.loadingIndicatorService.loadingStates["getUsersWithPassword"] = false;
      this.rows = res;
    },
    err => 
    {
      this.loadingIndicatorService.loadingStates["getUsersWithPassword"] = false;
      console.log(err);
    });
  }

  public searchUsers(event : any)
  {
    this.getUsers(event.target.value);
  }

  public createUser() : void
  {
    this.loadingIndicatorService.loadingStates["createUser"] = true;
    this.usersService.createUser(this.usersModal.formData).subscribe(
    res => 
    {
      this.loadingIndicatorService.loadingStates["createUser"] = false;
      let newRow : any = Object.assign({}, this.usersModal.formData)
      newRow['id'] = res['userId'];
      this.rows.push(newRow);
      this.usersModal.close();
    },
    err => 
    {
      this.loadingIndicatorService.loadingStates["createUser"] = false;
      this.usersModal.errorMessage = err.error.message;
      console.log(err);
    });
  }

  public showUserModal() : void
  {
    this.usersModal.formData = Object.assign({}, this.usersModal.formDataReset);
    this.usersModal.title = "Nuevo Usuario";
    this.usersModal.open();
  }

  public rowRightClick(event : any) : void
  {
    event.preventDefault();

    let items = [
      {
        name:"Modificar",
        data:event.row,
        clickFunc:"openModifyUserModal"
      },
      {
        name:"Eliminar",
        data:event.row,
        clickFunc:"showDeleteUserAlert"
      }
    ]
    this.contextMenuService.show(this,items,[event.clientX,event.clientY],false);
  }

  public showDeleteUserAlert(userData : any) : void
  {
    this.modals.showAlert(this,"¡Cuidado!","Está a punto de eliminar al usuario <b class='text red'>"+userData['firstname']+" "+userData['lastname']+"</b>. ¿Desea continuar?",[{text:"Eliminar",type:'warning',clickFunc:'deleteUser',data:userData}])
  }

  public openModifyUserModal(userData : any) : void
  {
    
    this.usersModal.title = "Modificar Usuario";

    for(let key of this.keys)
      this.usersModal.formData[key] = userData[key];
    
    this.usersModal.formDataBackup = Object.assign({}, userData);
    this.usersModal.open();
  }

  public updateUser() : void
  {
    let userData : any = {};

    for(let key of this.keys)
    {
      if(this.usersModal.formData[key] != this.usersModal.formDataBackup[key])
        userData[key] = this.usersModal.formData[key];
    }

    userData.id = this.usersModal.formDataBackup.id;
    
    console.log(userData);
    this.loadingIndicatorService.loadingStates["updateUser"] = true;
    this.usersService.updateUser(userData).subscribe(
    res => 
    {
      this.loadingIndicatorService.loadingStates["updateUser"] = false;
      
      for(let i = 0; i < this.rows.length; i++)
      {
        if(this.rows[i].id == userData.id)
        {
          for(let key of this.keys)
            this.rows[i][key] = this.usersModal.formData[key];
          break;
        }
      }
      
      this.usersModal.close();
    },
    err => 
    {
      this.loadingIndicatorService.loadingStates["updateUser"] = false;
      this.usersModal.errorMessage = err.error.message;
      console.log(err);
    });
  }

  public deleteUser(userData : any) : void
  {
    this.loadingIndicatorService.loadingStates["deleteUser"] = true;
    this.usersService.deleteUser(userData.id).subscribe(
    res => 
    {
      this.loadingIndicatorService.loadingStates["deleteUser"] = false;
      
      for(let i = 0; i < this.rows.length; i++)
      {
        if(this.rows[i].id == userData.id)
        {
          this.rows.splice(i,1);
          break;
        }
      }
      
      this.modals.closeAlert();
    },
    err => 
    {
      this.loadingIndicatorService.loadingStates["deleteUser"] = false;
      alert(err.error.message);
      console.log(err);
    });
  }
}
