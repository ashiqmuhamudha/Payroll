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
          cd: ['', [Validators.required, Validators.maxLength(100)]],
          wF: ['', Validators.required],
          wT: ['', Validators.required],
          st: ['', Validators.required],
          tF: ['', Validators.required],
          tT: ['', Validators.required],
          pT: ['M', Validators.required],
          pM: ['L', Validators.required],
          sM: [{ value: null, disabled: true }, [Validators.min(1), Validators.max(31)]],
          cM: ['R', Validators.required],
          cD: [{ value: null, disabled: true }, [Validators.min(0), Validators.max(99)]],
        },
        { validators: this.dateRangeValidator('wF', 'wT', 'tF', 'tT') }
      );
    // this.wageForm = this.fb.group({
    //   id: [0],
    //   cd: ['', [Validators.required, Validators.maxLength(100)]],
    //   wF: ['', Validators.required],
    //   wT: ['', [Validators.required, this.dateRangeValidator('wF')]],
    //   st: ['', Validators.required],
    //   tF: ['', Validators.required],
    //   tT: ['', [Validators.required, this.dateRangeValidator('tF')]],
    //   pT: ['M'],
    //   pM: ['L'],
    //   sM: [0],
    //   cM: ['R'],
    //   cD: [0]
    // });
    // this.wageForm = this.fb.group({
    //   id: [0],
    //   cd: ['', Validators.required, Validators.maxLength(100)],
    //   wF: ['', Validators.required],
    //   wT: ['', [Validators.required]],
    //   st: [''],
    //   tF: ['', Validators.required],
    //   tT: ['', [Validators.required]],
    //   pT: ['M'],
    //   pM: ['L'],
    //   sM: [0],
    //   cM: ['R'],
    //   cD: [0]
    // });
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
        // this.salaryForm.patchValue({
        //   salaryGroupConditionListDto: this.fb.array([this.createSalaryGroupCondition()])
        // })
      }
    });

    // Watch for changes in pM and toggle sM field
    this.wageForm.get('pM')?.valueChanges.subscribe((value) => {
      const sMControl = this.wageForm.get('sM');
      if (value === 'S') {
        sMControl?.enable();
      } else {
        sMControl?.disable();
        sMControl?.reset();
      }
    });

    // Watch for changes in cM and toggle cD field
    this.wageForm.get('cM')?.valueChanges.subscribe((value) => {
      const cDControl = this.wageForm.get('cD');
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

  // dateRangeValidator(compareField: string) {
  //   return (control: any) => {
  //     const form = control?.parent;
  //     if (!form) return null;
  //     const compareValue = form.get(compareField)?.value;
  //     return compareValue && new Date(control.value) <= new Date(compareValue)
  //       ? { dateRangeInvalid: true }
  //       : null;
  //   };
  // }

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

      if (!wageFrom || !wageTo || !taxFrom || !taxTo) {
        return null; // Skip validation if any field is empty
      }

      const wageFromDate = new Date(wageFrom);
      const wageToDate = new Date(wageTo);
      const taxFromDate = new Date(taxFrom);
      const taxToDate = new Date(taxTo);

      const errors: any = {};

      // Check if Wage Period To is greater than Wage Period From
      if (wageToDate <= wageFromDate) {
        errors.wageToInvalid = true;
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
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero
    return `${year}-${month}-${day}`;
  }
  // loadWagePeriods() {
  //   this.wageService.getWagePeriods().subscribe({
  //     next: (data) => (this.wagePeriods = data),
  //     error: (err) => console.error('Error fetching wage periods:', err)
  //   });
  // }

  // editWagePeriod(wage: IWagePeriod) {
  //   this.wageForm.patchValue(wage);
  // }

  // deleteWagePeriod(id: number) {
  //   this.wageService.deleteWagePeriod(id).subscribe({
  //     next: () => this.loadWagePeriods(),
  //     error: (err) => console.error('Error deleting wage period:', err)
  //   });
  // }

  onSubmit() {
    this.submitted = true;
    if (this.wageForm.valid) {
      const formData = this.wageForm.value;
      if (formData.id) {
        this.wageService.updateWagePeriod(formData).subscribe({
          next: () => this.router.navigate(['wage-period-list']),
          error: (err) => console.error('Error updating wage period:', err)
        });
      } else {
        this.wageService.createWagePeriod(formData).subscribe({
          next: () => this.router.navigate(['wage-period-list']),
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
    return date.toISOString(); // Convert back to ISO format
  }


}
