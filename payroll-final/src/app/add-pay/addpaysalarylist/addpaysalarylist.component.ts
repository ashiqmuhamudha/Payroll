import { Component, OnInit } from '@angular/core';
import { IAddPayData, IAddPayDataList } from '../../models/addpaymodel';
import { addpayserviceService } from '../../services/addpayservice.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-addpaysalarylist',
  templateUrl: './addpaysalarylist.component.html',
  styleUrls: ['./addpaysalarylist.component.scss']
})
export class AddpaysalarylistComponent {

 
    AddPayList: IAddPayData[] =[];  
    searchTerm: string = '';
    filteredaddpayList: IAddPayData[] = [];
    paginatedData: any[] = [];
    itemsPerPage = 5;
    currentPage = 1;
    totalPages = 1;
    filterStatus: string = 'A';
    errorMessage = "Loading. Please wait...";
    sortColumn = 'CODE';
    sortDirection = 'ASC';
    totalItems = 0;
    hasNextPage = false;
    hasPreviousPage = false;
  
    constructor(private _addpayService: addpayserviceService, private router: Router) { }
  
    ngOnInit() {
      this.loadAddPay();    //
    }
  
     loadAddPay(){
        this._addpayService.getAddpaysalarylist(this.currentPage, this.itemsPerPage, this.searchTerm, this.sortColumn, this.sortDirection)
        .subscribe({
          next: (response: IAddPayDataList) => {
            this.AddPayList = response.items;
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

    openCreateTaskModal() {
      this.router.navigate(['additional-pay-salary-list/create']);
    }
  
    deleteAddPay(id: number) {
      this._addpayService.deleteAddpaysalarylist(id).subscribe({
        next: result => {
          console.log(`Payroll with ID ${id} deleted successfully.`);  
          this.loadAddPay();      
        },
        error: err => {
          { this.errorMessage = err; console.log(err); }
        }
      }
      );
    }
  
    applyFilter() {
      this.filteredaddpayList = this.AddPayList;
    }
  
    previousPage() {
      if (this.hasPreviousPage) {
        this.currentPage--;
        this.loadAddPay();
      }
    }
  
    nextPage() {
      if (this.hasNextPage) {
        this.currentPage++;
        this.loadAddPay();
      }
    }
  
    sort(column: string) {
      if (this.sortColumn === column) {
        this.sortDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
      } else {
        this.sortColumn = column;
        this.sortDirection = 'ASC';
      }
      this.loadAddPay();
    }
  
    search() {
      this.loadAddPay();
    }
  
  
  
  
}
