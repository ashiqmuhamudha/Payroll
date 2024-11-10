import { NgModule, APP_INITIALIZER } from '@angular/core';
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
import { ConfigService } from './config.service';
import { OrgserviceService } from './org/orgservice.service';
import { lastValueFrom } from 'rxjs';

export function initializeApp(configService: ConfigService) {
  return () => configService.loadConfig();
}

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
  providers: [
    ConfigService,
    OrgserviceService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
