import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ContextMenuService } from 'src/app/services/context-menu.service';
import { LoadingIndicatorService } from 'src/app/services/loading-indicator.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.css']
})
export class CustomTableComponent implements OnInit {

  @Input() public rows : Array<any> = [];
  @Input() public columns : Array<any> = [];
  @Output() public rowRightClick: EventEmitter<any> = new EventEmitter();
  @Output() public rowLeftClick: EventEmitter<any> = new EventEmitter();
  @Output() public columnWidthChanged: EventEmitter<any> = new EventEmitter();

  constructor(public loadingIndicatorService : LoadingIndicatorService, public sessionService : SessionService, public contextMenuService : ContextMenuService) { }

  ngOnInit(): void 
  {
   
  }

  public columnInitSize : number = 0;
  public initPointerX : number = 0;

  public changeColumnVisibility(i:number) : void
  {
    this.columns[i].visible = !this.columns[i].visible;

    this.loadingIndicatorService.loadingStates["updateColumnWidth"] = true;

    var data = 
    {
      id:this.columns[i].id,
      changes: JSON.stringify({visible:this.columns[i].visible})
    };

    this.sessionService.updateColumnSetting(data).subscribe(
    res => 
    {
      this.loadingIndicatorService.loadingStates["updateColumnWidth"] = false;
      console.log(res);
    },
    err => 
    {
      this.loadingIndicatorService.loadingStates["updateColumnWidth"] = false;
      console.log(err);
    });
  }

  public changeColumnPosition(data:any) : void
  {

    var id = this.columns[data.index].id;

    var affectedColumn = Object.assign({},this.columns[data.affectedIndex]);
    var affectedOrder = affectedColumn.order;
    affectedColumn.order = this.columns[data.index].order;
    this.columns[data.affectedIndex] = Object.assign({},this.columns[data.index]);
    this.columns[data.affectedIndex].order = affectedOrder;
    this.columns[data.index] = affectedColumn;

    this.loadingIndicatorService.loadingStates["updateColumnOrder"] = true;

    var datas = 
    {
      id:id,
      changes: JSON.stringify({order:affectedOrder})
    };

    this.sessionService.updateColumnSetting(datas).subscribe(
    res => 
    {
      this.loadingIndicatorService.loadingStates["updateColumnOrder"] = false;
      console.log(res);
    },
    err => 
    {
      this.loadingIndicatorService.loadingStates["updateColumnOrder"] = false;
      console.log(err);
    });
  }

  public columnRightClick(event : any,index : number) : void
  {
    if(!this.columns[0].id)
      return;

    event.preventDefault();

    var items = [];

    // Move left
    for(var i = index - 1; i >= 0; i--)
    {
      if(this.columns[i].visible)
      {
        items.push({name:'Mover a la izquierda',data:{index:index,affectedIndex:i},clickFunc:'changeColumnPosition',icon:'/assets/img/icons/back.png'});
        break;
      }
    }

    // Move Right
    for(var i = index + 1; i < this.columns.length; i++)
    {
      if(this.columns[i].visible)
      {
        items.push({name:'Mover a la derecha',data:{index:index,affectedIndex:i},clickFunc:'changeColumnPosition',icon:'/assets/img/icons/right.png'});
        break;
      }
    }

    
    for(var i = 0; i < this.columns.length; i++)
    {
      var newItem = {name:this.columns[i].title,data:i,clickFunc:'changeColumnVisibility',icon:'/assets/img/icons/empy.png'};

      if(this.columns[i].visible)
        newItem.icon = "/assets/img/icons/tick.png";

      items.push(newItem);
    }

    this.contextMenuService.show(this,items,[event.clientX,event.clientY],true);
  }

  public columnDragStart(event : any, index : number) : void
  {
    this.columnInitSize = this.columns[index].width;
    this.initPointerX = event.screenX;
  }
  public columnDrag(event : any, index : number) : void
  {
    var newWidth = this.columnInitSize - this.initPointerX + event.screenX;

    if(newWidth < 30)
      newWidth = 30;

    this.columns[index].width = newWidth;
  }
  public columnDragEnd(event : any, index : number) : void
  {
    if(!this.columns[index].id)
      return;

    this.loadingIndicatorService.loadingStates["updateColumnWidth"] = true;

    var data = 
    {
      id:this.columns[index].id,
      changes: JSON.stringify({width:this.columns[index].width})
    };

    this.sessionService.updateColumnSetting(data).subscribe(
    res => 
    {
      this.loadingIndicatorService.loadingStates["updateColumnWidth"] = false;
      console.log(res);
    },
    err => 
    {
      this.loadingIndicatorService.loadingStates["updateColumnWidth"] = false;
      console.log(err);
    });
  }

  

  public moneyFormat(x : number) : string 
  {
    if(x == undefined)
      return "$0";

    return "$"+x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  public onRightClick(event : any, row : any) : void
  {
    event["row"] = row;
    this.rowRightClick.emit(event);
  }

  public onLeftClick(event : any, row : any) : void
  {
    event["row"] = row;
    this.rowLeftClick.emit(event);
  }

}
