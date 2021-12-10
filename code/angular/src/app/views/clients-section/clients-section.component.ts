import { Component, OnInit } from '@angular/core';
import { ClientsService } from 'src/app/services/clients.service';
import { LoadingIndicatorService } from 'src/app/services/loading-indicator.service';

@Component({
  selector: 'clients-section',
  templateUrl: './clients-section.component.html',
  styleUrls: ['./clients-section.component.css']
})
export class ClientsSectionComponent implements OnInit {

  constructor(public clientsService : ClientsService,public loadingIndicatorService : LoadingIndicatorService) { }

  ngOnInit(): void 
  {
    this.getAllClients();
  }

  // View mode
  public view : string = "table";

  // Adding indicator
  public adding : boolean = false;

  public currentItemData : any = {};
  public currentItemDataUnmodified : any = {};

  public columns : Array<any> = [
    {
      title:'Nombre',
      key:'clientName',
      type:'text'
    },
    {
      title:'RUT',
      key:'rut',
      type:'text'
    },
    {
      title:'Teléfono',
      key:'defaultPhoneValue',
      type:'text'
    },
    {
      title:'Email',
      key:'defaultEmailValue',
      type:'text'
    },
    {
      title:'Ciudad',
      key:'cityName',
      type:'text'
    },
    {
      title:'Dirección',
      key:'address',
      type:'text'
    },
    {
      title:'Última Modificación',
      key:'lastModificationTime',
      type:'text'
    },
    {
      title:'Modificado por',
      key:'modifiedBy',
      type:'text'
    }];

  public rows : Array<any> = [];
  public rowRightClick(event : any) : void {}

  public rowLeftClick(event : any) : void 
  {
    this.adding = false;
    this.currentItemData = Object.assign({}, event.row);
    this.view = 'editor';
  }

  public goBack() : void 
  {
    this.view = 'table';
    this.adding = false;
  }

  // Get clients list
  public getAllClients() : void 
  {
    this.loadingIndicatorService.loadingStates["getAllClients"] = true;

    this.clientsService.getClients().subscribe(
      res => 
      {
        this.loadingIndicatorService.loadingStates["getAllClients"] = false;

        
        for(var i = 0; i < res.length; i++)
        {
          res[i].modifiedBy = res[i].userFirstname + " " + res[i].userLastname;
          res[i].clientName = res[i].firstname + " " + res[i].lastname;

          let arrays = [['phones','defaultPhoneValue','phone','defaultPhone'],['emails','defaultEmailValue','email','defaultEmail']];

          for(let key of arrays)
          {
            for(var j = 0; j < res[i][key[0]].length; j++)
            {
              res[i][key[0]][j].default = res[i][key[0]][j].id == res[i][key[3]];

              if(res[i][key[0]][j].default)
              {
                res[i][key[1]] = res[i][key[0]][j][key[2]];
              }
            }
          }
          
        }
      
        this.rows = res;
        console.log(res);
      },
      err => 
      {
        this.loadingIndicatorService.loadingStates["getAllClients"] = false;
        console.log(err);
      });
  }

  // Show create item view
  public addItem() : void 
  {
    this.currentItemData = 
    {
      firstname:"",
      lastname:"",
      company:"",
      rut:"",
      cityName:"",
      address:"",
      comment:"",
      phones:[
        {default:true,phone:""}
      ],
      emails:[
        {default:true,email:""}
      ]
    }
    this.adding = true;
    this.view = 'editor';
  }

  // POST Item
  public uploadNewItem() : void 
  {
    this.loadingIndicatorService.loadingStates["createClient"] = true;

    var data = Object.assign({}, this.currentItemData);
    data.phones = JSON.stringify(data.phones);
    data.emails = JSON.stringify(data.emails);

    this.clientsService.createClient(data).subscribe(
      res => 
      {
        this.loadingIndicatorService.loadingStates["createClient"] = false;
        this.getAllClients();
        this.view = 'table';
        this.adding = false;
        console.log(res);
      },
      err => 
      {
        this.loadingIndicatorService.loadingStates["createClient"] = false;
        console.log(err);
      });
  }

  // Update item
  public updateItem()
  {
    this.loadingIndicatorService.loadingStates["updateClient"] = true;

    var data = Object.assign({}, this.currentItemData);
    data.phones = JSON.stringify(data.phones);
    data.emails = JSON.stringify(data.emails);

    this.clientsService.updateClient(data).subscribe(
      res => 
      {
        this.loadingIndicatorService.loadingStates["updateClient"] = false;
        this.getAllClients();
        this.view = 'table';
        console.log(res);
      },
      err => 
      {
        this.loadingIndicatorService.loadingStates["updateClient"] = false;
        //this.usersModal.errorMessage = err.error.message;
        console.log(err);
      });
  }

  // DELETE Item
  public deleteItem()
  {
    this.loadingIndicatorService.loadingStates["deleteClient"] = true;

    this.clientsService.deleteClient(this.currentItemData.id).subscribe(
      res => 
      {
        this.loadingIndicatorService.loadingStates["deleteClient"] = false;
        this.getAllClients();
        this.view = 'table';
        console.log(res);
      },
      err => 
      {
        this.loadingIndicatorService.loadingStates["deleteClient"] = false;
        //this.usersModal.errorMessage = err.error.message;
        console.log(err);
      });
  }

  // Add phone
  public addPhone() : void 
  {
    this.currentItemData.phones.push({default:false,phone:""});
  }

  // Default phone
  public setDefaultPhone(index : number) : void 
  {
    for(var i = 0; i < this.currentItemData.phones.length; i++)
      this.currentItemData.phones[i].default = (i == index);
  }

  // Delete phone
  public deletePhone(index : number) : void 
  {
    let isDefault = this.currentItemData.phones[index].default;
    this.currentItemData.phones.splice(index,1);
    if(isDefault)
      this.currentItemData.phones[0].default = true;
  }

  // Add email
  public addEmail() : void 
  {
    this.currentItemData.emails.push({default:false,email:""});
  }

  // Default email
  public setDefaultEmail(index : number) : void 
  {
    for(var i = 0; i < this.currentItemData.emails.length; i++)
      this.currentItemData.emails[i].default = (i == index);
  }

  // Delete email
  public deleteEmail(index : number) : void 
  {
    let isDefault = this.currentItemData.emails[index].default;
    this.currentItemData.emails.splice(index,1);
    if(isDefault)
      this.currentItemData.emails[0].default = true;
  }
}
