import { Injectable } from '@angular/core';
import { environment, decode } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SessionService 
{
  private token : string = "";
  private userId : number = -1;
  private username : string = "";

  public columnsSettings : any = {};

  public sections : any = 
  [
    {
      name:"Ventas",
      icon:"assets/img/icons/sales.png",
      admin:false,
      user:true
    },
    /*
    {
      name:"Logística",
      icon:"assets/img/icons/ships.png",
      admin:false,
      user:true
    },
    */
    {
      name:"Fabricación",
      icon:"assets/img/icons/stock.png",
      admin:false,
      user:true
    },
    {
      name:"Clientes",
      icon:"assets/img/icons/clients.png",
      admin:false,
      user:true
    },
    {
      name:"Productos",
      icon:"assets/img/icons/products.png",
      admin:false,
      user:true
    },
    {
      name:"Respaldos",
      icon:"assets/img/icons/backups.png",
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
      this.currentSection = section;
    }
  }

  public login(email:string,password:string)
  {
    return this.http.post<any>(environment.apiURL + '/login',{email:email,password:password});
  }

  public getColumnSettings() : Observable<any>
  {
    var options = 
    {
      headers:{Authorization: 'Bearer ' + this.getToken()}
    };
    return this.http.get<any>(environment.apiURL + '/columnsSettings', options);
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
      {
        var options = 
        {
          headers:{Authorization: 'Bearer ' + this.getToken()}
        };

        this.getColumnSettings().subscribe(
        res => 
        {
          this.columnsSettings = res;
          console.log(res);
          this.currentSection = "Ventas";
        },
        err => 
        {
          this.logout();
          console.log(err);
        });
      }
    }
  }

  public updateColumnSetting(formData : any) : Observable<any>
  {
    var options = 
    {
      headers:{Authorization: 'Bearer ' + this.getToken()}
    };
    return this.http.patch<any>(environment.apiURL + '/columnsSettings', formData, options);
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

  public moneyFormat(x : number) : string 
  {
    if(x == undefined)
      return "$0";

    return "$"+x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  public logout() : void
  {
    this.token = "";
    this.userId = -1;
    this.username = "";
    localStorage.removeItem("token");
  }

  public strToDate(str:string) : Date
  {
    var date = str.split('-')

    var year = parseInt(date[0]);
    var month = parseInt(date[1]);
    var day = parseInt(date[2].split(' ')[0]);

    var hour = parseInt(date[2].split(' ')[1].split(':')[0]);
    var min = parseInt(date[2].split(' ')[1].split(':')[1]);

    return new Date(year, month, day, hour, min);
  }

  public phpDateToJavascript(date : string)
  {
    return date.replace(' ', 'T');
  }

}
