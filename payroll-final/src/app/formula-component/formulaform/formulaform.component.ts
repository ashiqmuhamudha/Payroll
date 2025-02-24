import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IForData } from '../../models/formulamodel';
import { ISalaryData, } from '../../models/orgmodel';
import { formulaserviceService } from '../../services/formulaservice.service';
import { FormBuilder, FormGroup,  Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModalComponent } from 'src/app/selection-modal/selection-modal.component';
import { OrgserviceService } from '../../services/orgservice.service';

@Component({
  selector: 'app-formulaform',
  templateUrl: './formulaform.component.html',
  styleUrls: ['./formulaform.component.scss']
})
export class FormulaformComponent {

  selectedBaseformId: number | null = null;
  formulaformOptions: IForData[] = [];
  submitted = false;
  Router: any;
  isActive: any;
  isProrateActive: boolean = false;
  isArrearActive: boolean = false;
  isPayslipActive: boolean = false;
  isTimetaxActive: boolean = false;
  formulaform!: FormGroup;
  formulaformlId: number | null = null;
  isAdd: boolean = true;
  salarygroupOptions: ISalaryData[] = [];




  constructor(private fb: FormBuilder, private forService: formulaserviceService, private orgService: OrgserviceService 
    , private formodalService: NgbModal, public router: Router, private route: ActivatedRoute) {
      
        this.formulaform = this.fb.group(
          {
            id: [0],
            cd: ['', [Validators.required, Validators.maxLength(30), Validators.pattern('^[A-Z_]+$')]],
            ds: ['', [Validators.required, Validators.maxLength(100)]],
            sid: [''],
            fr: [''],
            ty: [''],
            pr: [''],
            ar: [''],
            pp: [''],
            ppo: [{  disabled: false }, [Validators.min(0), Validators.max(99)]],
            fe: [''],
            ont: [''],
            tc: [''],  
            tcc: [''],
   
    
   
          },
          
        );
    }

  


  ngOnInit() {
    this.loadformula();
     //this.loadbaseform();
    // Check if the route contains an 'id' parameter for edit
    this.route.paramMap.subscribe((params: any) => {
      const id = +params.get('id')!;  // Use the ID from the route (e.g., 2)
      this.formulaformlId = id;

      // If an ID exists, fetch the existing payroll data
      if (this.formulaformlId) {
        this.isAdd = false;        
        this.editFormulaForm(this.formulaformlId);
      }
      else {
        this.isAdd = true;       
      }
    });

    
  } 

  loadformula() {
    if (this.salarygroupOptions) {
      this.orgService.getSalaryGroup().subscribe(data => {
        this.salarygroupOptions = data;
      });
    }
  }

  getForDataByCode(ds : string): string {    
    const FormulaComponent = this.salarygroupOptions.find(Component => Component.ds == ds);
    return FormulaComponent ? FormulaComponent.ds : '';
  }


   // Populate form fields when editing an existing payroll
    editFormulaForm(id: number) {
      this.forService.getForDataByCode(id).subscribe((data: IForData) => {
        if (data) {
          this.formulaform.patchValue({
            id: data.id,
            cd: data.cd,
            ds: data.ds,
            sid: data.sid,
            fr: data.fr,
            ty: data.ty,
            pr: data.pr,
            ar: data.ar,
            pp: data.pp,
            ppo: data.ppo,
            fe: data.fe,
            ont: data.ont,
            tc: data.tc,
            tcc: data.tcc,
        
          });
          this.isProrateActive = this.formulaform.get('pr')?.value == 'Y' ? true : false;
          this.isArrearActive = this.formulaform.get('ar')?.value == 'Y' ? true : false;
          this.isPayslipActive = this.formulaform.get('pp')?.value == 'Y' ? true : false;
          this.isTimetaxActive = this.formulaform.get('ont')?.value == 'Y' ? true : false;        
        }
      });
    }

  onSubmit() {
    this.submitted = true;
    if (this.formulaform.valid) {
      const ForData:  IForData = this.formulaform.value;
      ForData.pr = this.isProrateActive ? "Y" : "N";
      ForData.ar = this.isArrearActive ? "Y" : "N";
      ForData.pp = this.isPayslipActive ? "Y" : "N";
      ForData.ont = this.isTimetaxActive ? "Y" : "N";
      if (ForData.id) {
          this.forService.updateForData(ForData).subscribe({
          next: () => this.router.navigate(['/formulalist']),
          error: (err: any) => console.error('Error updating baseform:', err)
        });
      }
        else {
        this.forService.createForData(ForData).subscribe({
          next: () => this.router.navigate(['/formulalist']),
          error: (err: any) => console.error('Error creating baseform:', err)
        });
      }
    }
  }

  onProrate() {
    this.isProrateActive = !this.isProrateActive;
  }

  onArrear() {
    this.isArrearActive = !this.isArrearActive;
  }

  onPayslip() {
    this.isPayslipActive = !this.isPayslipActive;
  }

  onTimetax() {
    this.isTimetaxActive = !this.isTimetaxActive;
  }

   // Fetch the description based on oAHId
   getFormulaform(sid: number): string {    
    const Formulaform = this.formulaformOptions.find(form => form.id == sid);
    return Formulaform ? Formulaform.ds : '';
  }


  openFormulaformModal() {
      const modalRef = this.formodalService.open(SelectionModalComponent, { size: 'lg', backdrop: true, keyboard: true });  
      modalRef.componentInstance.url = `${this.orgService.apiSalaryGroup}Pagination`;
      modalRef.componentInstance.isMultiSelect = false;
      modalRef.componentInstance.title = 'Select Salary Group Name';   
  
      modalRef.componentInstance.selectionConfirmed.subscribe((selectedform: any) => {
        if (selectedform) {        
          this.formulaform.patchValue({ sid : selectedform.id });       
        }
      });
    }

 

  


}
