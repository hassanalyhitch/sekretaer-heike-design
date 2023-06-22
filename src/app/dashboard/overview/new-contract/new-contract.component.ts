import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from './../../../services/customer.service';
import { ContractsService } from './../../../services/contracts.service';
import { UploadFileData } from './../../../models/upload-file.model';
import { FileSizePipe } from './../../../pipes/filesize.pipe';
import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BranchData } from '../../../models/branch.model';
import { BranchService } from '../../../services/branch.service';
import { CompanyData } from '../../../models/company.model';
import { ProductData } from '../../../models/products.model';
import { Location } from '@angular/common';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MultiSelectComponent } from 'ng-multiselect-dropdown';


export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD.MM.YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};


@Component({
  selector: 'app-new-contract',
  templateUrl: './new-contract.component.html',
  styleUrls: ['./new-contract.component.css'],
  providers:[
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    FileSizePipe]
})

export class NewContractComponent implements OnInit {

  TAG:string = 'NewContractComponent  ';

  dataArr: {
    Branch2MasterId:string;
    displayNameMAXOFFICE:string;
    displayNameSEKRETAER:string;
    displayNameDIMAS:string;
    name:string;
    displayName:string;
  }[] = [];

  companyArr:{
    MATCHCODE:string;
    displayName: string;
  }[] = [];

  productArr:{
    Branch2ProductId:string;
    Branch2MasterId:string;
    displayName:string;
    displayNameMAXOFFICE:string;
    displayNameSEKRETAER:string;
    displayNameDIMAS:string;
  }[]=[];

  branches: BranchData[] = [];
  companies: CompanyData[] = [];
  products: ProductData[] = [];

  name = 'company';
  showcontract: string;
  branchSelected: string;
  BrokerForm: FormGroup;
  optionSelected: boolean = true;
  Branch2MasterId: any;
  selectedBranches: any;
  selectedCompanies: any;
  selectedProducts: any;


  show: boolean = false;
  formGroup: FormGroup;
  file: File = null;
  fileName: string ="No file chosen";
  uploadFileArr: UploadFileData [] =[];

  doneIcon: string = "../assets/icons8-done-30.png";

  paymentMethodsList = [];
  paymentMethodSettings = {};

  statusReasonList = [];
  statusReasonSettings = {};

  broker_icon_link: string;
  selected_theme:   string;

  shareWithBroker:  boolean;
  broker_blue_logo: boolean;
  broker_pink_logo: boolean;
  
  @ViewChild("selectFile",{static:true}) selectFile:ElementRef;
  @ViewChild("startDate",{static:true}) startDate:ElementRef<HTMLInputElement>;
  @ViewChild("endDate",{static:true}) endDate:ElementRef<HTMLInputElement>;
  @ViewChild('companyOptions',)companyOptions:MultiSelectComponent;
  @ViewChild('productOptions') productOptions: MultiSelectComponent;


  branchSettings = {}; 
  companySettings = {};
  productSettings = {};

  none:any = "none";

  submitted:boolean = false;
  amount:any;
  PaymentMethod:any;
  StatusReason:any;
  Risk:any;
  insuranceNumber:any;

  constructor(
    private branchService:BranchService, 
    private fileSizePipe:FileSizePipe,
    private _location:Location,
    private contractService:ContractsService,
    private customerService:CustomerService,
    private _snackBar:MatSnackBar,
    private translate:TranslateService,
    private location:Location
    ) { 

      this.broker_icon_link = "../assets/icon_broker_round_default.svg"; // default round broker icon
      this.selected_theme   = "";

      this.broker_blue_logo = false;
      this.broker_pink_logo = false;
      this.shareWithBroker  = false;
  }

  ngOnInit(): void {

    this.selected_theme = localStorage.getItem('theme_selected');

    if(!this.selected_theme){
      //use default pink logo
      this.broker_pink_logo = true;

    } else if(this.selected_theme == 'default'){
      //use pink logo
      this.broker_pink_logo = true;

    } else if(this.selected_theme == 'blue'){
      //use blue logo
      this.broker_blue_logo = true;

    }
     
  this.branchSettings = {
    itemsShowLimit: 1,
    idField: 'Branch2MasterId',
    textField: 'displayNameSEKRETAER',
    singleSelection:true,
    enableCheckAll: false,
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    allowSearchFilter: true,
    limitSelection: 1,
    clearSearchFilter: true,
    maxHeight: 197,
    searchPlaceholderText: 'Search',
    noDataAvailablePlaceholderText: 'No data available',
    closeDropDownOnSelection: true,
    showSelectedItemsAtTop:true,
    defaultOpen: false,
    
  };

  this.companySettings = {
    itemsShowLimit: 1,
    idField: 'MATCHCODE',
    textField: 'displayName',
    singleSelection: true,
    enableCheckAll: true,
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    allowSearchFilter: true,
    limitSelection: 1,
    clearSearchFilter: true,
    maxHeight: 197,
    searchPlaceholderText: 'Search',
    noDataAvailablePlaceholderText: 'No data available',
    closeDropDownOnSelection: true,
    showSelectedItemsAtTop: true,
    defaultOpen: false,
    
  };

  this.productSettings = {
    itemsShowLimit: 1,
    idField:'Branch2ProductId',
    textField:'displayName',
    singleSelection: true,
    enableCheckAll: true,
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    allowSearchFilter: true,
    limitSelection: 1,
    clearSearchFilter: true,
    maxHeight: 197,
    searchPlaceholderText: 'Search',
    noDataAvailablePlaceholderText: 'No data available',
    closeDropDownOnSelection: true,
    showSelectedItemsAtTop: true,
    defaultOpen: false,

  };

  this.paymentMethodSettings = {
    singleSelection: true,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 1,
    allowSearchFilter: true,
    searchPlaceholderText: 'Search',
    noDataAvailablePlaceholderText: 'No data available',
    closeDropDownOnSelection: true,
    showSelectedItemsAtTop:true,
  };

  this.statusReasonSettings = {
    singleSelection: true,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 1,
    allowSearchFilter: true,
    searchPlaceholderText: 'Search',
    noDataAvailablePlaceholderText: 'No data available',
    closeDropDownOnSelection: true,
    showSelectedItemsAtTop:true,
  };

   
    this.branchService.getBranches().subscribe({
      next:(resp)=> {
       
        this.branches =[];
        if (Array.isArray(resp)){

          let index:number =0;

          for(let item of resp){
            if (item['name'] == null){
              item['name']= '';
            }
              
  
            let branch:BranchData ={
              Branch2MasterId:item['Branch2MasterId'],
              displayNameMAXOFFICE:item ['displayNameMAXOFFICE'],
              displayNameSEKRETAER:item ['displayNameSEKRETAER'],
              displayNameDIMAS:item['displayNameDIMAS'],
              name:item['name'],
              displayName:item['displayName']
            };
            this.branches.push(branch);

            index ++;
          }

        }

        this.dataArr = this.branches;
        this.sortBranches();
        
      },
      error:(e)=>{
        
      },
      complete:()=>{
      
      }
    });


    this.paymentMethodsList = [
      { item_id: 1, item_text: 'Yearly' },
      { item_id: 2, item_text: 'Half-yearly' },
      { item_id: 3, item_text: 'Quaterly' },
      { item_id: 4, item_text: 'Monthly' },
    ];

    this.statusReasonList = [
      { item_id: 100, item_text: 'AngeBot' },
      { item_id: 200, item_text: 'Antrag' },
      { item_id: 300, item_text: 'Aktiv' },
      { item_id: 400, item_text: 'storniert' },
      { item_id: 500, item_text: 'NZG' },
    ];



  }


  onBranchSelected(item:any){
    this.branchService.getCompany(item.Branch2MasterId).subscribe({
      next:(resp)=> {
       
        this.companies =[];
        if (Array.isArray(resp)){

          let index:number =0;

          for(let item of resp){
            let company:CompanyData = {
              MATCHCODE:item ['MATCHCODE'],
              displayName: item['displayName']
            };
          this.companies.push(company);

            index ++;
          }
        
        }
        this.companyArr = this.companies;
        this.sortCompanies();
      },
      error:(e)=>{
   
      },
      complete:()=>{
       
      }
    });
    this.branchService.getProducts(item.Branch2MasterId).subscribe({
      next:(resp)=>{
        this.products =[];
        if (Array.isArray(resp)){
          let index:number = 0;

          for (let item of resp){
            let product:ProductData ={
              Branch2ProductId:item['Branch2ProductId'],
              Branch2MasterId:item ['Branch2MasterId'],
              displayName:item['displayName'],
              displayNameMAXOFFICE:item['displayNameMAXOFFICE'],
              displayNameSEKRETAER:item['displayNameSEKRETAER'],
              displayNameDIMAS:item['displayNameDIMAS']
            };

            this.products.push(product);
            index ++;
          }
        }
        this.productArr = this.products;
        this.sortProducts();
       

      },
      error:(e)=>{
        
      },
      complete:()=>{

      }


    });
   
  }
  onBranchesDeselected(item:any){
      this.selectedBranches = [];
      this.selectedCompanies = [];
      this.selectedProducts = [];
      this.companyArr = [];
      this.productArr =[];
  }
  
  onCompanySelected(item:any){
  
  }
  
  onProductSelected(item:any){
    this.selectedProducts[0] = item;
   
  }

  onPaymentMethodSelected(item:any){
 
  }

  onStatusReasonSelected(item:any){

  }

  showContracts(){
    this.showcontract = this.branchSelected;
  }
  
  onSubmit(formValue:any){

    let formData = new FormData();
 
    formData.append('CustomerAmsidnr', this.customerService.customerData.Amsidnr) ;
    formData.append('CompanyShort', this.selectedCompanies[0].MATCHCODE)  ;
    formData.append('Begin' ,this.startDate.nativeElement.value);
    formData.append ('End' , this.endDate.nativeElement.value);
    formData.append('File' , this.file);
    formData.append('PaymentMethod','' + this.PaymentMethod[0].item_id);
    formData.append('YearlyPayment', formValue.amount);
    formData.append('StatusReason','' + this.StatusReason[0].item_id);
    formData.append('Risk',formValue.Risk);
    formData.append('Branch2ProductId',this.selectedProducts[0].Branch2ProductId);
    formData.append('Amsidnr',formValue.insuranceNumber);
 
    this.submitted = true;
 
    this.contractService.addNewContract(formData).subscribe({
     next:(resp)=>{
       this.submitted = false;
     },
     error:(resp) =>{
       this.submitted = false;

          //show snackbar with error message
          this._snackBar.open(this.translate.instant('new-contract.create_new_contract_error'), this.translate.instant('snack_bar.action_button'),{
            panelClass: ['snack_error'],
             duration:6000,
          });
  
           //return back to previous page
           setTimeout(()=>{
            this.location.back()
          },8000);

     },
     complete:()=>{
       this.submitted = false;

         //show snackbar with success message
         this._snackBar.open(this.translate.instant('new-contract.create_new_contract_success'), this.translate.instant('snack_bar.action_button'),{
          panelClass: ['snack_success'],
           duration:6000,
        });

         //return back to previous page
         setTimeout(()=>{
          this.location.back()
        },8000);
       
     }
    });
    
   }

  onOptionSelected(option:boolean){
    this.optionSelected = option;
  }

  getFile(event){
    
  //new code 
   this.file = event.target.files[0];
    
    if (this.file.type =='application/pdf' || this.file.type =='image/jpeg') {

      let _file:UploadFileData ={
        doc_file:this.file,
        fileId : this.uploadFileArr.length +"",
        fileName : this.file.name,
        fileSize :this.fileSizePipe.transform(this.file.size,'MB'),      
        fileType:this.file.type
      }

      
      this.uploadFileArr = [];
      this.uploadFileArr.push(_file);
      this.selectFile.nativeElement.value = null;

    } else{
      //Reset data

      this.uploadFileArr = [];
      this.selectFile.nativeElement.value = null;

      //The file not PDF or JPEG
      this._snackBar.open(
        this.translate.instant('add_document.file_type_alert'),
        this.translate.instant('snack_bar.action_button'),
        {
          panelClass:['snack_fileType'],
          duration: 8000,
        });

    }

  }


  removeFile(obj){
    this.uploadFileArr.pop();
   

    if(this.uploadFileArr.length == 0){
      this.submitted = false;
    }
  }

  onBackNavClick(){
    this._location.back();
  }

  onShareWithBroker(){
    this.shareWithBroker =!this.shareWithBroker;

    if(this.shareWithBroker && this.broker_blue_logo){

      this.broker_icon_link = "../assets/icon_broker_round_blue.svg";

    } else if(this.shareWithBroker && this.broker_pink_logo){

      this.broker_icon_link = "../assets/icon_broker_round_pink.svg";

    } else {

      this.broker_icon_link = "../assets/icon_broker_round_default.svg";

    }
  }


  sortBranches(){
    this.branches.sort((a:BranchData, b:BranchData) =>{
      let branchNameA = a.displayNameSEKRETAER.toUpperCase();
      let branchNameB = b.displayNameSEKRETAER.toUpperCase();
    if (branchNameA < branchNameB){
      return -1;
    }else if(branchNameA > branchNameB)
    {
      return 1;
    }else{
      return 0;
    }
    });
  }

  sortCompanies(){
    this.companies.sort((a:CompanyData,b:CompanyData)=>{
      let companyNameA = a.displayName.toUpperCase();
      let companyNameB = b.displayName.toUpperCase();
      if (companyNameA < companyNameB){
        return -1;
      }else if (companyNameA > companyNameB){
        return 1;
      }else {
        return 0;
      }
    });
  }

  sortProducts(){
    this.products.sort((a:ProductData,b:ProductData)=>{
      let productNameA = a.displayNameSEKRETAER.toUpperCase();
      let productNameB = b.displayNameSEKRETAER.toUpperCase();
      if (productNameA < productNameB){
        return -1;
      }else if (productNameA >productNameB){
        return 1;
      }else {
        return 0;
      }
    });
  }
}
