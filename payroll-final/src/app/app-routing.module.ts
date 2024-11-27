import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayrolllistComponent } from './payroll/payrolllist/payrolllist.component';
import { PayrollformComponent } from './payroll/payrollform/payrollform.component';
import { OrgformtestComponent } from './payroll/orgformtest/orgformtest.component';
import { WageperiodlistComponent } from './wage/wageperiodlist/wageperiodlist.component';
import { WageperiodformComponent } from './wage/wageperiodform/wageperiodform.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [

  { path: 'payroll/create', component: PayrollformComponent },
  { path: 'payroll/edit/:id', component: PayrollformComponent },
  { path: 'payroll-list', component: PayrolllistComponent },
  { path: 'wage-period-list', component: WageperiodlistComponent },
  { path: 'wage-period-form', component: WageperiodformComponent },
  { path: 'wage-period/create', component: WageperiodformComponent },
  { path: 'wage-period/edit/:id', component: WageperiodformComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/payroll-list', pathMatch: 'full' },
  { path: 'test', component: OrgformtestComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
