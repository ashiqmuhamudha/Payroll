import { Component, OnInit } from '@angular/core';
import { OrgserviceService } from '../../services/orgservice.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ISalaryData, ISalaryGroupCondition, OrgHeader, OrgValue } from '../../models/orgmodel';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectionModalComponent } from 'src/app/selection-modal/selection-modal.component';

@Component({
  selector: 'app-orgform',
  templateUrl: './payrollform.component.html',
  styleUrls: ['./payrollform.component.scss']
})
export class PayrollformComponent implements OnInit {
  salaryForm!: FormGroup;
  orgHeaderOptions: OrgHeader[] = [];
  orgValueOptions: OrgValue[] = [];
  //orgValueSelected : OrgValue[] = []
  selectedOrgHeaderId: number | null = null;
  filteredOrgValues: OrgValue[] = [];
  payrollId: number | null = null;
  isAdd: boolean = true;
  orgFormList: ISalaryData[] = [];
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
    this.salaryForm = this.fb.group({
      id: [null],
      cd: ['', [Validators.required, Validators.maxLength(30), Validators.pattern('^[A-Z_]+$')]],
      ds: ['', [Validators.required, Validators.maxLength(100)]],
      st: ['A', Validators.required],
      salaryGroupConditionListDto: this.fb.array([this.createSalaryGroupCondition()])
    });
  }

  ngOnInit(): void {
    // this.loadOrgHeaders();
    // this.loadOrgValues();
    //this.loadOrgFormList();

    // Check if the route contains an 'id' parameter for edit
    this.route.paramMap.subscribe(params => {
      const id = +params.get('id')!;  // Use the ID from the route (e.g., 2)
      this.payrollId = id;

      // If an ID exists, fetch the existing payroll data
      if (this.payrollId) {
        this.isAdd = false;
        this.editSalaryGroup(this.payrollId);
      }
      else {
        this.isAdd = true;
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

  checkForDuplicateConditions(): boolean {
    const conditions = this.salaryForm.get('salaryGroupConditionListDto')?.value || [];
    const uniqueConditions = new Set();

    for (const condition of conditions) {
      const identifier = `${condition.oAHId}-${condition.oADId}-${condition.oP}`;
      if (uniqueConditions.has(identifier)) {
        this.duplicateError = true;
        return true;
      }
      uniqueConditions.add(identifier);
    }
    this.duplicateError = false;
    return false;
  }

  onToggleChange() {
    this.isActive = !this.isActive;
  }

  addSalaryGroupCondition() {
    this.salaryGroupConditionListDto.push(this.createSalaryGroupCondition());
  }

  removeSalaryGroupCondition(index: number) {
    this.salaryGroupConditionListDto.removeAt(index);
  }

  // Populate form fields when editing an existing payroll
  editSalaryGroup(id: number) {
    this.orgService.getOrgDataByCode(id).subscribe((data: ISalaryData) => {
      if (data) {
        this.salaryForm.patchValue({
          id: data.id,
          cd: data.cd,
          ds: data.ds,
          st: data.st
        });
        this.isActive = this.salaryForm.get('st')?.value == 'A' ? true : false;
        // Populate salary group conditions if available
        this.salaryGroupConditionListDto.clear(); // Clear any existing conditions
        data.salaryGroupConditionListDto.forEach((condition: ISalaryGroupCondition) => {
          this.salaryGroupConditionListDto.push(this.createSalaryGroupCondition(condition));
        });
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.salaryForm.invalid) {
      return;
    }
    if (this.checkForDuplicateConditions()) {
      return;
    }
    // if (this.salaryForm.valid) {
    const formValue: ISalaryData = this.salaryForm.value;
    formValue.st = this.isActive ? "A" : "I";
    // Check if this is a new entry or an update
    if (formValue.id) {
      this.orgService.updateOrgData(formValue).subscribe(response => {
        console.log('Updated:', response);
        this.router.navigate(['/salary-group']);
      });
    } else {
      formValue.id = 0;
      this.orgService.addOrgData(formValue).subscribe(response => {
        console.log('Added:', response);
        this.router.navigate(['/salary-group']);
      });
      // }
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

  //Load OrgValue data
  loadOrgValues() {
    if (this.orgValueOptions) {
      this.orgService.getOrgValues().subscribe(data => {
        this.orgValueOptions = data;
      });
    }
  }

  // Fetch the description based on oAHId
  getOrgHeaderDs(oAHId: number): string {
    //  const orgHeader = this.orgHeaderOptions.find(header => header.id == oAHId);
    // return orgHeader ? orgHeader.ds : ''
    this.orgService.getOrgHeaderById(oAHId).subscribe(orgHeader => {
      //this.orgValueOptions = data;
      return orgHeader ? orgHeader.ds : '';
    });
    return '';
  }

  getOrgValueDs(oADId: number): string {
    // const orgValue = this.orgValueOptions.find(header => header.id == oADId);
    // return orgValue ? orgValue.ds : '';
    this.orgService.getOrgValueById(oADId).subscribe(orgValue => {
      //this.orgValueOptions = data;
      return orgValue ? orgValue.ds : '';
    });
    return '';
  }


  openOrgHeaderModal(conditionIndex: number) {
    const modalRef = this.modalService.open(SelectionModalComponent, { size: 'lg', backdrop: true, keyboard: true });
    // modalRef.componentInstance.data = this.orgHeaderOptions;
    // modalRef.componentInstance.url = 'http://210.18.187.237:1234/ORG_ATTRIBUTES_HEADERS/api/v1/ORG_ATTRIBUTES_HEADERS/Pagination';
    modalRef.componentInstance.url = `${this.orgService.apiOrgAttributeHeader}Pagination`;
    modalRef.componentInstance.isMultiSelect = false;
    modalRef.componentInstance.title = 'Select Org Header';
    // modalRef.componentInstance.paginatedData = this.orgHeaderOptions;

    modalRef.componentInstance.selectionConfirmed.subscribe((selectedHeader: any) => {
      if (selectedHeader) {
        const condition = this.salaryGroupConditionListDto.at(conditionIndex);
        condition.patchValue({ oAHId: selectedHeader.id });       
      }
    });
  }

  openOrgValueModal(conditionIndex: number) {
    const oAHId = this.salaryGroupConditionListDto.at(conditionIndex).get('oAHId')?.value;
    const filteredOrgValues = this.orgValueOptions.filter(value => value.oId == oAHId);

    const modalRef = this.modalService.open(SelectionModalComponent, { size: 'lg',backdrop: true, keyboard: true });
    // modalRef.componentInstance.data = filteredOrgValues;
    // modalRef.componentInstance.url = "http://210.18.187.237:1234/ORG_ATTRIBUTES_DETAILS/api/v1/ORG_ATTRIBUTES_DETAILS/Pagination"
    modalRef.componentInstance.url = `${this.orgService.apiOrgAttributeDetails}Pagination`
    modalRef.componentInstance.isMultiSelect = false;
    modalRef.componentInstance.title = 'Select Org Value';
    // modalRef.componentInstance.paginatedData = this.orgValueOptions;

    modalRef.componentInstance.selectionConfirmed.subscribe((selectedValues: any) => {
      if (selectedValues) {
        const condition = this.salaryGroupConditionListDto.at(conditionIndex);       
        condition.patchValue({
          oADCode: selectedValues.cd,
          oADId: selectedValues.id
        });
      }
    });
  }
}
