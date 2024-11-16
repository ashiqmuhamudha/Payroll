import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrglistComponent } from './org/orglist/orglist.component';
import { OrgformComponent } from './org/orgform/orgform.component';
import { OrgformtestComponent } from './org/orgformtest/orgformtest.component';
import { WageperiodlistComponent } from './wage/wageperiodlist/wageperiodlist.component';
import { WageperiodformComponent } from './wage/wageperiodform/wageperiodform.component';


const routes: Routes = [

  { path: 'payroll/create', component: OrgformComponent },
  { path: 'payroll/edit/:id', component: OrgformComponent },
  { path: 'payroll-list', component: OrglistComponent },
  { path: 'wage-period-list', component: WageperiodlistComponent },
  { path: 'wage-period-form', component: WageperiodformComponent },
  { path: 'wage-period/create', component: WageperiodformComponent },
  { path: 'wage-period/edit/:id', component: WageperiodformComponent },
  { path: '', redirectTo: '/payroll-list', pathMatch: 'full' },
  { path: 'test', component: OrgformtestComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
