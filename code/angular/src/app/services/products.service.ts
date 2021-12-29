import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http : HttpClient,private session : SessionService) { }

  public createProduct(formData : any) : Observable<any>
  {
    var options = 
    {
      headers:{Authorization: 'Bearer ' + this.session.getToken()}
    };
    return this.http.post<any>(environment.apiURL + '/products', formData, options);
  }

  public updateProduct(formData : any) : Observable<any>
  {
    var options = 
    {
      headers:{Authorization: 'Bearer ' + this.session.getToken()}
    };
    return this.http.post<any>(environment.apiURL + '/updateProduct', formData, options);
  }

  public getProducts() : Observable<any>
  {
    var options = 
    {
      headers:{Authorization: 'Bearer ' + this.session.getToken()}
    };
    return this.http.get<any>(environment.apiURL + '/products', options);
  }

  public deleteProduct(productId : number) : Observable<any>
  {
    var options = 
    {
      headers:{Authorization: 'Bearer ' + this.session.getToken()}
    };
    return this.http.delete<any>(environment.apiURL + '/products/'+productId.toString(), options);
  }

}
