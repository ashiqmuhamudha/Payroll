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
  orgList: IOrgData[] =[];  
  searchTerm: string = '';
  filteredOrgList: IOrgData[] = [];
  paginatedData: any[] = [];
  itemsPerPage = 5;
  currentPage = 1;
  totalPages = 1;
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
        this.filteredOrgList = orgResult;
        this.updatePagination();
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

  applyFilter() {
    this.filteredOrgList = this.orgList.filter(orgData =>
      orgData.cd.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      orgData.ds.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredOrgList.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedData = this.filteredOrgList.slice(start, end);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }
}
