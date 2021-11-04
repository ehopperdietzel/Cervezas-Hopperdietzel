import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingIndicatorService {

  public loadingStates : any = {}
  constructor() { }

  public anyLoading() : boolean
  {
    for(let key in this.loadingStates)
      if(this.loadingStates[key])
        return true
    return false;
  }
}
