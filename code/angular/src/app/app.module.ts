import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'

import { AppComponent } from './app.component';
import { SectionsMenuComponent } from './components/components/sections-menu/sections-menu.component';
import { LoginPanelComponent } from './views/login-panel/login-panel.component';
import { AdminPanelComponent } from './views/admin-panel/admin-panel.component';
import { UsersSectionComponent } from './views/users-section/users-section.component';
import { CustomTableComponent } from './components/components/custom-table/custom-table.component';
import { UserModalComponent } from './components/modals/user-modal/user-modal.component';
import { ContextMenuComponent } from './components/components/context-menu/context-menu.component';


import { ModalService } from './services/modal.service';
import { UsersService } from './services/users.service';
import { SessionService } from './services/session.service';
import { ContextMenuService } from './services/context-menu.service';
import { LoadingIndicatorService } from './services/loading-indicator.service';
import { AlertModalComponent } from './components/modals/alert-modal/alert-modal.component';
import { ProductsSectionComponent } from './views/products-section/products-section.component';
import { ClientsSectionComponent } from './views/clients-section/clients-section.component';
import { StockSectionComponent } from './views/stock-section/stock-section.component';
import { SalesSectionComponent } from './views/sales-section/sales-section.component';
import { ShipmentSectionComponent } from './views/shipment-section/shipment-section.component';
import { SuggestionsInputComponent } from './components/components/suggestions-input/suggestions-input.component';


@NgModule(
  {
  declarations:[
    AppComponent,
    LoginPanelComponent,
    AdminPanelComponent,
    SectionsMenuComponent,
    UsersSectionComponent,
    CustomTableComponent,
    UserModalComponent,
    ContextMenuComponent,
    AlertModalComponent,
    ProductsSectionComponent,
    ClientsSectionComponent,
    StockSectionComponent,
    SalesSectionComponent,
    ShipmentSectionComponent,
    SuggestionsInputComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    SessionService,
    UsersService,
    ModalService,
    ContextMenuService ,
    LoadingIndicatorService
  ],
  bootstrap: [AppComponent]
})

export class AppModule 
{ 

}
