import { Component, OnInit } from '@angular/core';
import { IOrgDetail, ISalaryData, ISalaryList, OrgDetail } from '../../models/orgmodel';
import { OrgserviceService } from '../../services/orgservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orgattdetaillist',
  templateUrl: './orgattdetaillist.component.html',
  styleUrls: ['./orgattdetaillist.component.scss']
})
export class OrgattdetaillistComponent {
orgList: OrgDetail[] = [];
searchTerm: string = '';
filteredOrgList: OrgDetail[] = [];
paginatedData: any[] = [];
itemsPerPage = 20;
currentPage = 1;
totalPages = 1;
filterStatus: string = 'A';
sortColumn = 'CODE';
sortDirection = 'ASC';
totalItems = 0;
hasNextPage = false;
hasPreviousPage = false;
errorMessage = "Loading. Please wait...";

constructor(private _orgService: OrgserviceService, private router: Router) { }

ngOnInit() {
  this.loadPayroll();
}

loadPayroll() {
  this._orgService
    .getOrgDetails(this.currentPage, this.itemsPerPage, this.searchTerm, this.sortColumn, this.sortDirection)
    .subscribe({
      next: (response: IOrgDetail) => {
        this.orgList = response.items;
        this.totalItems = response.totalItems;
        this.currentPage = response.pageNumber;
        this.itemsPerPage = response.pageSize;
        this.totalPages = response.totalPages;
        this.hasNextPage = response.hasNextPage;
        this.hasPreviousPage = response.hasPreviousPage;
        this.applyFilter();
      },
      error: (err) => {
        this.errorMessage = err;
        console.error(err);
      }
    });
}

openCreateTaskModal() {
  this.router.navigate(['org-attributes-details/create']);
}

deletePayroll(id: number) {
  this._orgService.deleteOrgDetailAttributeById(id).subscribe({
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
  this.filteredOrgList = this.orgList.filter(orgData => orgData.st === this.filterStatus);
}

search() {
  // this.searchTerm = this.searchTerm.trim();
  this.loadPayroll();
}

sort(column: string) {
  if (this.sortColumn === column) {
    this.sortDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
  } else {
    this.sortColumn = column;
    this.sortDirection = 'ASC';
  }
  this.loadPayroll();
}

previousPage() {
  if (this.hasPreviousPage) {
    this.currentPage--;
    this.loadPayroll();
  }
}

nextPage() {
  if (this.hasNextPage) {
    this.currentPage++;
    this.loadPayroll();
  }
}
}