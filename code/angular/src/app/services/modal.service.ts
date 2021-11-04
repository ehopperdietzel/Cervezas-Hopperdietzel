import { Injectable } from '@angular/core';
import { Modal } from '../classes/modal';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  public modals : Array<Modal> = [];

  public alertData : any = {
    requester:null,
    visible:false,
    data:{},
    title:'',
    body:'',
    buttons:[]
  }

  constructor(){}

  public registerModal(modal:Modal)
  {
    this.modals.push(modal);
  }

  public getModal(name : string) : any
  {
    for(var i = 0; i < this.modals.length; i++)
    {
      if(this.modals[i].name == name)
      {
        return this.modals[i];
      }
    }
    return undefined;
  }

  public open(name : string) : void
  {
    close();
    for(var i = 0; i < this.modals.length; i++)
    {
      if(this.modals[i].name == name)
      {
        this.modals[i].active = true;
        return;
      }
    }
  }

  public close() : void
  {
    for(var i = 0; i < this.modals.length; i++)
    {
        this.modals[i].active = false;
    }
  }

  public showAlert(requester : any, title : string, body : string, buttons : any) : void
  {
    this.alertData.requester = requester;
    this.alertData.title = title;
    this.alertData.body = body;
    this.alertData.buttons = buttons;
    this.alertData.visible = true;
  }

  public closeAlert() : void
  {
    this.alertData.visible = false;
  }


}

