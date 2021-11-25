import { Injectable } from '@angular/core';
import { environment, decode } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class SessionService 
{
  private token : string = "";
  private userId : number = -1;
  private username : string = "";

  public sections : any = 
  [
    {
      name:"Productos",
      icon:"assets/img/icons/products.png",
      admin:false,
      user:true
    },
    {
      name:"Usuarios",
      icon:"assets/img/icons/user.png",
      admin:true,
      user:false
    },
    {
      name:"Salir",
      icon:"assets/img/icons/logout.png",
      admin:true,
      user:true
    }
  ];

  public currentSection = ""

  constructor(private http : HttpClient) 
  {
    this.proccessToken(localStorage.getItem("token"));
  }

  public goToSection(section : string)
  {
    if(section == "Salir")
      this.logout();
    else
    {
      this.currentSection == section;
    }
  }

  public login(email:string,password:string)
  {
    return this.http.post<any>(environment.apiURL + '/login',{email:email,password:password});
  }

  public proccessToken(token : any) : void
  {
    if(token !== null)
    {
      this.token = token;
      this.userId = parseInt(JSON.parse(decode(token.split(".")[1]))["userId"]);
      this.username = JSON.parse(decode(token.split(".")[1]))["username"];

      if(this.userId == 0)
        this.currentSection = "Usuarios";
      else
        this.currentSection = "Productos";
    }
  }

  public getUserId() : number
  {
    return this.userId;
  }

  public getUsername() : string
  {
    return this.username;
  }

  public getToken() : string
  {
    return this.token;
  }

  public logout() : void
  {
    this.token = "";
    this.userId = -1;
    this.username = "";
    localStorage.removeItem("token");
  }

}
