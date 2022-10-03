import { Component, EventEmitter, OnDestroy, OnInit,Input, ViewChild, ElementRef, Injectable } from '@angular/core';
import { Router,Event, ActivatedRoute } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Subscription } from 'rxjs';
import { FolderData } from '../../../models/folder.model';
import { ContractsService } from '../../../services/contracts.service';
import { FoldersService } from '../../../services/folder.service';
import { HttpClient } from '@angular/common/http';
import { FileUploadService } from '../../../services/file-upload.service';
import { UploadFileData } from '../../../models/upload-file.model';
import { FormGroup,FormBuilder,AbstractControl,Validators, FormControl } from '@angular/forms';
import { formatDate } from '@angular/common';
import { FileSizePipe } from '../../../pipes/filesize.pipe';


@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.css'],
  providers:[FileSizePipe]
})
export class AddPageComponent implements OnInit {
  selectedFile:File;
  imagePreview:any;
  fileName:string ="No file chosen";
  showFileName:boolean =false;
  count:number = 0;
  fileUploader:any;

  form:FormGroup;
  submitted = false;

  dropDownIsHidden:boolean= true;
  selectedItems = [];
 
  @ViewChild("selectFile",{static:true}) selectFile:ElementRef;
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
    }[] = [
      { id: '',
        customerAmsidnr: '',
        dataName : '',
        type: ''}
      ];

   shortLink: string = "";
   loading: boolean = false; // Flag variable
   file: File = null;
   successResponse:boolean = true;
   postResponse:any;
   uploadFileArr: UploadFileData [] =[];
   
   dateFormat ="yyyy-MM-dd";
   language="en";
   dropDownForm:FormGroup;

    constructor( private route:ActivatedRoute, private router:Router,private folderService:FoldersService,
private contractService:ContractsService,private http:HttpClient,private fileUploadService: FileUploadService,
private httpClient:HttpClient,private formBuilder:FormBuilder,private fileSizePipe:FileSizePipe,private builder:FormBuilder) {
 

  }

  
  ngOnInit() {
   
    this.dropdownSettings={
      idField: 'id',
      textField: 'dataName',
      singleSelection: true,
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 3,
      searchPlaceholderText: 'Search',
      noDataAvailablePlaceholderText: 'No data available',
      closeDropDownOnSelection: true,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
      
    };

    this.selectedItems = [
      { id: '30007', dataName: 'default selected'  }
    ];

    this.folderSub = this.folderService.getFolders().subscribe({
      next: (resp) => {
        
        if(Array.isArray(resp)){

          for(let item of resp){
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
                  // console.log(cont);
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

            }
          });

        } else {
          //invalid token

        }

      }
    });

    
    this.form =this.formBuilder.group({
      namefile:['',Validators.required],
      date:['',Validators.required],
      fileupload: new FormControl(),
      myItems: [this.selectedItems],
      today:new FormControl(this.formatFormDate(new Date()))
    });

    // this.form = new FormGroup({
    //   fileupload: new FormControl(),
    //   nametags: new FormControl(),
    //   date: new FormControl()
    // });


  }
  formatFormDate(date:Date){
    return formatDate(date, this.dateFormat, this.language);
  }
 
  onMultiSelectClick(){

    let dropDownElement = document.getElementsByClassName('dropdown-list')[0] as HTMLElement;
    this.dropDownIsHidden = (dropDownElement.hidden);

    // console.log(this.selectedItems);
    
    if(this.selectedItems != undefined && this.selectedItems.length>0){
      dropDownElement.hidden = true;
      console.log('hide it !');
    }
  }

  get f():{[key:string]:AbstractControl}{
    return this.form.controls;
  }
 
  onSubmit():void{
    this.submitted = true;
    if (this.form.invalid){
      return;
    }
    console.log(JSON.stringify(this.form.value,null,2));
  }

  getFileName(event){
    this.file = event.target.files[0];
    this.showFileName = true;
    console.log(this.showFileName);
    console.log(this.file);

    let _file:UploadFileData ={
      fileId : this.uploadFileArr.length +"",
      fileName :this.file.name,


      fileSize :this.fileSizePipe.transform(this.file.size,'MB'),
      
      fileType :this.file.type
    }
    this.uploadFileArr = [];
    this.uploadFileArr.push(_file);
    this.selectFile.nativeElement.value = null;
  }

  onUploadFile() {
    this.loading = !this.loading;
    console.log(this.file);
    this.fileUploadService.upload(this.file).subscribe(
        (event: any) => {
            if (typeof (event) === 'object') {

                // Short link via api response
                this.shortLink = event.link;

                this.loading = false; 
                
            }
          
          }
       
    );
        
  }

  removeFile(obj){
    console.log (obj);
    console.log(this.selectFile.nativeElement.files)
    let removeIndex = obj.fileId;
    this.uploadFileArr = this.uploadFileArr.filter(function(value, index, arr){
    console.log(value);
    return (value.fileName != obj.fileName && value.fileId != obj.fileid);
    });

  }

  ngOnDestroy(){
    this.folderSub.unsubscribe();
  }

  onFileUpload(event){
    this.selectedFile = event.target.files[0];
  }
}
