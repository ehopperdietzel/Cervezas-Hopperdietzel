import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContextMenuService {

  public items : Array<any> = [];
  public displayIcons : boolean = false;
  public pos : Array<number> = [0,0];
  public requester : any;

  constructor() { }

  public show(_requester : any,_items : any,_pos : Array<number>,_displayIcons : boolean)
  {
    this.requester = _requester;
    this.pos[0] = _pos[0]+10;
    this.pos[1] = _pos[1]+10;
    this.displayIcons = _displayIcons;
    this.items = _items;
  }
}
