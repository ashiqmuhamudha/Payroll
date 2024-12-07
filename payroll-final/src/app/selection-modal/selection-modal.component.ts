import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectionmodelService } from '../services/selectionmodel.service';

@Component({
  selector: 'app-selection-modal',
  templateUrl: './selection-modal.component.html',
  styleUrls: ['./selection-modal.component.scss']
})
export class SelectionModalComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() url: string = '';  // Base API URL      
  @Input() isMultiSelect: boolean = false;
  @Input() title: string = 'Select Item';
  @Output() selectionConfirmed = new EventEmitter<any | any[]>();

  searchTerm: string = '';
  filteredData: any[] = [];
  // paginatedData: any[] = [];
  items: any[] = [];  
  totalItems: number = 0;  
  pageNumber: number = 1; 
  pageSize: number = 5; 
  totalPages: number = 1;  
  hasPreviousPage: boolean = false; 
  hasNextPage: boolean = false; 

  selectedItems: Set<any> = new Set();
  sortColumn: string = 'CODE';
  sortDirection: string = 'ASC';

  constructor(public activeModal: NgbActiveModal, private selModelService: SelectionmodelService) {

  }

  // ngOnInit() {
  //   this.filteredData = [...this.data];
  //   this.updatePagination();
  // }

  ngOnInit() {
    this.fetchData();
  }
  buildUrl(): string {
    return `${this.url}?PageNumber=${this.pageNumber}&PageSize=${this.pageSize}&SearchValue=${this.searchTerm || 'ALL'}&SortColumn=${this.sortColumn}&SortDirection=${this.sortDirection}`;
  }

  fetchData() {
    const apiUrl = this.buildUrl();
    this.selModelService.getData(apiUrl).subscribe({
      next: (response: any) => {
        this.items = response.items;  
        this.totalItems = response.totalItems;  
        this.pageNumber = response.pageNumber; 
        this.pageSize = response.pageSize;  
        this.totalPages = response.totalPages; 
        this.hasPreviousPage = response.hasPreviousPage;  
        this.hasNextPage = response.hasNextPage;  
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    });
  }

  onSearch() {
    this.pageNumber = 1;  
    this.fetchData();
  }

  // onSearch() {
  //   this.filteredData = this.data.filter(item =>
  //     item.ds.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
  //     item.cd.toLowerCase().includes(this.searchTerm.toLowerCase())
  //   );
  //   this.currentPage = 1;
  //   this.updatePagination();
  // }

  // updatePagination() {
  //   this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
  //   const start = (this.currentPage - 1) * this.itemsPerPage;
  //   const end = start + this.itemsPerPage;
  //   this.paginatedData = this.filteredData.slice(start, end);
  // }

  // Handle pagination
  updatePagination(action: 'next' | 'previous') {
    if (action === 'next' && this.hasNextPage) {
      this.pageNumber++;
    } else if (action === 'previous' && this.hasPreviousPage) {
      this.pageNumber--;
    }
    this.fetchData();
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

  onSelect(item: any) {
    if (this.isMultiSelect) {
      this.toggleSelection(item);
    } else {
      this.selectionConfirmed.emit(item);
      this.activeModal.dismiss();
    }
  }

  toggleSelection(item: any, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    if (this.isSelected(item)) {
      this.selectedItems.delete(item);
    } else {
      this.selectedItems.add(item);
    }
  }

  isSelected(item: any): boolean {
    return this.selectedItems.has(item);
  }

  // confirmSelection() {
  //   if (this.isMultiSelect) {
  //     this.selectionConfirmed.emit(Array.from(this.selectedItems));
  //     this.activeModal.close(this.selectedItems);
  //   }
  // }

  updateSorting(column: string) {
    if (this.sortColumn === column) {      
      this.sortDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
    } else {      
      this.sortColumn = column;
      this.sortDirection = 'ASC';
    }
    this.fetchData();  
  }

  confirmSelection() {
    if (this.isMultiSelect) {
      this.selectionConfirmed.emit(Array.from(this.selectedItems));
    } else {
      this.selectionConfirmed.emit(this.selectedItems.size ? Array.from(this.selectedItems)[0] : null);
    }
    this.activeModal.close();
  }
  // Close the modal
  closeModal() {
    this.activeModal.dismiss();
  }
}
