import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PayrolllistComponent } from './payroll/payrolllist/payrolllist.component';
import { HttpClientModule } from '@angular/common/http';
import { PayrollformComponent } from './payroll/payrollform/payrollform.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrgformtestComponent } from './payroll/orgformtest/orgformtest.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModalComponent } from './selection-modal/selection-modal.component';
import { ConfigService } from './services/config.service';
import { OrgserviceService } from './services/orgservice.service';
import { lastValueFrom } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WageperiodformComponent } from './wage/wageperiodform/wageperiodform.component';
import { WageperiodlistComponent } from './wage/wageperiodlist/wageperiodlist.component';
import { SidebarComponent } from './menu/sidebar/sidebar.component';
import { ReplacePipe } from './Pipe/replace.pipe';
import { LoginComponent } from './login/login.component';
import { MainlayoutComponent } from './mainlayout/mainlayout.component';



export function initializeApp(configService: ConfigService) {
  return () => configService.loadConfig();
}

@NgModule({
  declarations: [
    AppComponent,
    PayrolllistComponent,
    PayrollformComponent,
    OrgformtestComponent,
    SelectionModalComponent,
    WageperiodformComponent,
    WageperiodlistComponent,
    SidebarComponent,
    ReplacePipe,
    LoginComponent,
    MainlayoutComponent,    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, FormsModule, ReactiveFormsModule, NgbModule, FormsModule, BrowserAnimationsModule
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
