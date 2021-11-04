import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SessionService } from 'src/app/services/session.service';
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


  public session : SessionService;

  constructor(public sessionService : SessionService) 
  { 
    this.session = sessionService;
  }

  @Output() logoutAlert = new EventEmitter();

  selectSection(section : string)
  {
    if(section == "Salir")
    {
      this.session.logout();
    }
    else
      this.currentSection = section;
  }

  

  ngOnInit(): void 
  {

  }

}
