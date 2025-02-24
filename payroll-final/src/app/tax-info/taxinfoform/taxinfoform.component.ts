import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ITaxinfoData, } from '../../models/taxinfomodel';
import { ITaxData, } from '../../models/taxmodel';
import { FormBuilder, FormGroup,  Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModalComponent } from 'src/app/selection-modal/selection-modal.component';
import { taxgroupserviceService } from '../../services/taxgroupservice.service';

@Component({
  selector: 'app-taxinfoform',
  templateUrl: './taxinfoform.component.html',
  styleUrls: ['./taxinfoform.component.scss']
})
export class TaxinfoformComponent {

  selectedTaxformId: number | null = null;
  taxformOptions: ITaxinfoData[] = [];
  submitted = false;
  Router: any;
  isActive: any;
  isShowActive: boolean = false;
  taxform!: FormGroup;
  taxformlId: number | null = null;
  isAdd: boolean = true;
  TaxgroupOptions: ITaxData[] = [];




  constructor(private fb: FormBuilder, private taxService: taxgroupserviceService 
    , private taxmodalService: NgbModal, public router: Router, private route: ActivatedRoute) {
      
        this.taxform = this.fb.group(
          {
            id: [0],
            tGn: [''],
            cd: ['', [Validators.required, Validators.maxLength(30), Validators.pattern('^[A-Z_]+$')]],
            ds: ['', [Validators.required, Validators.maxLength(100)]],
            sIc: [''],
            dO: ['' , [Validators.required, Validators.maxLength(4), Validators.pattern('/^-?\d*\.?\d+$/')]],
            
    
   
          },
          
        );
    }

  


  ngOnInit() {
    this.loadtaxinfo();
     //this.loadbaseform();
    // Check if the route contains an 'id' parameter for edit
    this.route.paramMap.subscribe((params: any) => {
      const id = +params.get('id')!;  // Use the ID from the route (e.g., 2)
      this.taxformlId = id;

      // If an ID exists, fetch the existing payroll data
      if (this.taxformlId) {
        this.isAdd = false;        
        this.editTaxForm(this.taxformlId);
      }
      else {
        this.isAdd = true;       
      }
    });

    
  } 

  loadtaxinfo() {
    if (this.TaxgroupOptions) {
      this.taxService.getApiData().subscribe(data => {
        this.TaxgroupOptions = data;
      });
    }
  }

  getTaxInfoDataByCode(ds : string): string {    
    const taxinfo = this.TaxgroupOptions.find(group => group.ds == ds);
    return taxinfo ? taxinfo.ds : '';
  }


   // Populate form fields when editing an existing payroll
   editTaxForm(id: number) {
      this.taxService.getTaxInfoDataByCode(id).subscribe((data: ITaxinfoData) => {
        if (data) {
          this.taxform.patchValue({
            id: data.id,
            tGn: data.tGn,
            cd: data.cd,
            ds: data.ds,
            sIc: data.sIc,
            dO: data.do,

           
        
          });
          this.isShowActive = this.taxform.get('sIc')?.value == 'Y' ? true : false;      
        }
      });
    }

  onSubmit() {
    this.submitted = true;
    if (this.taxform.valid) {
      const taxData:  ITaxinfoData = this.taxform.value;
      taxData.sIc = this.isShowActive ? "Y" : "N";
      if (taxData.id) {
          this.taxService.updateTaxInfoData(taxData).subscribe({
          next: () => this.router.navigate(['/tax-information-list']),
          error: (err: any) => console.error('Error updating baseform:', err)
        });
      }
        else {
        this.taxService.createTaxInfoData(taxData).subscribe({
          next: () => this.router.navigate(['/tax-information-list']),
          error: (err: any) => console.error('Error creating baseform:', err)
        });
      }
    }
  }

  onShow() {
    this.isShowActive = !this.isShowActive;
  }


   // Fetch the description based on oAHId
   getTaxform(tGn: number): string {    
    const Taxform = this.taxformOptions.find(form => form.id == tGn);
    return Taxform ? Taxform.ds : '';
  }


  opentaxformModal() {
      const modalRef = this.taxmodalService.open(SelectionModalComponent, { size: 'lg', backdrop: true, keyboard: true });  
      modalRef.componentInstance.url = `${this.taxService.apiTaxData}Pagination`;
      modalRef.componentInstance.isMultiSelect = false;
      modalRef.componentInstance.title = 'Select Tax Group Name';   
  
      modalRef.componentInstance.selectionConfirmed.subscribe((selectedform: any) => {
        if (selectedform) {        
          this.taxform.patchValue({ tGn : selectedform.tGn });       
        }
      });
    }

 

  


}
