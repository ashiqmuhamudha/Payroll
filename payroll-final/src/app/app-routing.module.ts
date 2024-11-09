import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrglistComponent } from './org/orglist/orglist.component';
import { OrgformComponent } from './org/orgform/orgform.component';
import { OrgformtestComponent } from './org/orgformtest/orgformtest.component';


const routes: Routes = [  
  
  { path: 'payroll/create', component: OrgformComponent },
  { path: 'payroll/edit/:id', component: OrgformComponent },
  {path: 'payroll-list', component: OrglistComponent},
  {path:'', redirectTo:'/payroll-list', pathMatch:'full'},
  {path: 'test', component: OrgformtestComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
