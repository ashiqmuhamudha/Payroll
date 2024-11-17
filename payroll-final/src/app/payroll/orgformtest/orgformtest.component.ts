import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IOrgData, OrgHeader, OrgValue, ISalaryGroupCondition } from '../../models/orgmodel';
import { OrgserviceService } from '../../services/orgservice.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModalComponent } from 'src/app/selection-modal/selection-modal.component';

@Component({
  selector: 'app-orgformtest',
  templateUrl: './orgformtest.component.html',
  styleUrls: ['./orgformtest.component.scss']
})
export class OrgformtestComponent implements OnInit {
  salaryForm!: FormGroup;
  orgHeaderOptions: OrgHeader[] = [];
  orgValueOptions: OrgValue[] = [];
  salaryGroupConditionListDto = [];
  selectedOrgHeaderId: number | null = null;
  filteredOrgValues: OrgValue[] = [];

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    private dataService: OrgserviceService
  ) { }

  ngOnInit(): void {
    this.salaryForm = this.fb.group({
      salaryGroupConditionListDto: this.fb.array([])
    });

    this.loadOrgData();
    this.loadOrgHeaderOptions();
    this.loadOrgValueOptions();

  }

  createEmptyCondition(): ISalaryGroupCondition {
    return {
      id: 0,           
      sId: 0,          
      oAHId: 0,        
      oADId: 0,        
      oADCode: '',     
      oP: ''    
    };
  }

  // Load data from the service
  loadOrgData() {
    this.dataService.getOrgData().subscribe(data => {
      const salaryGroupConditionListDto: ISalaryGroupCondition[] = [this.createEmptyCondition()];;
      const conditionGroups = salaryGroupConditionListDto.map(condition => this.createConditionGroup(condition));
      this.salaryForm.setControl('salaryGroupConditionListDto', this.fb.array(conditionGroups));
    });
  }

  loadOrgHeaderOptions() {
    this.dataService.getOrgHeaders().subscribe((data) => {
      this.orgHeaderOptions = data;
    });
  }

  loadOrgValueOptions() {
    this.dataService.getOrgValues().subscribe((data) => {
      this.orgValueOptions = data;
    });
  }

  createConditionGroup(condition: ISalaryGroupCondition): FormGroup {
    return this.fb.group({
      id: [condition.id],
      oAHId: [condition.oAHId],
      oADId: [condition.oADId],
      oADCode: [condition.oADCode],
      oP: [condition.oP]      
    });
  }

  get salaryGroupConditions(): FormArray {
    return this.salaryForm.get('salaryGroupConditionListDto') as FormArray;
  }

  addCondition() {
    const newCondition: ISalaryGroupCondition = {
      id: 0,
      sId: 1,  // You can adjust default values here
      oAHId: 0,
      oADId: 0,
      oADCode: '',
      oP: ''      
    };
    const conditionGroup = this.createConditionGroup(newCondition);
    this.salaryGroupConditions.push(conditionGroup);
  }

  removeCondition(index: number) {
    this.salaryGroupConditions.removeAt(index);
  }

  // openOrgHeaderModal(content: TemplateRef<any>, conditionIndex: number) {
  //   const modalRef = this.modalService.open(content, { size: 'lg' });

  //   modalRef.result.then((selectedOrgHeader : OrgHeader) => {
  //     if (selectedOrgHeader) {
  //       const selectedHeader = selectedOrgHeader;
  //       // Casting the controls to FormArray to access the controls property correctly
  //       const conditionGroup = (this.salaryForm.get('salaryGroupConditionListDto') as FormArray).at(conditionIndex);
  //       conditionGroup.get('oAHId')?.setValue(selectedHeader.id);
  //       conditionGroup.get('oADCode')?.setValue(selectedHeader.ds);
  //       this.selectedOrgHeaderId = selectedHeader.id; // Update the selected Org Header ID
  //       this.filteredOrgValues = this.orgValueOptions.filter(v => v.oId === this.selectedOrgHeaderId);
  //     }
  //   });
  // }
  // openOrgValueModal(content: TemplateRef<any>, conditionIndex: number) {
  //   const modalRef = this.modalService.open(content, { size: 'lg' });

  //   modalRef.result.then((selectedOrgValue : OrgValue) => {
  //     if (selectedOrgValue) {
  //       const selectedValue = selectedOrgValue;
  //       const conditionGroup = (this.salaryForm.get('salaryGroupConditionListDto') as FormArray).at(conditionIndex);
  //       conditionGroup.get('oADId')?.setValue(selectedValue.id);
  //       conditionGroup.get('oADCode')?.setValue(selectedValue.ds);
  //     }
  //   });
  // }

  // openOrgHeaderModal1(content: any, conditionIndex: number) {
  //   const modalRef = this.modalService.open(content, { size: 'lg' });

  //   modalRef.result.then((selectedOrgHeader: OrgHeader) => {
  //     if (selectedOrgHeader) {
  //       const conditionGroup = this.salaryGroupConditions.at(conditionIndex) as FormGroup;

  //       // Set the OrgHeader ID and display text in the form group
  //       conditionGroup.get('oAHId')?.setValue(selectedOrgHeader.id);

  //       // Update the selected OrgHeader ID for filtering OrgValues
  //       this.selectedOrgHeaderId = selectedOrgHeader.id;

  //       // Filter OrgValues based on the selected OrgHeader ID
  //       this.filteredOrgValues = this.orgValueOptions.filter(v => v.oId === this.selectedOrgHeaderId);
  //     }
  //   }).catch(() => { }); // Catch to handle dismissal
  // }

  // Fetch the description based on oAHId
  getOrgHeaderDs(oAHId: number): string {
    const orgHeader = this.orgHeaderOptions.find(header => header.id === oAHId);
    return orgHeader ? orgHeader.ds : '';
  }

  // Fetch the description based on oADId
  // getOrgValueDs(oADId: number): string {
  //   const orgValue = this.orgValueOptions.find(value => value.id === oADId);
  //   return orgValue ? orgValue.ds : '';
  // }

  getOrgValueDs(oADIds: number | number[]): string {  
    let ids: string[];

    if (typeof oADIds === 'string') {
      // Convert a comma-separated string of IDs into an array of numbers
      ids = (oADIds as unknown as string).split(',').map(id => id.trim());
    } else if (Array.isArray(oADIds)) {
      // If it's already an array of numbers, use it directly
      ids = oADIds.map(id => id.toString());
    } else {
      // If it's a single number, wrap it in an array
      ids = [oADIds.toString()];
    }
  
    const selectedOrgValues = this.orgValueOptions.filter(value => ids.includes(value.id.toString()));
    return selectedOrgValues.map(value => value.ds).join(', ');  // Join the ds values with commas
  }

  // openOrgValueModal1(content: any, conditionIndex: number) {
  //   const modalRef = this.modalService.open(content, { size: 'lg' });

  //   modalRef.result.then((selectedOrgValue: OrgValue) => {
  //     if (selectedOrgValue) {
  //       const conditionGroup = this.salaryGroupConditions.at(conditionIndex) as FormGroup;

  //       // Set OrgValue id, code, and display text in the form group
  //       conditionGroup.get('oADId')?.setValue(selectedOrgValue.id);
  //       conditionGroup.get('oADCode')?.setValue(selectedOrgValue.ds); // Display selected ds value
  //     }
  //   }).catch(() => { }); // Catch to handle dismissal
  // }

  saveData() {
    const updatedData = this.salaryForm.value;
    this.dataService.addOrgData(updatedData).subscribe(response => {
      console.log('Data saved successfully', response);
    });
  }

  onSelectOrgValue(value: any, modal: any) {
    modal.close(value);
  }

  openOrgHeaderModal(conditionIndex: number) {
    const modalRef = this.modalService.open(SelectionModalComponent, { size: 'lg' });
    modalRef.componentInstance.data = this.orgHeaderOptions;
    modalRef.componentInstance.isMultiSelect = false;
    modalRef.componentInstance.title = 'Select Org Header';
    modalRef.componentInstance.paginatedData = this.orgHeaderOptions;

    modalRef.componentInstance.selectionConfirmed.subscribe((selectedHeader: any) => {
      if (selectedHeader) {
        const condition = this.salaryGroupConditions.at(conditionIndex);
        condition.patchValue({ oAHId: selectedHeader.id });
      }
    });
  }

  openOrgValueModal(conditionIndex: number) {
    const oAHId = this.salaryGroupConditions.at(conditionIndex).get('oAHId')?.value;
    const filteredOrgValues = this.orgValueOptions.filter(value => value.oId == oAHId);

    const modalRef = this.modalService.open(SelectionModalComponent, { size: 'lg' });
    modalRef.componentInstance.data = filteredOrgValues;
    modalRef.componentInstance.isMultiSelect = true;
    modalRef.componentInstance.title = 'Select Org Value';
    modalRef.componentInstance.paginatedData = this.orgValueOptions;

    modalRef.componentInstance.selectionConfirmed.subscribe((selectedValues: any[]) => {
      if (selectedValues.length > 0) {
        const condition = this.salaryGroupConditions.at(conditionIndex);
        const selectedCodes = selectedValues.map(value => value.cd).join(', '); // Join selected codes with commas
        const selectedIds = selectedValues.map(value => value.id).join(', '); // Join selected descriptions with commas

        // Patch the values into the form
        condition.patchValue({
          oADCode: selectedCodes,  // Comma-separated codes
          oADId: selectedIds // Comma-separated descriptions (optional)
        });
      }
    });
  }
}