import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayrolllistComponent } from './payroll/payrolllist/payrolllist.component';
import { PayrollformComponent } from './payroll/payrollform/payrollform.component';
import { WageperiodlistComponent } from './wage/wageperiodlist/wageperiodlist.component';
import { WageperiodformComponent } from './wage/wageperiodform/wageperiodform.component';
import { LoginComponent } from './login/login.component';
import { MainlayoutComponent } from './mainlayout/mainlayout.component';
import { AuthGuard } from './guard/auth.guard';


const routes: Routes = [

  { path: 'login', component: LoginComponent},
  {
    path: '', // Main layout for authenticated routes
    component: MainlayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'salary-group/create', component: PayrollformComponent },
      { path: 'salary-group/edit/:id', component: PayrollformComponent },
      { path: 'salary-group', component: PayrolllistComponent },
      { path: 'wage-period', component: WageperiodlistComponent },
      { path: 'wage-period-form', component: WageperiodformComponent },
      { path: 'wage-period/create', component: WageperiodformComponent },
      { path: 'wage-period/edit/:id', component: WageperiodformComponent },
      { path: '', redirectTo: '/salary-group', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
