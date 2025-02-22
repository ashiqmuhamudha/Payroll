import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IAddPayData } from '../../models/addpaymodel';
import { ISalaryData, } from '../../models/orgmodel';
import { addpayserviceService } from '../../services/addpayservice.service';
import { FormBuilder, FormGroup,  Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModalComponent } from 'src/app/selection-modal/selection-modal.component';
import { OrgserviceService } from '../../services/orgservice.service';

@Component({
  selector: 'app-addpaysalaryform',
  templateUrl: './addpaysalaryform.component.html',
  styleUrls: ['./addpaysalaryform.component.scss']
})
export class AddpaysalaryformComponent  {

  selectedAddpayformId: number | null = null;
  addpayformOptions: IAddPayData[] = [];
  submitted = false;
  Router: any;
  isActive: any;
  isCarryActive: boolean = false;
  isPayslipActive: boolean = false;
  isTimetaxActive: boolean = false;
  addpayform!: FormGroup;
  addpayformlId: number | null = null;
  isAdd: boolean = true;
  salarygroupOptions: ISalaryData[] = [];




  constructor(private fb: FormBuilder, private addpayService: addpayserviceService, private orgService: OrgserviceService 
    , private addpaymodalService: NgbModal, public router: Router, private route: ActivatedRoute) {
      
        this.addpayform = this.fb.group(
          {
            id: [0],
            cd: ['', [Validators.required, Validators.maxLength(30), Validators.pattern('^[A-Z_]+$')]],
            ds: ['', [Validators.required, Validators.maxLength(100)]],
            sid: [''],
            ty: [''],
            pp: [''],
            ppo: [{  disabled: false }, [Validators.min(0), Validators.max(99)]],
            fe: [''],
            ont: [''],
            cf: [''],
            tc: [''],  
            tcc: [''],
   
    
   
          },
          
        );
    }

  


  ngOnInit() {
    this.loadSalarygroup();
     //this.loadbaseform();
    // Check if the route contains an 'id' parameter for edit
    this.route.paramMap.subscribe((params: any) => {
      const id = +params.get('id')!;  // Use the ID from the route (e.g., 2)
      this.addpayformlId = id;

      // If an ID exists, fetch the existing payroll data
      if (this.addpayformlId) {
        this.isAdd = false;        
        this.editAddPayForm(this.addpayformlId);
      }
      else {
        this.isAdd = true;       
      }
    });

    
  } 

  loadSalarygroup() {
    if (this.salarygroupOptions) {
      this.orgService.getSalaryGroup().subscribe(data => {
        this.salarygroupOptions = data;
      });
    }
  }

  getOrgDataByCode(ds : string): string {    
    const orgHeader = this.salarygroupOptions.find(header => header.ds == ds);
    return orgHeader ? orgHeader.ds : '';
  }


   // Populate form fields when editing an existing payroll
   editAddPayForm(id: number) {
      this.addpayService.getAddpaysalarylistByCode(id).subscribe((data: IAddPayData) => {
        if (data) {
          this.addpayform.patchValue({
            id: data.id,
            cd: data.cd,
            ds: data.ds,
            sid: data.sid,
            ty: data.ty,
            pp: data.pp,
            ppo: data.ppo,
            fe: data.fe,
            ont: data.ont,
            cf: data.cf,
            tc: data.tc,
            tcc: data.tcc,
        
          });

          this.isPayslipActive = this.addpayform.get('pp')?.value == 'Y' ? true : false;
          this.isTimetaxActive = this.addpayform.get('ont')?.value == 'Y' ? true : false;  
          this.isCarryActive = this.addpayform.get('cf')?.value == 'Y' ? true : false;      
        }
      });
    }

  onSubmit() {
    this.submitted = true;
    if (this.addpayform.valid) {
      const AddpayData:  IAddPayData = this.addpayform.value;
      AddpayData.pp = this.isPayslipActive ? "Y" : "N";
      AddpayData.ont = this.isTimetaxActive ? "Y" : "N";
      AddpayData.cf = this.isCarryActive ? "Y" : "N";
      if (AddpayData.id) {
          this.addpayService.updateAddpaysalarylist(AddpayData).subscribe({
          next: () => this.router.navigate(['/additional-pay-salary-list']),
          error: (err: any) => console.error('Error updating AddPayform:', err)
        });
      }
        else {
        this.addpayService.createAddpaysalarylist(AddpayData).subscribe({
          next: () => this.router.navigate(['/additional-pay-salary-list']),
          error: (err: any) => console.error('Error creating AddPayform:', err)
        });
      }
    }
  }

  onPayslip() {
    this.isPayslipActive = !this.isPayslipActive;
  }

  onTimetax() {
    this.isTimetaxActive = !this.isTimetaxActive;
  }

  onCarry() {
    this.isCarryActive = !this.isCarryActive;
  }

   // Fetch the description based on oAHId
   getAddpayform(sid: number): string {    
    const Addpayform = this.addpayformOptions.find(form => form.id == sid);
    return Addpayform ? Addpayform.ds : '';
  }


  openAddpayformModal() {
      const modalRef = this.addpaymodalService.open(SelectionModalComponent, { size: 'lg', backdrop: true, keyboard: true });  
      modalRef.componentInstance.url = `${this.orgService.apiSalaryGroup}Pagination`;
      modalRef.componentInstance.isMultiSelect = false;
      modalRef.componentInstance.title = 'Select Salary Group Name';   
  
      modalRef.componentInstance.selectionConfirmed.subscribe((selectedform: any) => {
        if (selectedform) {        
          this.addpayform.patchValue({ sid : selectedform.id });       
        }
      });
    }

 

  


}