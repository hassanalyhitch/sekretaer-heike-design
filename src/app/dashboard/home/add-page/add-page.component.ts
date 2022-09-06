import { Component, EventEmitter, OnDestroy, OnInit,Input, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { Router,Event, ActivatedRoute } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Uploader } from '@syncfusion/ej2-inputs';
import { Subscription } from 'rxjs';
import { FolderData } from '../../../models/folder.model';
import { FoldersService } from '../../../services/folder.service';
import { ContractsService } from '../../../services/contracts.service';


@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.css']
})
export class AddPageComponent implements OnInit {
  
  @ViewChild("fileDropRef",{static:true}) fileDropRef:ElementRef;
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

  fileName:string = "No file chosen";
  showFileName:boolean = false;
  count:number = 0;

  constructor( private route:ActivatedRoute, private router:Router,private folderService:FoldersService,private contractService:ContractsService) {


  }


  getFileName () {
    // let fileInput = document.getElementById('fileDropRef') as HTMLInputElement ;
    let fileInput = this.fileDropRef.nativeElement as HTMLInputElement ;
    this.fileName = fileInput.files.item(0).name;
    this.fileName == "No file chosen" ? this.showFileName = false : this.showFileName = true;

    // this.count ++;
    // console.log (this.count+ " " +this.showFileName+ "= filename => " +this.fileName);
    // alert('FileName: ' + fileInput.files.item(0).name+' FileType: ' + fileInput.files.item(0).type+' FileSize: ' + fileInput.files.item(0).size);
  };

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
                for(let item of res){
                  //
                  let contract: any = {
                    id: item['id'],
                    customerAmsidnr:  item['CustomerAmsidnr'],
                    dataName : item['Risk'],
                    type : 'contract'
                    
                  };
                  this.contractArr.push(contract);
                  
                } 
                // this.dataArr.push(this.contractArr);
              this.dataArr = this.dataArr.concat(this.contractArr);
                console.log(this.dataArr.length);
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
      allowSearchFilter: true
    };
    
    let uploadObject: Uploader = new Uploader({
      asyncSettings: {
          saveUrl: 'https://testapi.maxpool.de/api/v1/sekretaer/myfolders',
          removeUrl: 'https://testapi.maxpool.de/api/v1/sekretaer/myfolders'
      }
    });
  
    // render initialized Uploader
    uploadObject.appendTo('#fileDropRef');
  }


  
 

  ngOnDestroy(){
    this.folderSub.unsubscribe();
  }
  onSelect(folder:FolderData){
    // this.featureSelected.emit(feature);
  }
}
