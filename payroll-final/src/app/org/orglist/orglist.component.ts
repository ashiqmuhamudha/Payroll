import { Component, OnInit } from '@angular/core';
import { IOrgData } from '../orgmodel';
import { OrgserviceService } from '../orgservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orglist',
  templateUrl: './orglist.component.html',
  styleUrls: ['./orglist.component.scss']
})
export class OrglistComponent implements OnInit {


  orgList: IOrgData[] | undefined;
  errorMessage = "Loading. Please wait...";

  constructor(private _orgService: OrgserviceService, private router: Router) { }

  ngOnInit() {
    this.loadPayroll();
  }

  loadPayroll(){
    this._orgService.getOrgData()
    .subscribe({
      next: orgResult => {
        this.orgList = orgResult;
      },
      error: err => { this.errorMessage = err; console.log(err); }
    })
  }

  openCreateTaskModal() {
    this.router.navigate(['payroll/create']);
  }

  deletePayroll(id: number) {
    this._orgService.deleteOrgData(id).subscribe({
      next: result => {
        console.log(`Payroll with ID ${id} deleted successfully.`);  
        this.loadPayroll();      
      },
      error: err => {
        { this.errorMessage = err; console.log(err); }
      }
    }
    );
  }
}
