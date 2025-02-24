import { Component, OnInit } from '@angular/core';
import { IForData, IForDataList } from '../../models/formulamodel';
import { formulaserviceService } from '../../services/formulaservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulalist',
  templateUrl: './formulalist.component.html',
  styleUrls: ['./formulalist.component.scss']
})
export class FormulalistComponent {
  formulaList: IForData[] =[];  
  searchTerm: string = '';
  filteredForList: IForData[] = [];
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

  constructor(private _forService: formulaserviceService, private router: Router) { }

  ngOnInit() {
    this.loadForGroup();    
  }

   loadForGroup(){
      this._forService.getForcomponentlist(this.currentPage, this.itemsPerPage, this.searchTerm, this.sortColumn, this.sortDirection)
      .subscribe({
        next: (response: IForDataList) => {
          this.formulaList = response.items;
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
    this.router.navigate(['formulalist/create']);
  }

  deleteForGroup(id: number) {
    this._forService.deleteForData(id).subscribe({
      next: result => {
        console.log(`Payroll with ID ${id} deleted successfully.`);  
        this.loadForGroup();      
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
    this.filteredForList = this.formulaList;
  }

  previousPage() {
    if (this.hasPreviousPage) {
      this.currentPage--;
      this.loadForGroup();
    }
  }

  nextPage() {
    if (this.hasNextPage) {
      this.currentPage++;
      this.loadForGroup();
    }
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'ASC';
    }
    this.loadForGroup();
  }

  search() {
    // this.searchTerm = this.searchTerm.trim();
    this.loadForGroup();
  }



}
