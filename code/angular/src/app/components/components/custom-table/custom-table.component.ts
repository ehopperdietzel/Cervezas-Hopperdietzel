import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'custom-table',
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.css']
})
export class CustomTableComponent implements OnInit {

  @Input() public rows : Array<any> = [];
  @Input() public columns : Array<any> = [];
  @Output() public rowRightClick: EventEmitter<any> = new EventEmitter();
  

  constructor() { }

  ngOnInit(): void {
  }

  public onRightClick(event : any, row : any) : void
  {
    event["row"] = row;
    this.rowRightClick.emit(event);
  }
}
