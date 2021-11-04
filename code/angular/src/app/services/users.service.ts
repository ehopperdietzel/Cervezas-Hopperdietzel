import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http : HttpClient,private session : SessionService ) { }

  public getUsers(query : string) : Observable<any>
  {

    let options = 
    {
      headers:{Authorization: 'Bearer ' + this.session.getToken()},
      params:Object()
    };

    if(query.length != 0)
        options.params.query = query;
        
    return this.http.get<any>(environment.apiURL+"/users",options);
  }

  public createUser(userData : any) : Observable<any>
  {
    var options = 
    {
      headers:{Authorization: 'Bearer ' + this.session.getToken()}
    };
    return this.http.post<any>(environment.apiURL + '/users', userData, options);
  }

  public updateUser(userData : any) : Observable<any>
  {
    var options = 
    {
      headers:{Authorization: 'Bearer ' + this.session.getToken()}
    };
    return this.http.patch<any>(environment.apiURL + '/users', userData, options);
  }

  public deleteUser(userId : number) : Observable<any>
  {
    var options = 
    {
      headers:{Authorization: 'Bearer ' + this.session.getToken()}
    };
    return this.http.delete<any>(environment.apiURL + '/users/'+userId.toString(), options);
  }
}
