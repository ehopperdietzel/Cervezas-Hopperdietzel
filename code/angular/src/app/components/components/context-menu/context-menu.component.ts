import { Component, HostListener,ElementRef, OnInit } from '@angular/core';
import { ContextMenuService } from 'src/app/services/context-menu.service';

@Component({
  selector: 'context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.css']
})
export class ContextMenuComponent implements OnInit {

  constructor(public contextMenuService : ContextMenuService,private eRef: ElementRef) 
  { 

  }

  @HostListener('document:click', ['$event'])
  clickout(event : any) 
  {
      this.contextMenuService.items = [];
  }
  ngOnInit(): void {
  }

}
