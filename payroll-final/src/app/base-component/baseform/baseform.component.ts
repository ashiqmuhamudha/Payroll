import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IBaseData, } from '../../models/basemodel';
import { ISalaryData, } from '../../models/orgmodel';
import { baseserviceService } from '../../services/baseservice.service';
import { FormBuilder, FormGroup,  Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModalComponent } from 'src/app/selection-modal/selection-modal.component';
import { OrgserviceService } from '../../services/orgservice.service';



@Component({
  selector: 'app-baseform',
  templateUrl: './baseform.component.html',
  styleUrls: ['./baseform.component.scss']
})
export class BaseformComponent {

  selectedBaseformId: number | null = null;
  baseformOptions: IBaseData[] = [];
  submitted = false;
  Router: any;
  isActive: any;
  isProrateActive: boolean = false;
  isArrearActive: boolean = false;
  isPayslipActive: boolean = false;
  isTimetaxActive: boolean = false;
  baseform!: FormGroup;
  baseformlId: number | null = null;
  isAdd: boolean = true;
  salarygroupOptions: ISalaryData[] = [];




  constructor(private fb: FormBuilder, private baseService: baseserviceService, private orgService: OrgserviceService 
    , private basemodalService: NgbModal, public router: Router, private route: ActivatedRoute) {
      
        this.baseform = this.fb.group(
          {
            id: [0],
            cd: ['', [Validators.required, Validators.maxLength(30), Validators.pattern('^[A-Z_]+$')]],
            ds: ['', [Validators.required, Validators.maxLength(100)]],
            sid: [''],
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
    this.loadSalarygroup();
     //this.loadbaseform();
    // Check if the route contains an 'id' parameter for edit
    this.route.paramMap.subscribe((params: any) => {
      const id = +params.get('id')!;  // Use the ID from the route (e.g., 2)
      this.baseformlId = id;

      // If an ID exists, fetch the existing payroll data
      if (this.baseformlId) {
        this.isAdd = false;        
        this.editBaseForm(this.baseformlId);
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
    editBaseForm(id: number) {
      this.baseService.getBaseDataByCode(id).subscribe((data: IBaseData) => {
        if (data) {
          this.baseform.patchValue({
            id: data.id,
            cd: data.cd,
            ds: data.ds,
            sid: data.sid,
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
          this.isProrateActive = this.baseform.get('pr')?.value == 'Y' ? true : false;
          this.isArrearActive = this.baseform.get('ar')?.value == 'Y' ? true : false;
          this.isPayslipActive = this.baseform.get('pp')?.value == 'Y' ? true : false;
          this.isTimetaxActive = this.baseform.get('ont')?.value == 'Y' ? true : false;        
        }
      });
    }

  onSubmit() {
    this.submitted = true;
    if (this.baseform.valid) {
      const BaseData:  IBaseData = this.baseform.value;
      BaseData.pr = this.isProrateActive ? "Y" : "N";
      BaseData.ar = this.isArrearActive ? "Y" : "N";
      BaseData.pp = this.isPayslipActive ? "Y" : "N";
      BaseData.ont = this.isTimetaxActive ? "Y" : "N";
      if (BaseData.id) {
          this.baseService.updateBaseData(BaseData).subscribe({
          next: () => this.router.navigate(['/baselist']),
          error: (err: any) => console.error('Error updating baseform:', err)
        });
      }
        else {
        this.baseService.createBaseForm(BaseData).subscribe({
          next: () => this.router.navigate(['/baselist']),
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
   getBaseform(sid: number): string {    
    const Baseform = this.baseformOptions.find(form => form.id == sid);
    return Baseform ? Baseform.ds : '';
  }


  openBaseformModal() {
      const modalRef = this.basemodalService.open(SelectionModalComponent, { size: 'lg', backdrop: true, keyboard: true });  
      modalRef.componentInstance.url = `${this.orgService.apiSalaryGroup}Pagination`;
      modalRef.componentInstance.isMultiSelect = false;
      modalRef.componentInstance.title = 'Select Salary Group Name';   
  
      modalRef.componentInstance.selectionConfirmed.subscribe((selectedform: any) => {
        if (selectedform) {        
          this.baseform.patchValue({ sid : selectedform.id });       
        }
      });
    }

 

  


}