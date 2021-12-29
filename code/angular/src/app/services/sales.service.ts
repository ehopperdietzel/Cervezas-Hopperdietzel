import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionService } from './session.service';


@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(private http : HttpClient,private session : SessionService) { }

  public getSales() : Observable<any>
  {
    var options = 
    {
      headers:{Authorization: 'Bearer ' + this.session.getToken()}
    };
    return this.http.get<any>(environment.apiURL + '/sales', options);
  }

  public createSale(formData : any) : Observable<any>
  {
    var options = 
    {
      headers:{Authorization: 'Bearer ' + this.session.getToken()}
    };
    return this.http.post<any>(environment.apiURL + '/sales', formData, options);
  }

  public updateSale(formData : string) : Observable<any>
  {
    var options = 
    {
      headers:{Authorization: 'Bearer ' + this.session.getToken()}
    };
    return this.http.patch<any>(environment.apiURL + '/sales', {changes:formData}, options);
  }

  public deleteSale(saleId : number) : Observable<any>
  {
    var options = 
    {
      headers:{Authorization: 'Bearer ' + this.session.getToken()}
    };
    return this.http.delete<any>(environment.apiURL + '/sales/'+saleId.toString(), options);
  }
}
