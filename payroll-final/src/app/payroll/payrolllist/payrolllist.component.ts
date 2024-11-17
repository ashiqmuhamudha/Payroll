import { Component, OnInit } from '@angular/core';
import { IOrgData } from '../../models/orgmodel';
import { OrgserviceService } from '../../services/orgservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orglist',
  templateUrl: './payrolllist.component.html',
  styleUrls: ['./payrolllist.component.scss']
})
export class PayrolllistComponent implements OnInit {
  orgList: IOrgData[] =[];  
  searchTerm: string = '';
  filteredOrgList: IOrgData[] = [];
  paginatedData: any[] = [];
  itemsPerPage = 20;
  currentPage = 1;
  totalPages = 1;
  filterStatus: string = 'A';
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
        this.applyFilter();
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
    this.filteredOrgList = this.orgList.filter(orgData => {
      const matchesStatus = orgData.st == this.filterStatus;
      const matchesSearch = orgData.cd.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      orgData.ds.toLowerCase().includes(this.searchTerm.toLowerCase())
      return matchesSearch && matchesStatus;
    });
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
