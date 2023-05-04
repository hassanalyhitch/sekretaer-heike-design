import { FileNameData } from './../../../models/file-name.model';
import { Component, OnDestroy, OnInit,Input, ViewChild, ElementRef,DoCheck} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FolderData } from '../../../models/folder.model';
import { ContractsService } from '../../../services/contracts.service';
import { FoldersService } from '../../../services/folder.service';
import { FileUploadService } from '../../../services/file-upload.service';
import { UploadFileData } from '../../../models/upload-file.model';
import { FormGroup,FormBuilder, NgForm } from '@angular/forms';
import { formatDate } from '@angular/common';
import { FileSizePipe } from '../../../pipes/filesize.pipe';
import { Location } from '@angular/common';
import { MatSnackBar} from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { MatChipInputEvent, MatChipList } from '@angular/material/chips';
import { ENTER, COMMA,SPACE} from '@angular/cdk/keycodes';
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
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.css'],
  providers:[
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    FileSizePipe]
})
export class AddPageComponent implements OnInit, OnDestroy,DoCheck {
  TAGS:string = 'AddPageComponent';
 
  fileUploader: any;
  fileDoc: any;
  postResponse: any;
  pickdate: any;

  dataArr: {
    id: String,
    customerAmsidnr: string,
    dataName : string,
    type: string
  }[] = [];

  folders: FolderData = <FolderData>{
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

  dropdownSettings = {};

  documentName:string;
  broker_icon_link: string;
  selected_theme:   string;
  typeSelected: string='';
  shortLink: string = "";
  fileName: string = "No file chosen";
  doneIcon: string = "../assets/icons8-done-30.png";

  folderArr: any[] = [];
  contractArr: any[] = [];
  myItems = [];
  selectedItems = [];
  dropDownList = [];
  uploadFileArr: UploadFileData [] =[];
  chips: string[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA ,SPACE];


  showFileName:     boolean =false;
  submitted:        boolean = false;
  dropDownIsHidden: boolean = true;
  addOnBlur:        boolean = true;
  loading:          boolean = false; // Flag variable
  successResponse:  boolean = true;
  dropdownDisabled: boolean = false;
  uploadStatus:     boolean = false;
  enableShareWithBrokerIcon: boolean;
  shareWithBroker:  boolean;
  broker_blue_logo: boolean;
  broker_pink_logo: boolean;


  selectedFile:File;
    
  form: FormGroup;
  @Input() index: String;
  folderSub: Subscription;

  file: File = null;
  
  dateFormat = "yyyy-MM-dd";
  language = "en";
  dropDownForm: FormGroup;

  count: number = 0;

  none:any = "none";

  @ViewChild("selectFile",{static:true}) selectFile:ElementRef;
  @ViewChild("addPageForm",{static:true}) addPageForm:NgForm;
  @ViewChild('chiplist') chipList:MatChipList;
  
  constructor( 
    private route:ActivatedRoute, 
    private folderService:FoldersService,
    private contractService:ContractsService,
    private fileUploadService: FileUploadService,
    private fileSizePipe:FileSizePipe,
    private location:Location,
    private _snackBar: MatSnackBar,
    private translate:TranslateService ) { 

      this.broker_icon_link = "../assets/icon_broker_round_default.svg"; // default round broker icon
      this.selected_theme   = "";

      this.broker_blue_logo = false;
      this.broker_pink_logo = false;
      this.shareWithBroker  = false;

      this.enableShareWithBrokerIcon = false;
    }

  
  ngOnInit() {

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

      switch (this.route.snapshot.params['type']){
        case "folder": {
          let selectedItem = {
            id:this.folderService.selectedFolder.id,
            dataName:this.folderService.selectedFolder.folderName
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

          this.dropdownDisabled = false;

          break;
        }
        case "contract" :{
          let selectedItem = {
            id: this.contractService.selectedContract.details.Amsidnr,
            dataName:this.contractService.selectedContract.details.name
          };
          let contract:any = {
            id:this.contractService.selectedContract.details.Amsidnr,
            CustomerAmsidnr:this.contractService.selectedContract['CustomerAmsidnr'],
            dataName: this.contractService.selectedContract['name'],
            type:'contract'
          };

          this.dataArr.push(contract);

          this.selectedItems.push(selectedItem);
          this.typeSelected ='contract';

          this.dropdownDisabled =false;


          break;
        }
        default:{
        this.getDropdownData();
    
          break;
        }
      }
     
  }

  addNewFile(fileData:FileNameData, folder_Id: string,editedDocName:string){

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
             duration:5000,
          });
  
          //return back to previous page
          setTimeout(()=>{
            this.location.back()
          },5000);
  
        },
        complete:()=>{
          this.submitted = false;
          
          //show snackbar with success message
          this._snackBar.open(this.translate.instant('add_document.file_upload_success'), this.translate.instant('snack_bar.action_button'),{
            panelClass: ['snack_success'],
            duration:5000,
          });
  
          //return back to previous page
          setTimeout(()=>{
            this.location.back()
          },5000);
  
        }
      })
  
    }
   
  }

  addContractDocument(fileData:FileNameData,contractId:string,editedDocName:string){

    let tags:string = '';

    for (let tag of this.chips){
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
             duration:5000,
          });
           //return back to previous page
           setTimeout(()=>{
            this.location.back()
          },5000);
  
        },
        complete:()=>{
          this.submitted = false;
  
          this._snackBar.open(this.translate.instant('add_document.file_upload_success'), this.translate.instant('snack_bar.action_button'),{
            panelClass: ['snack_success'],
            duration:5000,
          });
  
            //return back to previous page
            setTimeout(()=>{
              this.location.back()
            },5000);
    
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

  formatFormDate(date:Date){
    return formatDate(date, this.dateFormat, this.language);
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

    if(this.typeSelected == 'folder'){
      this.enableShareWithBrokerIcon = false;
    } else if(this.typeSelected == 'contract'){
      this.enableShareWithBrokerIcon = true;
    }

  }

 
 onSubmit(){
  let fileData:FileNameData = {
      doc_file:this.uploadFileArr[0].doc_file
  }
 
  let editedDocName = this.documentName;
  
  this.submitted = true;
  
  switch (this.typeSelected){
    case 'folder':{
      this.addNewFile(fileData,this.selectedItems[0].id,editedDocName);
      break;
    }
    case 'contract':{
      this.addContractDocument(fileData,this.selectedItems[0].id,editedDocName);
      break;
    }
  }


 }

 getFileName(event){
  this.file = event.target.files[0];


  if (this.file.type =='application/pdf' || this.file.type =='image/jpeg') {
    this.showFileName = true;
    

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

  }else{

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
        this.translate.instant('contract_detail.shared_with_broker'),
        this.translate.instant('snack_bar.action_button'),{
          duration: 8000,
          panelClass:['snack_success'],
        }
      );

    } else if(this.shareWithBroker && this.broker_pink_logo){

      this.broker_icon_link = "../assets/icon_broker_round_pink.svg";

      // display snackbar message
      this._snackBar.open(
        this.translate.instant('contract_detail.shared_with_broker'),
        this.translate.instant('snack_bar.action_button'),{
          duration: 8000,
          panelClass:['snack_success'],
        }
      );

    } else {

      this.broker_icon_link = "../assets/icon_broker_round_default.svg";

      // display snackbar message
      this._snackBar.open(
        this.translate.instant('contract_detail.unshared_with_broker'),
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
    // this.folderSub.unsubscribe();
  }

  onFileUpload(event){
    this.selectedFile = event.target.files[0];
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
