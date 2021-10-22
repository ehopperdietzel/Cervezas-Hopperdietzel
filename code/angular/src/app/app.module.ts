import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'


import { AppComponent } from './app.component';
import { SectionsMenuComponent } from './components/admin-panel/sections-menu/sections-menu.component';
import { LoginPanelComponent } from './components/login-panel/login-panel.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';


@NgModule(
  {
  declarations: 
  [
    AppComponent,
    LoginPanelComponent,
    AdminPanelComponent,
    SectionsMenuComponent,
  ],
  imports: 
  [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule 
{ 

}
