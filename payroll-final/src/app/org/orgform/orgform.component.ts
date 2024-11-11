import { Component, OnInit } from '@angular/core';
import { OrgserviceService } from '../orgservice.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IOrgData, ISalaryGroupCondition, OrgHeader, OrgValue } from '../orgmodel';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectionModalComponent } from 'src/app/selection-modal/selection-modal.component';

@Component({
  selector: 'app-orgform',
  templateUrl: './orgform.component.html',
  styleUrls: ['./orgform.component.scss']
})
export class OrgformComponent implements OnInit {
  salaryForm!: FormGroup;
  orgHeaderOptions: OrgHeader[] = [];
  orgValueOptions: OrgValue[] = [];
  //orgValueSelected : OrgValue[] = []
  selectedOrgHeaderId: number | null = null;
  filteredOrgValues: OrgValue[] = [];
  payrollId: number | null = null;
  isAdd: boolean = true;
  orgFormList: IOrgData[] = [];

  constructor(
    private fb: FormBuilder,
    private orgService: OrgserviceService,
    private modalService: NgbModal,
    public router: Router,
    private route: ActivatedRoute
  ) {
    this.salaryForm = this.fb.group({
      id: [null],
      cd: ['', Validators.required],
      ds: ['', Validators.required],
      st: ['A', Validators.required],
      salaryGroupConditionListDto: this.fb.array([this.createSalaryGroupCondition()])
    });
  }

  ngOnInit(): void {
    this.loadOrgHeaders();
    this.loadOrgValues();
    //this.loadOrgFormList();

    // Check if the route contains an 'id' parameter for edit
    this.route.paramMap.subscribe(params => {
      const id = +params.get('id')!;  // Use the ID from the route (e.g., 2)
      this.payrollId = id;

      // If an ID exists, fetch the existing payroll data
      if (this.payrollId) {
        this.isAdd=false;
        this.editSalaryGroup(this.payrollId);
      }
      else {
        this.isAdd=true;
        // this.salaryForm.patchValue({
        //   salaryGroupConditionListDto: this.fb.array([this.createSalaryGroupCondition()])
        // })
      }
    });
  }

  get salaryGroupConditionListDto(): FormArray {
    return this.salaryForm.get('salaryGroupConditionListDto') as FormArray;
  }

  createSalaryGroupCondition(condition: ISalaryGroupCondition = { id: 0, sId: 0, oAHId: 0, oADId: 0, oADCode: '', oP: '' }): FormGroup {
    return this.fb.group({
      id: [condition.id],
      sId: [condition.sId],
      oAHId: [condition.oAHId, Validators.required],
      oP: [condition.oP, Validators.required],
      oADId: [condition.oADId],
      oADCode: [condition.oADCode]
    });
  }

  addSalaryGroupCondition() {
    this.salaryGroupConditionListDto.push(this.createSalaryGroupCondition());
  }

  removeSalaryGroupCondition(index: number) {
    this.salaryGroupConditionListDto.removeAt(index);
  }

  // Populate form fields when editing an existing payroll
  editSalaryGroup(id: number) {
    this.orgService.getOrgDataByCode(id).subscribe((data: IOrgData) => {
      if (data) {
        this.salaryForm.patchValue({
          id: data.id,
          cd: data.cd,
          ds: data.ds,
          st: data.st
        });

        // Populate salary group conditions if available
        this.salaryGroupConditionListDto.clear(); // Clear any existing conditions
        data.salaryGroupConditionListDto.forEach((condition: ISalaryGroupCondition) => {
          this.salaryGroupConditionListDto.push(this.createSalaryGroupCondition(condition));
        });
      }
    });
  }

  onSubmit() {
    if (this.salaryForm.valid) {
      const formValue: IOrgData = this.salaryForm.value;

      // Check if this is a new entry or an update
      if (formValue.id) {
        this.orgService.updateOrgData(formValue).subscribe(response => {
          console.log('Updated:', response);
          this.router.navigate(['/payroll-list']);
        });
      } else {
        formValue.id=0;
        this.orgService.addOrgData(formValue).subscribe(response => {
          console.log('Added:', response);
          this.router.navigate(['/payroll-list']);
        });
      }      
    }    
  }

  // Load OrgHeader data
  loadOrgHeaders() {
    this.orgService.getOrgHeaders().subscribe(data => {
      this.orgHeaderOptions = data;
    });
  }

  //Load OrgValue data
  loadOrgValues() {
    this.orgService.getOrgValues().subscribe(data => {
      this.orgValueOptions = data;
    });
  }

  // Fetch the description based on oAHId
  getOrgHeaderDs(oAHId: number): string {
    const orgHeader = this.orgHeaderOptions.find(header => header.id == oAHId);
    return orgHeader ? orgHeader.ds : '';
  }

  getOrgValueDs(oADId: number): string {
    const orgValue = this.orgValueOptions.find(header => header.id == oADId);
    return orgValue ? orgValue.ds : '';
  }

  // addOrgValue(selectedOrgValue: OrgValue): void {
  //   // Add item only if not already in the array
  //   if (this.orgValueSelected.findIndex(orgValue => orgValue.id === selectedOrgValue.id) === -1) {
  //     this.orgValueSelected.push(selectedOrgValue);
  //   }
  // }

  // getOrgValueDs(oADIds: number | number[]): string {
  //   let ids: string[];

  //   if (typeof oADIds === 'string') {
  //     // Convert a comma-separated string of IDs into an array of numbers
  //     ids = (oADIds as unknown as string).split(',').map(id => id.trim());
  //   } else if (Array.isArray(oADIds)) {
  //     // If it's already an array of numbers, use it directly
  //     ids = oADIds.map(id => id.toString());
  //   } else {
  //     // If it's a single number, wrap it in an array
  //     ids = [oADIds.toString()];
  //   }

  //   const selectedOrgValues = this.orgValueOptions.filter(value => ids.includes(value.id.toString()));
  //   return selectedOrgValues.map(value => value.ds).join(', ');  // Join the ds values with commas
  // }

  
  // loadOrgFormList(): void {
  //   this.orgService.getOrgData().subscribe((data: IOrgData[]) => {
  //     this.orgFormList = data;
  //   });
  // }

  
  // getMaxId(): number {
  //   if (this.orgFormList.length > 0) {
  //     return Math.max(...this.orgFormList.map(record => record.id || 0)); 
  //   }
  //   return 0;  
  // }

  openOrgHeaderModal(conditionIndex: number) {
    const modalRef = this.modalService.open(SelectionModalComponent, { size: 'lg' });
    modalRef.componentInstance.data = this.orgHeaderOptions;
    modalRef.componentInstance.isMultiSelect = false;
    modalRef.componentInstance.title = 'Select Org Header';
    modalRef.componentInstance.paginatedData = this.orgHeaderOptions;

    modalRef.componentInstance.selectionConfirmed.subscribe((selectedHeader: any) => {
      if (selectedHeader) {
        const condition = this.salaryGroupConditionListDto.at(conditionIndex);
        condition.patchValue({ oAHId: selectedHeader.id });
        // this.orgService.getOrgValueById(selectedHeader.id).subscribe(data => {
        //   this.orgValueOptions = data;
        // });
      }
    });
  }

  openOrgValueModal(conditionIndex: number) {
    const oAHId = this.salaryGroupConditionListDto.at(conditionIndex).get('oAHId')?.value;
    const filteredOrgValues = this.orgValueOptions.filter(value => value.oId == oAHId);

    const modalRef = this.modalService.open(SelectionModalComponent, { size: 'lg' });
    modalRef.componentInstance.data = filteredOrgValues;
    modalRef.componentInstance.isMultiSelect = false;
    modalRef.componentInstance.title = 'Select Org Value';
    modalRef.componentInstance.paginatedData = this.orgValueOptions;

    modalRef.componentInstance.selectionConfirmed.subscribe((selectedValues: any) => {
      if (selectedValues) {
        const condition = this.salaryGroupConditionListDto.at(conditionIndex);
        //const selectedCodes = selectedValues.map(value => value.cd).join(', ');
        //const selectedIds = selectedValues.map(value => value.id).join(', ');

        // Patch the values into the form
        //this.addOrgValue(selectedValues);
        condition.patchValue({
          oADCode: selectedValues.cd,
          oADId: selectedValues.id
        });
      }
    });
  }
}
