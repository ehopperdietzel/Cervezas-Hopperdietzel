import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  constructor(private http : HttpClient,private session : SessionService) { }

  public getClients() : Observable<any>
  {
    var options = 
    {
      headers:{Authorization: 'Bearer ' + this.session.getToken()}
    };
    return this.http.get<any>(environment.apiURL + '/clients', options);
  }

  public createClient(formData : any) : Observable<any>
  {
    var options = 
    {
      headers:{Authorization: 'Bearer ' + this.session.getToken()}
    };
    return this.http.post<any>(environment.apiURL + '/clients', formData, options);
  }

  public updateClient(formData : any) : Observable<any>
  {
    var options = 
    {
      headers:{Authorization: 'Bearer ' + this.session.getToken()}
    };
    return this.http.patch<any>(environment.apiURL + '/clients', formData, options);
  }

  public deleteClient(clientId : number) : Observable<any>
  {
    var options = 
    {
      headers:{Authorization: 'Bearer ' + this.session.getToken()}
    };
    return this.http.delete<any>(environment.apiURL + '/clients/'+clientId.toString(), options);
  }
  
}
