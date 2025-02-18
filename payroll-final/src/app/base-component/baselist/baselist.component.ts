import { Component, OnInit } from '@angular/core';
import { IBaseData, IBaseDataList } from '../../models/basemodel';
import { ISalaryData} from '../../models/orgmodel';
import { baseserviceService } from '../../services/baseservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-baselist',
  templateUrl: './baselist.component.html',
  styleUrls: ['./baselist.component.scss']
})
export class BaselistComponent implements OnInit {
  baseList: IBaseData[] =[];  
  searchTerm: string = '';
  filteredBaseList: IBaseData[] = [];
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

  constructor(private _baseService: baseserviceService, private router: Router) { }

  ngOnInit() {
    this.loadSalaryGroup();    
  }

   loadSalaryGroup(){
      this._baseService.getBasecomponentlist(this.currentPage, this.itemsPerPage, this.searchTerm, this.sortColumn, this.sortDirection)
      .subscribe({
        next: (response: IBaseDataList) => {
          this.baseList = response.items;
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
    this.router.navigate(['baselist/create']);
  }

  deleteSalaryGroup(id: number) {
    this._baseService.deleteBaseData(id).subscribe({
      next: result => {
        console.log(`Payroll with ID ${id} deleted successfully.`);  
        this.loadSalaryGroup();      
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
    this.filteredBaseList = this.baseList;
  }

  previousPage() {
    if (this.hasPreviousPage) {
      this.currentPage--;
      this.loadSalaryGroup();
    }
  }

  nextPage() {
    if (this.hasNextPage) {
      this.currentPage++;
      this.loadSalaryGroup();
    }
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'ASC';
    }
    this.loadSalaryGroup();
  }

  search() {
    // this.searchTerm = this.searchTerm.trim();
    this.loadSalaryGroup();
  }



}
