import { Component, OnInit } from '@angular/core';
import { OrgserviceService } from '../../services/orgservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrgHeader, OrgDetail, IOrgDetail } from '../../models/orgmodel';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectionModalComponent } from 'src/app/selection-modal/selection-modal.component';

@Component({
  selector: 'app-orgattdetail',
  templateUrl: './orgattdetail.component.html',
  styleUrls: ['./orgattdetail.component.scss']
})
export class OrgattdetailComponent implements OnInit {
  orgDetailForm!: FormGroup;
  orgHeaderOptions: OrgHeader[] = [];
  orgValueOptions: OrgDetail[] = [];
  
  selectedOrgHeaderId: number | null = null;
  filteredOrgValues: OrgDetail[] = [];
  orgDetaillId: number | null = null;
  isAdd: boolean = true;
  orgFormList: IOrgDetail[] = [];
  isActive: boolean = false;
  duplicateError: boolean = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private orgService: OrgserviceService,
    private modalService: NgbModal,
    public router: Router,
    private route: ActivatedRoute
  ) {
    this.orgDetailForm = this.fb.group({
      id: [null],
      cd: ['', [Validators.required, Validators.maxLength(30), Validators.pattern('^[a-zA-Z0-9_]+$')]],
      ds: ['', [Validators.required, Validators.maxLength(100)]],
      st: ['A', Validators.required],
      oId: [null,Validators.required]      
    });
  }

  ngOnInit(): void {
     this.loadOrgHeaders();

    // Check if the route contains an 'id' parameter for edit
    this.route.paramMap.subscribe(params => {
      const id = +params.get('id')!;  
      this.orgDetaillId = id;

      // If an ID exists, fetch the existing payroll data
      if (this.orgDetaillId) {
        this.isAdd = false;        
        this.editOrgDetail(this.orgDetaillId);
      }
      else {
        this.isAdd = true;
      }
    });
  }



  onToggleChange() {
    this.isActive = !this.isActive;
  }

  // Populate form fields when editing an existing payroll
  editOrgDetail(id: number) {
    this.orgService.getOrgDetailAttributeByCode(id).subscribe((data: OrgDetail) => {
      if (data) {
        this.orgDetailForm.patchValue({
          id: data.id,
          cd: data.cd,
          ds: data.ds,
          st: data.st,
          oId: data.oId
        });
        this.isActive = this.orgDetailForm.get('st')?.value == 'A' ? true : false;        
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.orgDetailForm.invalid) {
      return;
    }   
    const formValue: OrgDetail = this.orgDetailForm.value;
    formValue.st = this.isActive ? "A" : "I";    
    if (formValue.id) {
      this.orgService.updateOrgDetailAttribute(formValue).subscribe(response => {
        console.log('Updated:', response);
        this.router.navigate(['/org-attributes-details']);
      });
    } else {
      formValue.id = 0;
      this.orgService.addOrgDetailAttribute(formValue).subscribe(response => {
        console.log('Added:', response);
        this.router.navigate(['/org-attributes-details']);
      });     
    }
  }


  // Load OrgHeader data
  loadOrgHeaders() {
    if (this.orgHeaderOptions) {
      this.orgService.getOrgHeaders().subscribe(data => {
        this.orgHeaderOptions = data;
      });
    }
  }


  // Fetch the description based on oAHId
  getOrgHeaderDs(oId: number): string {    
    const orgHeader = this.orgHeaderOptions.find(header => header.id == oId);
    return orgHeader ? orgHeader.ds : '';
  }



  openOrgHeaderModal() {
    const modalRef = this.modalService.open(SelectionModalComponent, { size: 'lg', backdrop: true, keyboard: true });  
    modalRef.componentInstance.url = `${this.orgService.apiOrgAttributeHeader}Pagination`;
    modalRef.componentInstance.isMultiSelect = false;
    modalRef.componentInstance.title = 'Select Org Header';   

    modalRef.componentInstance.selectionConfirmed.subscribe((selectedHeader: any) => {
      if (selectedHeader) {        
        this.orgDetailForm.patchValue({ oId: selectedHeader.id });       
      }
    });
  }

  
}

