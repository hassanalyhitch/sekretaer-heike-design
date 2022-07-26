import { Component, EventEmitter, OnDestroy, OnInit,Input, ViewChild, ElementRef, Injectable,DoCheck, SimpleChanges } from '@angular/core';
import { Router,Event, ActivatedRoute } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Subscription } from 'rxjs';
import { FolderData } from '../../../models/folder.model';
import { ContractsService } from '../../../services/contracts.service';
import { FoldersService } from '../../../services/folder.service';
import { HttpClient } from '@angular/common/http';
import { FileUploadService } from '../../../services/file-upload.service';
import { UploadFileData } from '../../../models/upload-file.model';
import { FormGroup,FormBuilder,AbstractControl,Validators, FormControl, NgForm } from '@angular/forms';
import { formatDate } from '@angular/common';
import { FileSizePipe } from '../../../pipes/filesize.pipe';
import { ThisReceiver } from '@angular/compiler';
import { FileNameData } from '../../../models/file-name.model';
import { Location } from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.css'],
  providers:[FileSizePipe]
})
export class AddPageComponent implements OnInit, OnDestroy,DoCheck {
  selectedFile:File;
  fileName:string ="No file chosen";
  showFileName:boolean =false;
  count:number = 0;
  fileUploader:any;
  fileDoc:any;

  form:FormGroup;
  submitted: boolean = false;
  dropDownIsHidden:boolean= true;
  selectedItems = [];
  dropDownList = [];
 
  @ViewChild("selectFile",{static:true}) selectFile:ElementRef;
  @ViewChild("addPageForm",{static:true}) addPageForm:NgForm;
  dropdownSettings = {};
  @Input() index:String;
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


  folderSub:Subscription;
  folderArr: any[] = [];
  contractArr: any[] = [];
  dataArr: {
    id: String,
    customerAmsidnr: string,
    dataName : string,
    type: string
  }[] = [];
    

  shortLink: string = "";
  loading: boolean = false; // Flag variable
  file: File = null;
  successResponse:boolean = true;
  postResponse:any;
  uploadFileArr: UploadFileData [] =[];
  
  dateFormat ="yyyy-MM-dd";
  language="en";
  dropDownForm:FormGroup;
  dropdownDisabled:boolean = false;
  

   
  typeSelected:string='';
  myItems =[];
  pickdate:any;

  uploadStatus:boolean =false;
  shareWithBroker:boolean=false;
  status:string = "/assets/icon_broker.svg";
  acceptBroker:boolean = true;
  doneIcon:"/assets/icons8-done-30.png"
  

  constructor( 
    private route:ActivatedRoute, 
    private router:Router,
    private folderService:FoldersService,
    private contractService:ContractsService,
    private http:HttpClient,
    private fileUploadService: FileUploadService,
    private httpClient:HttpClient,
    private formBuilder:FormBuilder,
    private fileSizePipe:FileSizePipe,
    private builder:FormBuilder,
    private location:Location,
    private _snackBar: MatSnackBar,
    private translate:TranslateService ) { }

  
  ngOnInit() {
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


          break;
        }
        default:{
        this.getDropdownData();
    
          break;
        }
      }
      // this.selectedItems = [
      //   { id: '30007', dataName: 'default selected'  }
      // ];
  
    this.form =this.formBuilder.group({
      // namefile:['',Validators.required],
      // date:['',Validators.required],
      // file: new FormControl(),
      // myItems: [this.selectedItems],
      // today:new FormControl(this.formatFormDate(new Date()))
    });

    // this.form = new FormGroup({
    //   fileupload: new FormControl(),
    //   nametags: new FormControl(),
    //   date: new FormControl()
    // });


  }
  addNewFile(fileData:FileNameData, folder_Id: string){

    //console.log(fileData);

    //console.log('addNewFile selected f->'+folder_Id);

    this.fileUploadService.addFolderFile(fileData,folder_Id).subscribe({
      next:(resp)=>{
        //console.log(resp);
        this.submitted = false;
      },
      error:(e)=>{
        this.submitted = false;

        //show snackbar with error message
        this._snackBar.open(this.translate.instant('add_document.file_upload_error'), this.translate.instant('snack_bar.action_button'),{
          panelClass: ['snack_error'],
           duration:2000,
        });

        //return back to previous page
        setTimeout(()=>{
          this.location.back()
        },3500);

      },
      complete:()=>{
        this.submitted = false;
        
        //show snackbar with success message
        this._snackBar.open(this.translate.instant('add_document.file_upload_success'), this.translate.instant('snack_bar.action_button'),{
          panelClass: ['snack_success'],
          duration:2000,
        });

        //return back to previous page
        setTimeout(()=>{
          this.location.back()
        },3500);

      }
    })

  }

  getDropdownData(){
    this.folderSub = this.folderService.getFolders().subscribe({
      next: (resp) => {
        
        if(Array.isArray(resp)){

          for(let item of resp){

            if(item['id'] === undefined || item['id'] === null){
              console.log('problems');
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
          // console.log(this.dataArr.length);
          
          this.dataArr = this.folderArr;

          this.contractService.getContracts().subscribe({
            next:(res) =>{
              
              if(Array.isArray(res)){
                for(let cont of res){

                  if(cont['Amsidnr'] === undefined || cont['Amsidnr'] === null){
                    console.log('problems');
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
                // this.dataArr.push(this.contractArr);
              this.dataArr = this.dataArr.concat(this.contractArr);
                console.log(this.dataArr.length);
                // console.table(this.dataArr);
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

    console.log(selectedItem);

    this.selectedItems.push(selectedItem);

    let dropDownElement = document.getElementsByClassName('dropdown-list')[0] as HTMLElement;
    this.dropDownIsHidden = (dropDownElement.hidden);

    console.log(this.selectedItems);
    
    if(this.selectedItems != undefined && this.selectedItems.length>0){
      dropDownElement.hidden = true;
      console.log('hide it !');
    }

    if (this.selectedItems.length>0){
      for(let x=0;x<this.dataArr.length;x++){
        if(this.selectedItems[0].id == this.dataArr[x].id){
          this.typeSelected = this.dataArr[x].type;
        }
      }
    }

  }

  // get f():{[key:string]:AbstractControl}{
  //   return this.form.controls;
  // }

  // onChange(event){
  //   this.file = event.target.files[0];
  // }
 
 
 onSubmit(fileData:FileNameData){
  fileData.doc_file = this.file;

  this.submitted = true;
  
  switch (this.typeSelected){
    case 'folder':{
     this.addNewFile(fileData,this.selectedItems[0].id)
    
    
      break;
    }
    case 'contract':{
      break;
    }
  }

  console.table(fileData);

  console.table(this.typeSelected);

  console.log('folder id -> ' +this.selectedItems[0].id);

 }

  getFileName(event){
    this.file = event.target.files[0];
    this.showFileName = true;
    console.log(this.showFileName);
    console.log(this.file);

    let _file:UploadFileData ={
      doc_file:this.file,
      fileId : this.uploadFileArr.length +"",
      fileName :this.file.name,


      fileSize :this.fileSizePipe.transform(this.file.size,'MB'),
      
     fileType:this.file.type
     
    }
   if (this.file.type == 'application/pdf' || this.file.type =='!application/pdf') {
   }
   else{
    // alert("file type should be pdf")
    this._snackBar.open(this.translate.instant('add_document.file_type_alert'),this.translate.instant('snack_bar.action_button'),{
      panelClass:['snack_fileType'],
      duration:1800,
    })
    return;
  }
   
    this.uploadFileArr = [];
    this.uploadFileArr.push(_file);
    this.selectFile.nativeElement.value = null;
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
  onShareWithBroker(){
    // this.shareWithBroker =!this.shareWithBroker;
    this.acceptBroker = !this.acceptBroker;
    this.status = this.acceptBroker ? "/assets/icon_broker.svg": "/assets/broker_pink.svg";
  }

  ngDoCheck():void{

    // console.log('selectedItems.length> '+this.selectedItems.length);
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
}
