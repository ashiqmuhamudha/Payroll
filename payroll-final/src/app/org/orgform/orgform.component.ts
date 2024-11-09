import { Component, OnInit } from '@angular/core';
import { OrgserviceService } from '../orgservice.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IOrgData, ISalaryGroupCondition, OrgHeader, OrgValue } from '../orgmodel';

@Component({
  selector: 'app-orgform',
  templateUrl: './orgform.component.html',
  styleUrls: ['./orgform.component.scss']
})
export class OrgformComponent implements OnInit {
  orgForm: FormGroup;
  orgHeaderOptions: OrgHeader[] = [];
  orgValueOptions: OrgValue[] = [];
  filteredOrgValueOptions: OrgValue[] = [];

  constructor(private fb: FormBuilder, private orgService: OrgserviceService) {
    this.orgForm = this.fb.group({
      id: [null, Validators.required],
      cd: ['', Validators.required],
      ds: ['', Validators.required],
      st: ['A', Validators.required],
      salaryGroupConditionListDto: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadOrgHeaders();
    this.loadOrgValues();
    this.addSalaryGroupCondition();
  }

  get salaryGroupConditionListDto(): FormArray {
    return this.orgForm.get('salaryGroupConditionListDto') as FormArray;
  }

  createSalaryGroupCondition(condition: ISalaryGroupCondition = { id: 0, sId: 0, oAHId: 0, oADId: 0, oADCode: '', oP: '', cO: '' }): FormGroup {
    const group = this.fb.group({
      id: [condition.id],
      sId: [condition.sId],
      oAHId: [condition.oAHId, Validators.required],
      oP: [condition.oP, Validators.required],
      oADId: [condition.oADId],
      oADCode: [condition.oADCode],
      cO: [condition.cO, Validators.required]
    });

    group.get('oAHId')!.valueChanges.subscribe(value => {
      if (value != null) {
        this.updateOrgValueOptions(value, group);
      }
    });
    return group;
  }

  addSalaryGroupCondition() {
    this.salaryGroupConditionListDto.push(this.createSalaryGroupCondition());
  }

  removeSalaryGroupCondition(index: number) {
    this.salaryGroupConditionListDto.removeAt(index);
  }

  updateOrgValueOptions(orgHeaderId: number, conditionGroup: FormGroup) {
    this.filteredOrgValueOptions = this.orgValueOptions.filter(option => option.oId === orgHeaderId);
    conditionGroup.get('oADId')!.setValue(null);
  }

  onSubmit() {
    if (this.orgForm.valid) {
      const formValue: IOrgData = this.orgForm.value;

      // Check if this is a new entry or an update
      if (formValue.id) {
        this.orgService.updateOrgData(formValue).subscribe(response => {
          console.log('Updated:', response);
        });
      } else {
        this.orgService.addOrgData(formValue).subscribe(response => {
          console.log('Added:', response);
        });
      }
    }
  }

  // Load OrgHeader data from the JSON server
  loadOrgHeaders() {
    this.orgService.getOrgHeaders().subscribe(data => {
      this.orgHeaderOptions = data;
    });
  }

  // Load OrgValue data from the JSON server
  loadOrgValues() {
    this.orgService.getOrgValues().subscribe(data => {
      this.orgValueOptions = data;
    });
  }

  deleteSalaryGroup(id: number) {
    this.orgService.deleteOrgData(id).subscribe(() => {
      console.log(`Deleted group with ID: ${id}`);
    });
  }

  editSalaryGroup(id: number) {
    this.orgService.getOrgDataByCode(id).subscribe((data: IOrgData) => {
      // Populate the form with retrieved data
      this.orgForm.patchValue({
        id: data.id,
        cd: data.cd,
        ds: data.ds,
        st: data.st,
      });

      // Clear existing conditions and add the retrieved ones
      this.salaryGroupConditionListDto.clear();
      data.salaryGroupConditionListDto.forEach(condition => {
        this.salaryGroupConditionListDto.push(this.createSalaryGroupCondition(condition));
      });
    });
  }

  // Optional: Reset the form for a new entry
  resetForm() {
    this.orgForm.reset();
    this.salaryGroupConditionListDto.clear();
    this.addSalaryGroupCondition(); // Optionally add an empty condition row
  }
}

