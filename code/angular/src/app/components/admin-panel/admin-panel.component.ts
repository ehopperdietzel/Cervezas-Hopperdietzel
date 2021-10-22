import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SectionsMenuComponent } from './sections-menu/sections-menu.component';

@Component({
  selector: 'admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  sections = 
  [
    {
      name:"Usuarios",
      icon:"assets/img/icons/user.png"
    },
    {
      name:"Salir",
      icon:"assets/img/icons/logout.png"
    }
  ];

  currentSection : string = "Usuarios";

  constructor() { }

  @Output() logoutAlert = new EventEmitter();

  selectSection(section : string)
  {
    if(section == "Salir")
    {
      localStorage.removeItem("token");
      this.logoutAlert.emit();
    }
    else
      this.currentSection = section;
  }

  

  ngOnInit(): void 
  {

  }

}
