import { Component, EventEmitter, OnDestroy, OnInit,Input, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { Router,Event, ActivatedRoute } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Subscription } from 'rxjs';
import { FolderData } from '../../../models/folder.model';
import { ContractsService } from '../../../services/contracts.service';
import { FoldersService } from '../../../services/folder.service';
import { HttpClient } from '@angular/common/http';
import { FileUploadService } from '../../../services/file-upload.service';
import { compileClassMetadata } from '@angular/compiler';
import { UploadFileData } from '../../../models/upload-file.model';



@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.css']
})
export class AddPageComponent implements OnInit {
  selectedFile:File;
  imagePreview:any;
  onFileUpload(event){
    this.selectedFile = event.target.files[0];
  }
  fileName:string ="No file chosen";
  showFileName:boolean =false;
  count:number = 0;
  fileUploader:any;
 
    // const reader = new FileReader();
    // reader.onload =() =>{
    //   this.imagePreview = reader.result;
    // };
    // reader.readAsDataURL(this.selectedFile);
  
  
  @ViewChild("selectFile",{static:true}) selectFile:ElementRef;
   dropdownSettings:IDropdownSettings={};
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
   dataArr: any[] = [];

   shortLink: string = "";
   loading: boolean = false; // Flag variable
   file: File = null;
   successResponse:boolean = true;
   postResponse:any;

   uploadFileArr: UploadFileData [] =[];

   constructor( private route:ActivatedRoute, private router:Router,private folderService:FoldersService,
    private contractService:ContractsService,private http:HttpClient,private fileUploadService: FileUploadService,private httpClient:HttpClient) {


  }




  ngOnInit() {
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
          console.log(this.dataArr.length);
          
          this.dataArr = this.folderArr;

          this.contractService.getContracts().subscribe({
            next:(res) =>{
              
              if(Array.isArray(res)){
                for(let cont of res){
                  console.log(cont);
                  //
                  let contract: any = {
                    id: cont['Contractnumber'],
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

    this.dropdownSettings={
      idField: 'id',
      textField: 'dataName',
      allowSearchFilter: true,
      limitSelection: 1,
      enableCheckAll:false
    };
    
  
  
  }
  getFileName(event){
    this.file = event.target.files[0];
    this.showFileName = true;
    console.log(this.showFileName);
    console.log(this.file);

    let _file:UploadFileData ={
      fileId : this.uploadFileArr.length +"",
      fileName :this.file.name,
      fileSize :this.file.size/1000000+ "MB",
      fileType :this.file.type
    }

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
  onSelect(folder:FolderData){
    // this.featureSelected.emit(feature);
  }
}
