import { FileNameData } from './../../models/file-name.model';
import { Component, OnDestroy, OnInit,Input, ViewChild, ElementRef,DoCheck, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { FolderData } from '../../models/folder.model';
import { ContractsService } from '../../services/contracts.service';
import { FoldersService } from '../../services/folder.service';
import { FileUploadService } from '../../services/file-upload.service';
import { UploadFileData } from '../../models/upload-file.model';
import {  NgForm } from '@angular/forms';
import { FileSizePipe } from '../../pipes/filesize.pipe';
import { MatSnackBar} from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER, COMMA ,SPACE} from '@angular/cdk/keycodes';
import { MAT_DATE_FORMATS } from '@angular/material/core';


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
  selector: 'app-add-page-modal',
  templateUrl: './add-page-modal.component.html',
  styleUrls: ['./add-page-modal.component.scss'],
  providers:[
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    FileSizePipe]
})

export class AddPageModalComponent implements OnInit, OnDestroy,DoCheck {

  TAGS:string = 'AddPageModalComponent';


  submitted: boolean = false;
  dropDownIsHidden:boolean= true;
  successResponse:boolean = true;
  loading: boolean = false; // Flag variable
  dropdownDisabled:boolean = false;
  enableShareWithBrokerIcon: boolean;
  addOnBlur:boolean = true;

  shareWithBroker:  boolean;
  broker_blue_logo: boolean;
  broker_pink_logo: boolean;


  documentName:string;
  broker_icon_link: string;
  selected_theme:   string;
  shortLink: string = "";
  typeSelected:string='';
  doneIcon: string = "../assets/icons8-done-30.png";

  fromModalInput_contract_name: string;
  fromModalInput_contract_id: string;

  fromModalInput_document_type: string;

  fromModalInput_folder_name: string;
  fromModalInput_folder_id: string;

  @Input() index:String;

  dropdownSettings = {};

  dataObj:{
    contractName: string,
    contractId: string,
    document_type: string,
    folderName: string,
    folderId: string
  };

  folders:FolderData =<FolderData>{
    id : "",
    loginId : "",
    customerAmsidnr : "",
    ownerFolderId : "",
    folderName : "",
    createTime :"",
    createdAt : "",
    subFolders : [],

    isSelected:false
  };

  dataArr: {
    id: String,
    customerAmsidnr: string,
    dataName : string,
    type: string
  }[] = [];

  uploadFileArr: UploadFileData [] =[];
  folderArr: any[] = [];
  contractArr: any[] = [];
  selectedItems = [];
  dropDownList = [];
  myItems =[];
  chips: string[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA ,SPACE];

    
  folderSub:Subscription;

  file: File = null;
  
  postResponse:any;
  
  language="en";

  none:any = "none";

  selectedFile:File;
  fileName:string ="No file chosen";
  count:number = 0;


  @ViewChild("selectFile",{static:true}) selectFile:ElementRef;
  @ViewChild("addPageForm",{static:true}) addPageForm:NgForm;
  

  constructor( 
    @Inject(MAT_DIALOG_DATA)public data:any,
    private folderService:FoldersService,
    private contractService:ContractsService,
    private fileUploadService: FileUploadService,
    private fileSizePipe:FileSizePipe,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AddPageModalComponent>,
    private translate:TranslateService ) { 

      this.broker_icon_link = "../assets/icon_broker_round_default.svg"; // default round broker icon
      this.selected_theme   = "";

      this.broker_blue_logo = false;
      this.broker_pink_logo = false;
      this.shareWithBroker  = false;

      this.dataObj = JSON.parse(this.data);

      this.fromModalInput_document_type = this.dataObj.document_type;

      this.enableShareWithBrokerIcon = false;

      if(this.fromModalInput_document_type == "folder"){
        this.fromModalInput_folder_name = this.dataObj.folderName;
        this.fromModalInput_folder_id = this.dataObj.folderId;
        this.enableShareWithBrokerIcon = false;

      } else if(this.fromModalInput_document_type == "contract"){
        this.fromModalInput_contract_name = this.dataObj.contractName;
        this.fromModalInput_contract_id = this.dataObj.contractId;
        this.enableShareWithBrokerIcon = true;
      }
    }

  
  ngOnInit() {

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

    this.dropdownSettings = {
      idField:'id',
      textField:'dataName',
      singleSelection:false,
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true,
      limitSelection: 1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 1,
      searchPlaceholderText: 'Search',
      noDataAvailablePlaceholderText: 'No data available',
      closeDropDownOnSelection: true,
      showSelectedItemsAtTop: false,
      defaultOpen:false,
    };

   
  // condition for shareWithBroker button
    if(this.fromModalInput_document_type == 'folder'){

      let selectedItem = {
        id:this.fromModalInput_folder_id,
        dataName:this.fromModalInput_folder_name
      };

      let folder: any = {
        id: this.folderService.selectedFolder['id'],
        customerAmsidnr:this.folderService.selectedFolder['customerAmsidnr'],
        dataName :this.folderService.selectedFolder['folderName'],
        type: 'folder'
      };

      this.dataArr.push(folder);
      
      
      this.selectedItems.push(selectedItem);
      this.typeSelected = 'folder';

      this.dropdownDisabled = true;

    } else if(this.fromModalInput_document_type == 'contract'){

      let selectedItem ={
        id:this.fromModalInput_contract_id,
        dataName:this.fromModalInput_contract_name
      };

      let contract:any ={
        id:this.fromModalInput_contract_id,
        dataName:this.fromModalInput_contract_name,
        type:'contract'
      };

      this.dataArr.push(contract);

      this.selectedItems.push(selectedItem);
      this.typeSelected ='contract';

      this.dropdownDisabled = true;

    }

  }

  uploadFolderDocument(fileData:FileNameData, folder_Id: string,editedDocName:string){

    let tags:string = '';
    for(let tag of this.chips){
      tags += tag + " ";
    }

    editedDocName = this.documentName;

    if (this.file && this.documentName){
      this.fileUploadService.addFolderFile(fileData,folder_Id,tags,editedDocName).subscribe({
        next:(resp)=>{
          this.submitted = false;
        },
        error:(e)=>{
          this.submitted = false;
  
          //show snackbar with error message
          this._snackBar.open(this.translate.instant('add_document.file_upload_error'), this.translate.instant('snack_bar.action_button'),{
            panelClass: ['snack_error'],
             duration: 8000,
          });
  
          //close dialog
          this.closeDialog();
  
        },
        complete:()=>{
          this.submitted = false;
          
          //show snackbar with success message
          this._snackBar.open(this.translate.instant('add_document.file_upload_success'), this.translate.instant('snack_bar.action_button'),{
            panelClass: ['snack_success'],
            duration: 8000,
          });
  
         //close dialog
         this.closeDialog();
  
        }
      });
    }
  }


  
  addContractDocument(fileData:FileNameData,contractId:string,editedDocName:string){

    let tags:string = '';
    for(let tag of this.chips){
      tags += tag + " ";
    }

    editedDocName = this.documentName;

    if (this.file && this.documentName){
      this.fileUploadService.addContractFile(fileData,contractId,tags,editedDocName).subscribe({
        next:(resp)=>{
          this.submitted = false;
        },
        error:(e)=>{
          this.submitted = false;
  
            //show snackbar with error message
            this._snackBar.open(this.translate.instant('add_document.file_upload_error'), this.translate.instant('snack_bar.action_button'),{
              panelClass: ['snack_error'],
               duration: 8000,
            });
    
            //close dialog
            this.closeDialog();
          
        },
        complete:()=>{
          this.submitted = false;
  
            //show snackbar with success message
            this._snackBar.open(this.translate.instant('add_document.file_upload_success'), this.translate.instant('snack_bar.action_button'),{
              panelClass: ['snack_success'],
              duration: 8000,
            });
    
           //close dialog
           this.closeDialog();
    
        }
  
      });
    }
  }

  getDropdownData(){
    this.folderSub = this.folderService.getFolders().subscribe({
      next: (resp) => {
        
        if(Array.isArray(resp)){

          for(let item of resp){

            if(item['id'] === undefined || item['id'] === null){
            }
            //
            let folder: any = {
              id: item['id'],
              customerAmsidnr:  item['customerAmsidnr'],
              dataName : item['folderName'],
              type: 'folder'
  
            };
              this.folderArr.push(folder);   
          }
         
          this.dataArr = this.folderArr;

          this.contractService.getContracts().subscribe({
            next:(res) =>{
              
              if(Array.isArray(res)){
                for(let cont of res){

                  if(cont['Amsidnr'] === undefined || cont['Amsidnr'] === null){

                  }
                  //
                  let contract: any = {
                    id: cont['Amsidnr'],
                    customerAmsidnr:  cont['CustomerAmsidnr'],
                    dataName : cont['Risk'],
                    type : 'contract'
                    
                  };
                  this.contractArr.push(contract);
                  
                } 
              
              this.dataArr = this.dataArr.concat(this.contractArr);
               
              }

            },
            complete:()=>{
              
            }

          });

        } else {
          //invalid token

        }

      }
    });
  }

 
 
  onItemSelected(selectedItem:any){

    this.selectedItems.push(selectedItem);

    let dropDownElement = document.getElementsByClassName('dropdown-list')[0] as HTMLElement;
    this.dropDownIsHidden = (dropDownElement.hidden);

    if(this.selectedItems != undefined && this.selectedItems.length>0){
      dropDownElement.hidden = true;
    }

    if (this.selectedItems.length>0){
      for(let x=0;x<this.dataArr.length;x++){
        if(this.selectedItems[0].id == this.dataArr[x].id){
          this.typeSelected = this.dataArr[x].type;
        }
      }
    }

  }


 onSubmit(){

    let fileData:FileNameData = {
        doc_file:this.uploadFileArr[0].doc_file
    }

    let editedDocName = this.documentName;

    switch (this.typeSelected){
      case 'folder':{

        // Upload to folders
        this.submitted = true;

        this.uploadFolderDocument(fileData,this.selectedItems[0].id,editedDocName);
      
        break;
      }
      case 'contract':{
        // Upload to contracts

        this.submitted = true;

        this.addContractDocument(fileData,this.selectedItems[0].id,editedDocName);

        break;
      }
    }

 }

  getFileName(event){

    this.file = event.target.files[0];
    
    if (this.file.type =='application/pdf' || this.file.type =='image/jpeg') {

      let _file:UploadFileData ={
        doc_file:this.file,
        fileId : this.uploadFileArr.length +"",
        fileName :this.documentName,
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
  
  onShareWithBroker(){
    this.shareWithBroker =!this.shareWithBroker;

    if(this.shareWithBroker && this.broker_blue_logo){

      this.broker_icon_link = "../assets/icon_broker_round_blue.svg";

      // display snackbar message
      this._snackBar.open(
        this.translate.instant('add_document.share_with_broker'),
        this.translate.instant('snack_bar.action_button'),{
          duration: 8000,
          panelClass:['snack_success'],
        }
      );

    } else if(this.shareWithBroker && this.broker_pink_logo){

      this.broker_icon_link = "../assets/icon_broker_round_pink.svg";

      // display snackbar message
      this._snackBar.open(
        this.translate.instant('add_document.share_with_broker'),
        this.translate.instant('snack_bar.action_button'),{
          duration: 8000,
          panelClass:['snack_success'],
        }
      );

    } else {

      this.broker_icon_link = "../assets/icon_broker_round_default.svg";

      // display snackbar message
      this._snackBar.open(
        this.translate.instant('add_document.un_share_with_broker'),
        this.translate.instant('snack_bar.action_button'),{
          duration: 8000,
          panelClass:['snack_error'],
        }
      );

    }
    
  }

  ngDoCheck():void{

    if (this.selectedItems.length>0){
      for(let x=0;x<this.dataArr.length;x++){
        if(this.selectedItems[0].id == this.dataArr[x].id){
          this.typeSelected = this.dataArr[x].type;
        }
      }
    }
  
  }

  ngOnDestroy(){
   
  }

  onFileUpload(event){
    this.selectedFile = event.target.files[0];
  }

  closeDialog(){
    this.dialogRef.close();
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.chips.push(value);
      event.chipInput!.clear();
    }
  }

  removeChip(chip: string): void {
    const index = this.chips.indexOf(chip);

    if (index >= 0) {
      this.chips.splice(index, 1);
    }
  }
}

