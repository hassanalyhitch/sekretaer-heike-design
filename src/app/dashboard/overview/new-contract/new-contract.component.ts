import { FileSizePipe } from './../../../pipes/filesize.pipe';
import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { BranchData } from '../../../models/branch.model';
import { BranchService } from '../../../services/branch.service';
import { CompanyData } from '../../../models/company.model';
import { CompanyService } from '../../../services/company.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import { UploadFileData } from '../../../models/upload-file.model';




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

branches:BranchData[] = [];
companies:CompanyData[]=[];
name='company';
showcontract:string;
branchSelected:string;
BrokerForm:FormGroup;
optionSelected:boolean=true;
Branch2MasterId:any;
selectedBranches:any;
selectedCompanies:any;
// ------------------------------

show:boolean = false;
formGroup:FormGroup;
file:File = null;
fileName:string ="No file chosen";
uploadFileArr: UploadFileData [] =[];


 
@ViewChild("selectFile",{static:true}) selectFile:ElementRef;
branchSettings ={}; 
companySettings = {};
  constructor(private branchService:BranchService, private fileSizePipe:FileSizePipe) { 

  }

  ngOnInit(): void {
     
this.branchSettings = {
    itemsShowLimit: 1,
    idField: 'Branch2MasterId',
    textField: 'displayNameSEKRETAER',
    singleSelection:false,
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
    singleSelection: false,
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
        console.log(this.dataArr);
      },
      error:(e)=>{
        console.log(e);
      },
      complete:()=>{
        //console.info('complete')
      }
    });
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
   
  }
  onCompanySelected(item:any){
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
  handleChange(event){
    this.show = !this.show;
    this.file = event.target.files[0];
   console.log(this.file);

   let _file:UploadFileData ={
    doc_file:this.file,
    fileName :this.file.name,
    fileId : this.uploadFileArr.length +"",

    fileSize :this.fileSizePipe.transform(this.file.size,'MB'),
    
   fileType  :this.file.type
   }
   this.uploadFileArr =[];
   this.uploadFileArr.push(_file);
   this.selectFile.nativeElement.value = null;
  }
}
