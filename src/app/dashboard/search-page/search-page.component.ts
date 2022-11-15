import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ContractData } from '../../models/contract.model';
import { DocumentData } from '../../models/document.model';
import { FolderData } from '../../models/folder.model';
import { ContractsService } from '../../services/contracts.service';
import { DownloadService } from '../../services/download-file.service';
import { FoldersService } from '../../services/folder.service';
import { RenameModalComponent } from '../rename-modal/rename-modal.component';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {

  searchValue = "";
  resultExists: boolean = false;

  contractsArr: ContractData[] = [];
  contractsResArr: ContractData[] = [];
  foldersArr: FolderData[] = [];
  foldersResArr: FolderData[] = [];
  documentsArr: DocumentData[] = [];
  documentsResArr: DocumentData[] = [];

  constructor(private contractService: ContractsService, private folderService: FoldersService, private router:Router,
    private downloadService: DownloadService,
    private matDialog: MatDialog) { }

  ngOnInit() {
    this.contractService.getContracts().subscribe({
      next:()=>{
        this.contractsArr = this.contractService.userContractsArr;
      }
    });

    this.folderService.getFolders().subscribe({
      next:()=>{
        this.foldersArr = this.folderService.userFolderArr;
        for(let folder of this.foldersArr){
          for(let doc of folder.docs){
            this.documentsArr.push(doc);
          }
        }
      }
    });
    
    this.matDialog.afterAllClosed.subscribe({
      next: () => {
        this.searchValue = "";
        this.resultExists = false;
        this.contractsResArr = [];
        this.foldersResArr = [];
        this.documentsResArr = [];
      }
    });

  }
  
  filterSearch(searchValue:string){
    console.log(searchValue);
    this.contractsResArr = [];
    this.foldersResArr = [];
    this.documentsResArr = [];
    this.resultExists = false

    if(searchValue != undefined && searchValue != ""){
      for(let contract of this.contractsArr){
        if(contract.details.name && contract.details.name.includes(searchValue)){
          this.contractsResArr.push(contract);
        }
      }
      for(let folder of this.foldersArr){
        if(folder.folderName && folder.folderName.includes(searchValue)){
          this.foldersResArr.push(folder);
        }
      }
      for(let document of this.documentsArr){
        if(document.name && document.name.includes(searchValue) ){
          this.documentsResArr.push(document);
        }
      }
    }
    if(this.contractsResArr.length > 0) { this.resultExists = true;}
    if(this.foldersResArr.length > 0) { this.resultExists = true;}
    if(this.documentsResArr.length > 0) { this.resultExists = true;}

  }
  
  onContractClick(clickedContract){
    
    this.contractService.emitSelectedFolder(clickedContract);
    this.router.navigate(['dashboard/overview/contract-detail', { id: clickedContract.details.Amsidnr }]);
    
  }
  
  onSwipe(evt, doc: DocumentData) {
    const swipeDirection = Math.abs(evt.deltaX) > 40 ? (evt.deltaX > 0 ? 'right' : 'left'):'';
    
    console.log('swiped '+swipeDirection);
    switch(swipeDirection){
      case 'left':{
        doc.swipedLeft = true;
        break;
      }
      case 'right':{

        doc.swipedLeft = false;
        break;
      }
    }
  }

  onDocClick(doc: DocumentData){
    console.log('tap !');
    if(!doc.swipedLeft){
      
    }
    this.downloadService.getDownloadFile(doc.linkToDoc).subscribe({
      next:(resp:any)=>{
        try{
          var file = new Blob([resp]);
          var fileURL = URL.createObjectURL(file);
          window.open(fileURL);

        } catch(e){
          console.log(e);
        }
      }
    });
  }

  renameFileModal(file) {
    const dialogConfig = new MatDialogConfig();
    // let passdata:string = '{"fileName": "'+this.file.name+'","fileUrl": "'+this.file.fileUrl+'"}';
    let passdata:string = '{"docName": "'+file.name+'","docid": "'+file.docid+'","systemId": "'+file.systemId+'"}';
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = false;
    dialogConfig.id = 'modal-component';
    // dialogConfig.height = '80%';
    // dialogConfig.width = '90%';
    dialogConfig.data = passdata;
    // https://material.angular.io/components/dialog/overview
    const renameFileDialog = this.matDialog.open(RenameModalComponent, dialogConfig);
  }

  onFolderCardClick(clickedFolder){

    this.folderService.emitSelectedFolder(clickedFolder);
    this.router.navigate(['dashboard/overview/folder-detail', { id: clickedFolder.id }]);
  }
}