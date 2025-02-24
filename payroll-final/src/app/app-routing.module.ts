import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayrolllistComponent } from './payroll/payrolllist/payrolllist.component';
import { PayrollformComponent } from './payroll/payrollform/payrollform.component';
import { WageperiodlistComponent } from './wage/wageperiodlist/wageperiodlist.component';
import { WageperiodformComponent } from './wage/wageperiodform/wageperiodform.component';
import { LoginComponent } from './login/login.component';
import { MainlayoutComponent } from './mainlayout/mainlayout.component';
import { AuthGuard } from './guard/auth.guard';
import { OrgattdetailComponent } from './payroll/orgattdetail/orgattdetail.component';
import { OrgattdetaillistComponent } from './payroll/orgattdetaillist/orgattdetaillist.component';
import { BaselistComponent } from './base-component/baselist/baselist.component';
import { BaseformComponent } from './base-component/baseform/baseform.component';
import { AddpaysalarylistComponent } from './add-pay/addpaysalarylist/addpaysalarylist.component';
import { AddpaysalaryformComponent } from './add-pay/addpaysalaryform/addpaysalaryform.component';
import { TaxinfolistComponent } from './tax-info/taxinfolist/taxinfolist.component';
import { TaxinfoformComponent } from './tax-info/taxinfoform/taxinfoform.component';
import { FormulalistComponent } from './formula-component/formulalist/formulalist.component';
import { FormulaformComponent } from './formula-component/formulaform/formulaform.component';

const routes: Routes = [

  { path: 'login', component: LoginComponent},
  {
    path: '', // Main layout for authenticated routes
    component: MainlayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'formulalist', component: FormulalistComponent },
      { path: 'formulalist/create', component: FormulaformComponent },
      { path: 'formulalist/edit/:id', component: FormulaformComponent },
      { path: 'tax-information-list', component: TaxinfolistComponent },
      { path: 'tax-information-form', component: TaxinfoformComponent },
      { path: 'tax-information-list/create', component: TaxinfoformComponent },
      { path: 'tax-information-list/edit/:id', component: TaxinfoformComponent },
      { path: 'additional-pay-salary-list', component: AddpaysalarylistComponent },
      { path: 'additional-pay-salary-list/create', component: AddpaysalaryformComponent },
      { path: 'additional-pay-salary-list/edit/:id', component: AddpaysalaryformComponent },
      { path: 'baselist', component: BaselistComponent },
      { path: 'baselist/create', component: BaseformComponent },
      { path: 'baselist/edit/:id', component: BaseformComponent },
      { path: 'org-attributes-details/create', component: OrgattdetailComponent },
      { path: 'org-attributes-details', component: OrgattdetaillistComponent },
      { path: 'org-attributes-details/edit/:id', component: OrgattdetailComponent },
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
