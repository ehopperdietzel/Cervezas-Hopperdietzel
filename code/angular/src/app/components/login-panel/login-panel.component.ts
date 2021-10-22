import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { UsersService } from 'src/app/services/users.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'login-panel',
  templateUrl: './login-panel.component.html',
  styleUrls: ['./login-panel.component.css']
})
export class LoginPanelComponent implements OnInit {

  emailInput : string  = "";
  passwordInput :string = "";
  requestError : string = "";

  constructor(private usersService : UsersService) 
  {

  }

  @Output() loginAlert = new EventEmitter();
  
  login()
  {
    this.usersService.login(this.emailInput,this.passwordInput).subscribe( 
      res => 
      {
        localStorage.setItem("token",res.access_token);
        this.loginAlert.emit();
      },
      err =>
      {
        this.requestError = err.statusText;
      },
      () => console.log('HTTP request completed.'));
  }

  ngOnInit(): void {
  }

}
