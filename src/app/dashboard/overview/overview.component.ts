import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ContractData } from '../../models/contract.model';
import { FolderData } from '../../models/folder.model';
import { ContractsService } from '../../services/contracts.service';
import { FoldersService } from '../../services/folder.service';
import { NewFolderComponent } from '../new-folder/new-folder.component';
import { RenameModalComponent } from '../rename-modal/rename-modal.component';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
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
  }
];
  folderSubsetArr: FolderData[] = [];

  showCard2:boolean = false;
  showCard1:boolean = false;

  showFolderCard2:boolean = false;
  showFolderCard1:boolean = false;

  collapsed:boolean = true;
  collapsedFolders:boolean = true;

  constructor(private router:Router, private contractService: ContractsService, private folderService: FoldersService,private matDialog: MatDialog) { }

  ngOnInit() {

    this._init();
    
  }

  _init(){

    this.contractService.getContracts().subscribe({
      next: ()=>{
        this.allContractsArr = this.contractService.userContractsArr;

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
            if(this.folderService.userFolderArr.length>3){
              for(let i=3; i<this.folderService.userFolderArr.length; i++){
                this.folderSubsetArr.push(this.folderService.userFolderArr[i]);
              }
            }
            // console.log(this.foldersArr);
            this.foldersArr.length>1 ? this.showFolderCard2 = true: this.showFolderCard2 = false;
            this.foldersArr.length>2 ? this.showFolderCard1 = true: this.showFolderCard1 = false;
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
    
    // let passdata:string = '{"docName": "'+"file.name"+'","docId": "'+"file.docId"+'"}';
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = false;
    dialogConfig.id = 'newfolder-modal-component';
    // dialogConfig.height = '80%';
    // dialogConfig.width = '90%';
    // dialogConfig.data = passdata;
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(NewFolderComponent, dialogConfig);
    
    this.matDialog.getDialogById('newfolder-modal-component').afterClosed().subscribe({
      next:()=>{
        this._init();
      }
    });
  }
  
  onAddContract(){
    this.router.navigate(['dashboard/overview/new-contract']);
  }


}