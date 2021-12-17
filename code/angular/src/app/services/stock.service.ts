import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(private http : HttpClient,private session : SessionService) { }

  public createBatch(formData : any) : Observable<any>
  {
    var options = 
    {
      headers:{Authorization: 'Bearer ' + this.session.getToken()}
    };
    return this.http.post<any>(environment.apiURL + '/batches', formData, options);
  }

  public updateBatch(userData : any) : Observable<any>
  {
    var options = 
    {
      headers:{Authorization: 'Bearer ' + this.session.getToken()}
    };
    return this.http.patch<any>(environment.apiURL + '/batches', userData, options);
  }

  public getBatches() : Observable<any>
  {
    var options = 
    {
      headers:{Authorization: 'Bearer ' + this.session.getToken()}
    };
    return this.http.get<any>(environment.apiURL + '/batches', options);
  }

  public deleteBatch(batchId : number) : Observable<any>
  {
    var options = 
    {
      headers:{Authorization: 'Bearer ' + this.session.getToken()}
    };
    return this.http.delete<any>(environment.apiURL + '/batches/'+batchId.toString(), options);
  }
}
