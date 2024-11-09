import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-selection-modal',
  templateUrl: './selection-modal.component.html',
  styleUrls: ['./selection-modal.component.scss']
})
export class SelectionModalComponent implements OnInit {
  @Input() data: any[] = [];            // Data list (e.g., orgHeader or orgValue)
  @Input() isMultiSelect: boolean = false; // Multi-selection toggle
  @Input() title: string = 'Select Item'; // Modal title
  @Output() selectionConfirmed = new EventEmitter<any | any[]>(); // Emit selected data

  searchTerm: string = '';
  filteredData: any[] = [];
  paginatedData: any[] = [];
  itemsPerPage = 5;
  currentPage = 1;
  totalPages = 1;

  selectedItems: Set<any> = new Set();

  constructor(public activeModal: NgbActiveModal){

  }

  ngOnInit() {
    this.filteredData = [...this.data];
    this.updatePagination();
  }

  onSearch() {
    this.filteredData = this.data.filter(item =>
      item.ds.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.cd.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedData = this.filteredData.slice(start, end);
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

  // openModal(content: any) {
  //   const modalRef = this.modalService.open(content, { size: 'lg' });
  //   modalRef.componentInstance.modal = modalRef; 
  //   modalRef.result.then(
  //     (result) => {
  //       // Handle the result
  //       console.log('Modal closed with result:', result);
  //     },
  //     (reason) => {
  //       // Handle dismiss reason
  //       console.log('Modal dismissed:', reason);
  //     }
  //   );
  // }

  confirmSelection() {
    if (this.isMultiSelect) {
      this.selectionConfirmed.emit(Array.from(this.selectedItems));
      this.activeModal.close(this.selectedItems);
    }
  }

  // Close the modal
  closeModal() {
    this.activeModal.dismiss(); // Dismiss the modal
  }
}
