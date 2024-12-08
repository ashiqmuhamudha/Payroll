import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { WagePeriodService } from '../../services/wageperiod.service';
import { IWagePeriod } from '../../models/wageperiodmodel';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-wage-period',
  templateUrl: './wageperiodform.component.html',
  styleUrls: ['./wageperiodform.component.scss']
})
export class WageperiodformComponent implements OnInit {
  wageForm: FormGroup;
  wagePeriods: IWagePeriod[] = [];
  isAdd: boolean = false;
  wagePeriodlId: number | null = null;
  isActive: boolean = false;
  duplicateError: boolean = false;
  submitted = false;

  constructor(private fb: FormBuilder, private wageService: WagePeriodService, public router: Router,
    private route: ActivatedRoute) {
      this.wageForm = this.fb.group(
        {
          id: [0],
          cd: ['', [Validators.required, Validators.maxLength(100)]],
          wF: ['', Validators.required],
          wT: ['', Validators.required],
          st: [''],
          tF: ['', Validators.required],
          tT: ['', Validators.required],
          pT: ['M', Validators.required],
          pM: ['L'],
          sM: [31, [Validators.min(1), Validators.max(31)]],
          cM: ['R'],
          cuD: [{ value: null, disabled: true }, [Validators.min(0), Validators.max(99)]],
        },
        { validators: this.dateRangeValidator('wF', 'wT', 'tF', 'tT') }
      );
  }



  ngOnInit() {
    // this.loadWagePeriods();
    // Check if the route contains an 'id' parameter for edit
    this.route.paramMap.subscribe(params => {
      const id = +params.get('id')!;  // Use the ID from the route (e.g., 2)
      this.wagePeriodlId = id;

      // If an ID exists, fetch the existing payroll data
      if (this.wagePeriodlId) {
        this.isAdd = false;        
        this.editWagePeriod(this.wagePeriodlId);
      }
      else {
        this.isAdd = true;       
      }
    });



    // Watch for changes in cM and toggle cuD field
    this.wageForm.get('cM')?.valueChanges.subscribe((value) => {
      const cDControl = this.wageForm.get('cuD');
      if (value === 'C') {
        cDControl?.enable();
      } else {
        cDControl?.disable();
        cDControl?.reset();
      }
    });
  }

  editWagePeriod(id: number) {
    this.wageService.getWagePeriodById(id).subscribe((data: IWagePeriod) => {
      if (data) {
        this.wageForm.patchValue({
          ...data,
          wF: this.formatDateToLocal(data.wF),
          wT: this.formatDateToLocal(data.wT),
          tF: this.formatDateToLocal(data.tF),
          tT: this.formatDateToLocal(data.tT)
        });
        this.isActive = this.wageForm.get('st')?.value == 'A' ? true : false;
      }
    });
  }

  dateRangeValidator(
    wageFromField: string,
    wageToField: string,
    taxFromField: string,
    taxToField: string
  ): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const wageFrom = formGroup.get(wageFromField)?.value;
      const wageTo = formGroup.get(wageToField)?.value;
      const taxFrom = formGroup.get(taxFromField)?.value;
      const taxTo = formGroup.get(taxToField)?.value;

      // if (!wageFrom || !wageTo || !taxFrom || !taxTo) {
      //   return null;
      // }

      const wageFromDate = new Date(wageFrom);
      const wageToDate = new Date(wageTo);
      const taxFromDate = new Date(taxFrom);
      const taxToDate = new Date(taxTo);

      const errors: any = {};

      // Check if Wage Period To is greater than Wage Period From
      if (wageToDate <= wageFromDate) {
        errors.wageToInvalid = true;
      }

      if (taxToDate <= taxFromDate) {
        errors.taxToInvalid = true;
      }
      // Check if Wage Period To is between Tax From and Tax To
      if (wageToDate < taxFromDate || wageToDate > taxToDate) {
        errors.wageToOutOfRange = true;
      }

      if (wageFromDate < taxFromDate || wageFromDate > taxToDate) {
        errors.wageFromOutOfRange = true;
      }

      return Object.keys(errors).length > 0 ? errors : null;
    };
  }

  private formatDateToLocal(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0'); 
    return `${year}-${month}-${day}`;
  }


  onSubmit() {
    this.submitted = true;
    if (this.wageForm.valid) {
      const formData = this.wageForm.value;
      formData.st = this.isActive ? "A" : "I";
      if (formData.id) {
        this.wageService.updateWagePeriod(formData).subscribe({
          next: () => this.router.navigate(['wage-period']),
          error: (err) => console.error('Error updating wage period:', err)
        });
      } else {
        this.wageService.createWagePeriod(formData).subscribe({
          next: () => this.router.navigate(['wage-period']),
          error: (err) => console.error('Error creating wage period:', err)
        });
      }
    }
  }

  onToggleChange() {
    this.isActive = !this.isActive;
  }

  private formatDateForSubmit(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString();
  }


}
