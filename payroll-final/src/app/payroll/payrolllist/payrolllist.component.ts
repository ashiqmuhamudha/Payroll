import { Component, OnInit } from '@angular/core';
import { ISalaryData, ISalaryList } from '../../models/orgmodel';
import { OrgserviceService } from '../../services/orgservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orglist',
  templateUrl: './payrolllist.component.html',
  styleUrls: ['./payrolllist.component.scss']
})
export class PayrolllistComponent implements OnInit {
  orgList: ISalaryData[] = [];
  searchTerm: string = '';
  filteredOrgList: ISalaryData[] = [];
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
      .getOrgData(this.currentPage, this.itemsPerPage, this.searchTerm, this.sortColumn, this.sortDirection)
      .subscribe({
        next: (response: ISalaryList) => {
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
    this.router.navigate(['salary-group/create']);
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

  // applyFilter() {
  //   this.filteredOrgList = this.orgList.filter(orgData => {
  //     const matchesStatus = orgData.st == this.filterStatus;
  //     const matchesSearch = orgData.cd.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
  //     orgData.ds.toLowerCase().includes(this.searchTerm.toLowerCase())
  //     return matchesSearch && matchesStatus;
  //   });
  //   this.currentPage = 1;
  //   this.updatePagination();
  // }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredOrgList.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedData = this.filteredOrgList.slice(start, end);
  }

  // previousPage() {
  //   if (this.currentPage > 1) {
  //     this.currentPage--;
  //     this.updatePagination();
  //   }
  // }

  // nextPage() {
  //   if (this.currentPage < this.totalPages) {
  //     this.currentPage++;
  //     this.updatePagination();
  //   }
  // }

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
