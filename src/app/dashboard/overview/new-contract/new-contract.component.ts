import { UploadFileData } from './../../../models/upload-file.model';
import { FileSizePipe } from './../../../pipes/filesize.pipe';
import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { BranchData } from '../../../models/branch.model';
import { BranchService } from '../../../services/branch.service';
import { CompanyData } from '../../../models/company.model';
import { ProductData } from '../../../models/products.model';
import { CompanyService } from '../../../services/company.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-new-contract',
  templateUrl: './new-contract.component.html',
  styleUrls: ['./new-contract.component.css'],
  providers:[FileSizePipe]
})

export class NewContractComponent implements OnInit {

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
  // ------------------------------

  show: boolean = false;
  formGroup: FormGroup;
  file: File = null;
  fileName: string ="No file chosen";
  uploadFileArr: UploadFileData [] =[];

  doneIcon: string = "../assets/icons8-done-30.png";

  paymentMethodsList = [];
  paymentMethodSettings = {};

  broker_icon_link: string;
  selected_theme:   string;

  shareWithBroker:  boolean;
  broker_blue_logo: boolean;
  broker_pink_logo: boolean;
  
  @ViewChild("selectFile",{static:true}) selectFile:ElementRef;

  branchSettings = {}; 
  companySettings = {};
  productSettings = {};

  none:any = "none";

  constructor(
    private branchService:BranchService, 
    private fileSizePipe:FileSizePipe,
    private _location:Location) { 

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

    } else if(this.selected_theme == 'pink'){
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

    console.log(this.optionSelected);
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
        console.log(this.dataArr);
      },
      error:(e)=>{
        console.log(e);
      },
      complete:()=>{
        //console.info('complete')
      }
    });


    this.paymentMethodsList = [
      { item_id: 1, item_text: 'Yearly' },
      { item_id: 2, item_text: 'Half-yearly' },
      { item_id: 3, item_text: 'Quaterly' },
      { item_id: 4, item_text: 'Monthly' },
    ];

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



  }

      

      // getBranchOptions(){
      //   this.branchService.getBranchName().subscribe(  {
      //   next:(resp) =>{
      //     this.branches =[];
      //   if (Array.isArray(resp)){

      //     let index:number =0;

      //     for(let item of resp){
      //       if (item['name'] == null){
      //         item['name']= '';
      //       }
              
  
      //       let branch:BranchData ={
      //         Branch2MasterId:item['Branch2MasterId'],
      //         displayNameMAXOFFICE:item ['displayNameMAXOFFICE'],
      //         displayNameSEKRETAER:item ['displayNameSEKRETAER'],
      //         displayNameDIMAS:item['displayNameDIMAS'],
      //         name:item['name'],
      //         displayName:item['displayName']
      //       };
      //       this.branches.push(branch);

      //       index ++;
      //     }

      //   }

      //   this.dataArr = this.branches;
      //   console.log(this.dataArr);
      // },
      // error:(e)=>{
      //   console.log(e);
      // },
      // complete:()=>{
      //   //console.info('complete')
      // }
      //   }
      //   );
      // }

   


  onBranchSelected(item:any){
    console.log('----------------------------------------------------------------------------------------------');
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
        console.log(this.companyArr);
        //this.branches = resp;
      },
      error:(e)=>{
        console.log(e);
      },
      complete:()=>{
        //console.info('complete')
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
        console.log(this.productArr);

      },
      error:(e)=>{
        console.log(e);
      },
      complete:()=>{

      }


    });
   
  }
  onCompanySelected(item:any){
    console.log(item);
  }

  onProductSelected(item:any){
    console.log(item);
  }
  onPaymentMethodSelected(item:any){
    console.log(item);
  }

  showContracts(){
    this.showcontract = this.branchSelected;
  }
  
  onSubmit(formData:any){
   console.log(formData);
  }

  onOptionSelected(option:boolean){
    this.optionSelected = option;
    console.log(this.optionSelected);
  }

  getFile(event){
    this.file = event.target.files[0];
   console.log(this.file);

   let _file:UploadFileData ={
    doc_file:this.file,
    fileName :this.file.name,
    fileId : this.uploadFileArr.length +"",

    fileSize :this.fileSizePipe.transform(this.file.size,'MB'),
    
   fileType  :this.file.type
   }
  //  this.uploadFileArr =[];
   this.uploadFileArr.push(_file);
   this.selectFile.nativeElement.value = null;

   if(this.uploadFileArr.length>0){
    this.show = true;
  } else {
    this.show = false;
  }
  }
  deleteFile(event){
   
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

 
  removeFile(obj){
    console.log (obj);
    console.log(this.selectFile.nativeElement.files)
    let removeIndex = obj.fileId;
    this.uploadFileArr = this.uploadFileArr.filter(function(value, index, arr){
    console.log(value);
    return (value.fileName != obj.fileName && value.fileId != obj.docid);
    });

  }

  sortBranches(){
    this.branches.sort((a:BranchData, b:BranchData) =>{
      let branchNameA = a.displayNameSEKRETAER.toUpperCase();
      let branchNameB = a.displayNameSEKRETAER.toUpperCase();
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
