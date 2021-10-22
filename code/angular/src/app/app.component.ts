import { Component } from '@angular/core';
import { environment, decode } from 'src/environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent 
{
  currentPanel = 'loginPanel';
  
  constructor()
  {
    this.checkSession();
  }

  checkSession()
  {
    var token = localStorage.getItem("token");

    if(token !== null)
    {
      environment.user.token = token;
      environment.user.id = parseInt(JSON.parse(decode(token.split(".")[1]))["usr"]);
      environment.user.name = JSON.parse(decode(token.split(".")[1]))["name"];
      this.currentPanel = 'adminPanel';
    }
    else
    {
      this.currentPanel = 'loginPanel';
    }

  }

}
