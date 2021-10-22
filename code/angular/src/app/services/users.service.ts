import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http : HttpClient) { }

  getUsers() : Observable<User[]>
  {
    return this.http.get<User[]>("/users")
  }

  login(email:string,password:string)
  {
    return this.http.post<any>(environment.apiURL + '/login',{email:email,password:password});
  }
}
