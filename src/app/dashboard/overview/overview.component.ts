import { LoadingService } from '../../services/loading.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ContractData } from '../../models/contract.model';
import { FolderData } from '../../models/folder.model';
import { ContractsService } from '../../services/contracts.service';
import { FoldersService } from '../../services/folder.service';
import { NewFolderComponent } from '../new-folder/new-folder.component';
import { AddPageModalComponent } from '../add-page-modal/add-page-modal.component';
import { RenameFolderComponent } from '../rename-folder/rename-folder.component';
import { RenameContractComponent } from '../rename-contract/rename-contract.component';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  subsetArr:ContractData[] = [];
  allContractsArr:ContractData[] = [{
    id: 0,
    details: {
      Amsidnr: "",
      CustomerAmsidnr: "",
      InsuranceId: "",
      ContractNumber: "",
      Company: "",
      StartDate: "",
      EndDate: "",
      YearlyPayment: "",
      Paymethod: "",
      Branch: "",
      Risk: "",
      docs: [],
      name: "",
      productSek: "",
      tarif: "",
      isFav: 1,
      favoriteId: ""
    },
    isSelected: false
  },
  {
    id: 0,
    details: {
      Amsidnr: "",
      CustomerAmsidnr: "",
      InsuranceId: "",
      ContractNumber: "",
      Company: "",
      StartDate: "",
      EndDate: "",
      YearlyPayment: "",
      Paymethod: "",
      Branch: "",
      Risk: "",
      docs: [],
      name: "",
      productSek: "",
      tarif: "",
      isFav: 1,
      favoriteId: ""
    },
    isSelected: false
  },
  {
    id: 0,
    details: {
      Amsidnr: "",
      CustomerAmsidnr: "",
      InsuranceId: "",
      ContractNumber: "",
      Company: "",
      StartDate: "",
      EndDate: "",
      YearlyPayment: "",
      Paymethod: "",
      Branch: "",
      Risk: "",
      docs: [],
      name: "",
      productSek: "",
      tarif: "",
      isFav: 1,
      favoriteId: ""
    },
    isSelected: false
  }
];

  foldersArr: FolderData[] = [{
    id :  "",
    loginId :  "",
    customerAmsidnr :  "",
    ownerFolderId :  "",
    folderName :  "",
    createTime :  "",
    createdAt :  "",
    subFolders : [],
    docs: [],
    isFavorite: 0,
    favoriteId: "",
    isSelected:false
  },
  {
    id :  "",
    loginId :  "",
    customerAmsidnr :  "",
    ownerFolderId :  "",
    folderName :  "",
    createTime :  "",
    createdAt :  "",
    subFolders : [],
    docs: [],
    isFavorite: 0,
    favoriteId: "",
    isSelected:false
  },
  {
    id :  "",
    loginId :  "",
    customerAmsidnr :  "",
    ownerFolderId :  "",
    folderName :  "",
    createTime :  "",
    createdAt :  "",
    subFolders : [],
    docs: [],
    isFavorite: 0,
    favoriteId: "",
    isSelected:false
  }
];

  folder:FolderData;
  contract:ContractData;

  folderSubsetArr: FolderData[] = [];

  showCard2:boolean = false;
  showCard1:boolean = false;

  showFolderCard2:boolean = false;
  showFolderCard1:boolean = false;

  collapsed:boolean = true;
  collapsedFolders:boolean = true;

  sortContractTitleByAsc:boolean = true;
  ascendContractTitle:ContractData[] =[];
  descendContractTitle:ContractData[]= [];

  sortContractDateByAsc:boolean = true;
  ascendContractDate:ContractData[] =[];
  descendContractDate:ContractData[] =[];

  sortFolderTitleByAsc:boolean = true;
  ascendFolderTitle:FolderData[]=[];
  descendFolderTitle:FolderData[] =[];
 
 
  sortFolderDateByAsc:boolean = true;
  ascendFolderDate:FolderData[] =[];
  descendFolderDate:FolderData[] =[];

  constructor(private router:Router, private contractService: ContractsService, 
    private folderService: FoldersService,
    private matDialog: MatDialog,
    private loadingService:LoadingService
    ) {
      this.loadingService.emitIsLoading(true);
     }

  ngOnInit() {
   
    this._init();
  }

  _init(){
    this.contractService.getContracts().subscribe({
      next: ()=>{
      
        this.allContractsArr = this.contractService.userContractsArr;

        this.subsetArr = [];
        if(this.contractService.userContractsArr.length>3){
          for(let i=3; i<this.contractService.userContractsArr.length; i++){
            this.subsetArr.push(this.contractService.userContractsArr[i]);
          }
        }
        // console.log(this.allContractsArr);
        this.allContractsArr.length>1 ? this.showCard2 = true: this.showCard2 = false;
        this.allContractsArr.length>2 ? this.showCard1 = true: this.showCard1 = false;
      },
      complete:()=>{
        this.folderService.getFolders().subscribe({
          next: (resp)=>{
            this.foldersArr = this.folderService.userFolderArr;

          for(let i=0;i<this.foldersArr.length;i++){
            this.foldersArr[i].swipedLeft = false;
          }

            this.folderSubsetArr = [];
            if(this.foldersArr.length>3){
              for(let i=3; i<this.foldersArr.length; i++){
                this.folderSubsetArr.push(this.foldersArr[i]);
              }
            }
            // console.log(this.foldersArr);
            this.foldersArr.length>1 ? this.showFolderCard2 = true: this.showFolderCard2 = false;
            this.foldersArr.length>2 ? this.showFolderCard1 = true: this.showFolderCard1 = false;
          },
          complete:()=>{
            this.loadingService.emitIsLoading(false);
          }
        });
       
      }
      
    });


  }

  onCardClick(clickedContract){
    
    this.contractService.emitSelectedFolder(clickedContract);
    this.router.navigate(['dashboard/overview/contract-detail', { id: clickedContract.details.Amsidnr }]);
    
  }
  onFolderCardClick(clickedFolder){

    this.folderService.emitSelectedFolder(clickedFolder);
    this.router.navigate(['dashboard/overview/folder-detail', { id: clickedFolder.id }]);
  }

  collapse(){
    if(this.collapsed){
      this.onDefaultInsuranceCardClick();
    } else {

      document.getElementById("cards").setAttribute("style","min-height:230px;height:230px;");
      document.getElementById("extra-cards").setAttribute("style","transition: opacity 0s;");
      setTimeout(()=>{this.collapsed = true;},200);
    }
    
  }
  collapseFolders(){

    if(this.collapsedFolders){
      this.onDefaultFolderCardClick();
    } else {

      document.getElementById("folders").setAttribute("style","min-height:230px;height:230px;");
      document.getElementById("extra-folders").setAttribute("style","transition: opacity 0s;");
      setTimeout(()=>{this.collapsedFolders = true;},200);
    }
  }

  onDefaultInsuranceCardClick(){

    if(this.collapsed===false){

      this.contractService.emitSelectedFolder(this.allContractsArr[0]);
      this.router.navigate(['dashboard/overview/contract-detail', { id: this.allContractsArr[0].details.Amsidnr }]);
    } else {

        
      if(this.allContractsArr.length==1){
        //show detail page
        this.contractService.emitSelectedFolder(this.allContractsArr[0]);
        this.router.navigate(['dashboard/overview/contract-detail', { id: this.allContractsArr[0].details.Amsidnr }]);

      } else if(this.allContractsArr.length==2){
        //expand 2
        this.collapsed = false;
        document.getElementById("cards").setAttribute("style","min-height:380px;height:380px;");
        setTimeout(()=>{
          document.getElementById("extra-cards").setAttribute("style","transition: all 0.4s;opacity:1;");
        },10);
        
      } else {
        //expand all
        this.collapsed = false;
        document.getElementById("cards").setAttribute("style","min-height:570px;height:570px;");
        setTimeout(()=>{
          document.getElementById("extra-cards").setAttribute("style","transition: all 0.4s;opacity:1;");
        },10);
      }

    }

  }
  
  onDefaultFolderCardClick(){

    if(this.collapsedFolders===false){

      this.folderService.emitSelectedFolder(this.foldersArr[0]);
      this.router.navigate(['dashboard/overview/folder-detail', { id: this.foldersArr[0].id }]);
    } else {

        
      if(this.foldersArr.length==1){
        //show detail page
        this.folderService.emitSelectedFolder(this.foldersArr[0]);
        this.router.navigate(['dashboard/overview/folder-detail', { id: this.foldersArr[0].id }]);

      } else if(this.foldersArr.length==2){
        //expand 2
        this.collapsedFolders = false;
        document.getElementById("folders").setAttribute("style","min-height:380px;height:380px;");
        setTimeout(()=>{
          document.getElementById("extra-folders").setAttribute("style","transition: all 0.4s;opacity:1;");
        },10);
        
      } else {
        //expand all
        this.collapsedFolders = false;
        document.getElementById("folders").setAttribute("style","min-height:570px;height:570px;");
        setTimeout(()=>{
          document.getElementById("extra-folders").setAttribute("style","transition: all 0.4s;opacity:1;");
        },10);
      }

    }
  }
 
  addNewFolder(){
    const dialogConfig = new MatDialogConfig();
    
    let passdata:string = '{"parentFolderId": 0 }';
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = false;
    dialogConfig.id = 'newfolder-modal-component';
    //dialogConfig.height ='210px';
    dialogConfig.width = '350px';
  
    dialogConfig.panelClass ='bg-dialog-folder';
    dialogConfig.data = passdata;
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(NewFolderComponent, dialogConfig);
    
    this.matDialog.getDialogById('newfolder-modal-component').afterClosed().subscribe({
      next:()=>{

        //refresh folder list
        this._init();
      }
    });
  }
  
  onAddContract(){
    this.router.navigate(['dashboard/overview/new-contract']);
  }
  
  sortByContractTitle(){
    if(this.sortContractTitleByAsc){
      this.ascendContractTitle = this.allContractsArr.sort((a,b) =>a.details.name.localeCompare(b.details.name));

      this.allContractsArr =this.ascendContractTitle;
      if(this.allContractsArr.length>3){
        this.subsetArr = [];
        for(let i=3; i<this.allContractsArr.length; i++){
          this.subsetArr.push(this.allContractsArr[i]);
        }
      }
    this.sortContractTitleByAsc = !this.sortContractDateByAsc;
    }else
    {
      this.descendContractTitle = this.allContractsArr.sort((a,b) =>a.details.name.localeCompare(b.details.name)).reverse();
      this.allContractsArr = this.descendContractTitle;
      if(this.allContractsArr.length>3){
        this.subsetArr = [];
        for(let i=3; i<this.allContractsArr.length; i++){
          this.subsetArr.push(this.allContractsArr[i]);
        }
      }
      this.sortContractTitleByAsc = !this.sortContractTitleByAsc;
    }

  }

  sortByContractDate(){
    if (this.sortContractDateByAsc){
      this.allContractsArr.sort ((a,b)=>{
        try{
          let dateA = new Date(a.details.EndDate);
          let dateB = new Date(b.details.EndDate);

          if ((dateA instanceof Date && !isNaN(dateA.getTime()))&&(dateB instanceof Date && !isNaN(dateB.getTime()))) {
            //valid date object
            return dateA >= dateB ? 1 : -1; 
          } else {
            console.log("invalid date");
          }
        }
        catch(e){
          console.log(e);
          
        }
      });
      this.subsetArr =[];
      if (this.allContractsArr.length>3){
        for (let i=3;i<this.allContractsArr.length;i++){
          this.subsetArr.push(this.allContractsArr[i]);
        }
      }
      this.sortContractDateByAsc = !this.sortContractDateByAsc;
    }else{
      this.allContractsArr.reverse();
      this.subsetArr =[];
      if (this.allContractsArr.length>3){
        for (let i=3;i<this.allContractsArr.length;i++){
          this.subsetArr.push(this.allContractsArr[i]);
        }
      }
      this.sortContractDateByAsc = !this.sortContractDateByAsc;
    }
  }

  sortByFolderTitle(){
    if (this.sortFolderTitleByAsc){
     this.ascendFolderTitle = this.foldersArr.sort((a,b) =>a.folderName.localeCompare(b.folderName));
     this.folderSubsetArr = this.ascendFolderTitle;
     
     if(this.foldersArr.length>3){
      this.folderSubsetArr = [];
      for(let i=3; i<this.foldersArr.length; i++){
        this.folderSubsetArr.push(this.foldersArr[i]);
      }
    }
     this.sortFolderTitleByAsc =!this.sortFolderTitleByAsc;
   }else{
     this.descendFolderTitle = this.foldersArr.sort((a,b)=>a.folderName.localeCompare(b.folderName)).reverse();
     this.folderSubsetArr = this.descendFolderTitle;
     if(this.foldersArr.length>3){
      this.folderSubsetArr = [];
      for(let i=3; i<this.foldersArr.length; i++){
        this.folderSubsetArr.push(this.foldersArr[i]);
      }
    }
     this.sortFolderTitleByAsc = !this.sortFolderTitleByAsc;
   }
 
   }

   sortByFolderDate(){
    if (this.sortFolderDateByAsc){
         this.foldersArr.sort((a,b)=>{
          try{
            let dateA = new Date(a.createdAt);
            let dateB = new Date(b.createdAt);

            if ((dateA instanceof Date && !isNaN(dateA.getTime()))&&(dateB instanceof Date && !isNaN(dateB.getTime()))) {
              //valid date object
              return dateA >= dateB ? 1 : -1; 
            } else {
              console.log("invalid date");
            }
          }
          catch(e){
            console.log(e);
          }
         });
         this.folderSubsetArr = [];
            if(this.foldersArr.length>3){
              for(let i=3; i<this.foldersArr.length; i++){
                this.folderSubsetArr.push(this.foldersArr[i]);
              }
            }
         this.sortFolderDateByAsc = !this.sortFolderDateByAsc;
        }else{
          this.foldersArr.reverse();
          this.folderSubsetArr = [];
          if(this.foldersArr.length>3){
            for(let i=3; i<this.foldersArr.length; i++){
              this.folderSubsetArr.push(this.foldersArr[i]);
            }
          }
          this.sortFolderDateByAsc = !this.sortFolderDateByAsc;
        }
  }

  onSearchFoldersClicked(){
    this.router.navigate(['dashboard/home/search', {searchType:'folders'}]);
  }

  onSearchContractsClicked(){
    this.router.navigate(['dashboard/home/search', {searchType:'contracts'}]);
  }

  onFolderSwipe(evt,folder:FolderData){
    const swipeDirection = Math.abs(evt.deltaX) > 40 ? (evt.deltaX > 0 ? 'right' : 'left'):'';

    console.log('swiped '+swipeDirection);
    switch(swipeDirection){
      case 'left':{
        if(!this.collapsedFolders){
          folder.swipedLeft = true;
       }
        break;
      }
      case 'right':{

        folder.swipedLeft = false;
        break;
      }
    }

  }

  renameFolderModal(folder:FolderData){
    const dialogConfig = new MatDialogConfig();
    // let passdata:string = '{"fileName": "'+this.file.name+'","fileUrl": "'+this.file.fileUrl+'"}';
    let passdata:string = '{"folderName": "'+folder.folderName+'","folderId": "'+folder.id+'"}';
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = false;
    dialogConfig.id = 'renamefolder-modal-component';
    //dialogConfig.height = '350px';
    dialogConfig.width = '350px';
    dialogConfig.data = passdata;

    dialogConfig.panelClass = 'bg-dialog-folder';
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(RenameFolderComponent, dialogConfig);
    
    this.matDialog.getDialogById('renamefolder-modal-component').afterClosed().subscribe({
      next:()=>{
        this.folderService.getFolderDetails(folder.id).subscribe({
          next:(resp:any) =>{
            //console.log('folder-details');

            //refresh folders list
            this._init();
            // this.folder = this.folderService.selectedFolder;
            
          },
          complete:()=>{},
        });
      },
      error:(resp)=>{
        console.log(resp);
      }
    });
  }

  addFolderDoc(folder:FolderData){
    const dialogConfig = new MatDialogConfig();
    this.folderService.emitSelectedFolder(folder);
    let passdata:string = '{"folderName": "'+folder.folderName+'","folderId": "'+folder.id+'"}';
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = false;
    dialogConfig.id = 'add-document-modal-component';
    //dialogConfig.height = '350px';
    dialogConfig.width = '400px';
    dialogConfig.data = passdata;

    dialogConfig.panelClass = 'bg-dialog-folder';
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(AddPageModalComponent, dialogConfig);
    this.matDialog.getDialogById('add-document-modal-component').afterOpened().subscribe({
      next:()=>{
       
        this.folderService.getFolderDetails(folder.id).subscribe({
          next:(resp:any) =>{
            console.log('folder-details');
            console.log(folder.id);
            console.log(folder.folderName);
           this. folder = this.folderService.selectedFolder;
          },
          complete:()=>{},
        });
      },
      error:(resp)=>{
        console.log(resp);
      }
    });

  }

  
  onContractSwipe(evt,contract:ContractData){
    const swipeDirection = Math.abs(evt.deltaX) > 40 ? (evt.deltaX > 0 ? 'right' : 'left'):'';

    console.log('swiped '+swipeDirection);
    switch(swipeDirection){
      case 'left':{
        if(!this.collapsed){
          contract.swipedLeft = true;
        }
        break;
      }
      case 'right':{
        contract.swipedLeft = false;
        break;
      }
    }

  }

  
  renameContract(contract:ContractData) {
    const dialogConfig = new MatDialogConfig();
    // let passdata:string = '{"fileName": "'+this.file.name+'","fileUrl": "'+this.file.fileUrl+'"}';
    let passdata: string =
      '{"contractName": "' +
      contract.details.name +
      '","contractId": "' +
      contract.details.Amsidnr +
      '"}';
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = false;
    dialogConfig.id = 'rename-contract-dialog';
    // dialogConfig.height = '80%';
    dialogConfig.width = '350px';
    dialogConfig.panelClass = 'bg-dialog-folder';
    dialogConfig.data = passdata;
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(
      RenameContractComponent,
      dialogConfig
    );

    this.matDialog.getDialogById('rename-contract-dialog').afterClosed().subscribe({
      next: () => {

        this.contractService
          .getContractDetails(contract.details.Amsidnr)
          .subscribe({
            next: (resp: any) => {
              
              contract.details.name = resp.name;

              //refresh contract list
              this._init();

            },
          });

      },
    });

  }

}
