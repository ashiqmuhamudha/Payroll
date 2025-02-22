import { Component, OnInit } from '@angular/core';
import { ITaxinfoData, ITaxinfoDataList } from '../../models/taxinfomodel';
import { Router } from '@angular/router';
import { taxgroupserviceService } from 'src/app/services/taxgroupservice.service';

@Component({
  selector: 'app-taxinfolist',
  templateUrl: './taxinfolist.component.html',
  styleUrls: ['./taxinfolist.component.scss']
})
export class TaxinfolistComponent {
  taxList: ITaxinfoData[] =[];  
  searchTerm: string = '';
  filteredtaxList: ITaxinfoData[] = [];
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

  constructor(private _taxService: taxgroupserviceService, private router: Router) { }

  ngOnInit() {
    this.loadTaxGroup();    
  }

   loadTaxGroup(){
      this._taxService.getTaxInfoData(this.currentPage, this.itemsPerPage, this.searchTerm, this.sortColumn, this.sortDirection)
      .subscribe({
        next: (response: ITaxinfoDataList) => {
          this.taxList = response.items;
          // this.filteredWagePeriodList = wagePeriodResult;
          // this.applyFilter();
          // this.updatePagination();
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
    this.router.navigate(['tax-information-list/create']);
  }

  deleteTaxlist(id: number) {
    this._taxService.deleteTaxInfoData(id).subscribe({
      next: result => {
        console.log(`Payroll with ID ${id} deleted successfully.`);  
        this.loadTaxGroup();      
      },
      error: err => {
        { this.errorMessage = err; console.log(err); }
      }
    }
    );
  }

  //applyFilter() {
    //this.filteredBaseList = this.baseList;
  //}

   //applyFilter() 
   //{
   //  this.filteredBaseList = this.baseList.filter(baseData => {
   //    const matchesStatus = baseData.ty == this.filterStatus;
   //    const matchesSearch = baseData.cd.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
   //    baseData.ds.toLowerCase().includes(this.searchTerm.toLowerCase())
   //    return matchesSearch && matchesStatus;
   //  });
   //  this.currentPage = 1;
   //  this.loadSalaryGroup();
   //}

  //updatePagination() {
    //this.totalPages = Math.ceil(this.filteredBaseList.length / this.itemsPerPage);
    //const start = (this.currentPage - 1) * this.itemsPerPage;
    //const end = start + this.itemsPerPage;
    //this.paginatedData = this.filteredBaseList.slice(start, end);
  //}

  applyFilter() {
    this.filteredtaxList = this.taxList;
  }

  previousPage() {
    if (this.hasPreviousPage) {
      this.currentPage--;
      this.loadTaxGroup();
    }
  }

  nextPage() {
    if (this.hasNextPage) {
      this.currentPage++;
      this.loadTaxGroup();
    }
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'ASC';
    }
    this.loadTaxGroup();
  }

  search() {
    // this.searchTerm = this.searchTerm.trim();
    this.loadTaxGroup();
  }



}
