import { Component } from '@angular/core';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'login-panel',
  templateUrl: './login-panel.component.html',
  styleUrls: ['./login-panel.component.css']
})
export class LoginPanelComponent {

  public emailInput : string  = "";
  public passwordInput :string = "";
  public requestError : string = "";
  public session : SessionService;

  constructor(private sessionService : SessionService)
  {
    this.session = sessionService
  }
  
  login()
  {
    this.session.login(this.emailInput,this.passwordInput).subscribe( 
      res => {
        localStorage.setItem("token",res.access_token);
        this.session.proccessToken(res.access_token)
      },
      err => {
        this.requestError = err.statusText;
        console.log(err);
      },
      () => console.log('HTTP request completed.'));
  }

}
