import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OrglistComponent } from './org/orglist/orglist.component';
import { HttpClientModule } from '@angular/common/http';
import { OrgformComponent } from './org/orgform/orgform.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrgformtestComponent } from './org/orgformtest/orgformtest.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModalComponent } from './selection-modal/selection-modal.component';


@NgModule({
  declarations: [
    AppComponent,
    OrglistComponent,
    OrgformComponent,
    OrgformtestComponent,
    SelectionModalComponent,    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, FormsModule, ReactiveFormsModule, NgbModule, FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
