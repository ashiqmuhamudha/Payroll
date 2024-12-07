import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IWagePeriod, IWagePeriodList } from 'src/app/models/wageperiodmodel';
import { WagePeriodService } from 'src/app/services/wageperiod.service';

@Component({
  selector: 'app-wageperiodlist',
  templateUrl: './wageperiodlist.component.html',
  styleUrls: ['./wageperiodlist.component.scss']
})
export class WageperiodlistComponent implements OnInit {
  wagePeriodList: IWagePeriod[] =[];  
  searchTerm: string = '';
  filteredWagePeriodList: IWagePeriod[] = [];
  paginatedData: any[] = [];
  itemsPerPage = 20;
  currentPage = 1;
  totalPages = 1;
  filterStatus: string = 'A';
  errorMessage = "Loading. Please wait...";
  processTypeMap: { [key: string]: string } = {
    M: 'Monthly',
    F: 'Fortnight',
    W: 'Weekly',
    S: 'Semi'
  };
  sortColumn = 'CODE';
  sortDirection = 'ASC';
  totalItems = 0;
  hasNextPage = false;
  hasPreviousPage = false;

  constructor(private _wagePeriodService: WagePeriodService, private router: Router) { }

  ngOnInit() {
    this.loadPayroll();    
  }

  loadPayroll(){
    this._wagePeriodService.getWagePeriods(this.currentPage, this.itemsPerPage, this.searchTerm, this.sortColumn, this.sortDirection)
    .subscribe({
      next: (response: IWagePeriodList) => {
        this.wagePeriodList = response.items;
        // this.filteredWagePeriodList = wagePeriodResult;
        // this.applyFilter();
        // this.updatePagination();
        // this.orgList = response.items;
        this.totalItems = response.totalItems;
        this.currentPage = response.pageNumber;
        this.itemsPerPage = response.pageSize;
        this.totalPages = response.totalPages;
        this.hasNextPage = response.hasNextPage;
        this.hasPreviousPage = response.hasPreviousPage;
        this.applyFilter();
      },
      error: err => { this.errorMessage = err; console.log(err); }
    })
  }

  search() {    
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

  openCreateTaskModal() {
    this.router.navigate(['wage-period/create']);
  }

  deletePayroll(id: number) {
    this._wagePeriodService.deleteWagePeriod(id).subscribe({
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
    this.filteredWagePeriodList = this.wagePeriodList.filter(orgData => orgData.st === this.filterStatus);
  }
  // applyFilter() {
  //   this.filteredWagePeriodList = this.wagePeriodList.filter(wagePeriodData => {
  //     const matchesStatus = wagePeriodData.st == this.filterStatus;
  //     // const matchesSearch = wagePeriodData.cd.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
  //     // wagePeriodData.ds.toLowerCase().includes(this.searchTerm.toLowerCase())
  //     // return matchesSearch && matchesStatus;
  //     return matchesStatus;
  //   });
  //   this.currentPage = 1;
  //   this.updatePagination();
  // }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredWagePeriodList.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedData = this.filteredWagePeriodList.slice(start, end);
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

