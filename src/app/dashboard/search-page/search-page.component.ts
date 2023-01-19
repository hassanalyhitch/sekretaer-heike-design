import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
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
  //is_spinner_showing: boolean = false;
  searchType: string = '';

  no_contracts_found: boolean = false;
  no_folders_found:   boolean = false;
  no_documents_found: boolean = false;

  contractsArr: ContractData[] = [];
  contractsResArr: ContractData[] = [];
  foldersArr: FolderData[] = [];
  foldersResArr: FolderData[] = [];
  documentsArr: DocumentData[] = [];
  documentsResArr: DocumentData[] = [];

  constructor(
    private contractService: ContractsService, 
    private folderService: FoldersService, 
    private router:Router,
    private downloadService: DownloadService,
    private matDialog: MatDialog,
    private route:ActivatedRoute) { }

  ngOnInit() {

    switch (this.route.snapshot.params['searchType']){
      case "folders": {
        this.searchType = 'folders';
        break;
      }
      case "contracts" :{
        this.searchType = 'contracts';
        break;
      }
      case "docs" :{
        this.searchType = 'docs';
        break;
      }
      default:{
        this.searchType = 'all';
        break;
      }
    }

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
    
  }
  
  filterSearch(searchValue:string){
    console.log(searchValue);
    this.contractsResArr = [];
    this.foldersResArr = [];
    this.documentsResArr = [];
    //this.is_spinner_showing = false

    if(searchValue != undefined && searchValue != ""){

      if(this.searchType == 'all'){

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

      } else if(this.searchType == 'folders'){

        for(let folder of this.foldersArr){
          if(folder.folderName && folder.folderName.includes(searchValue)){
            this.foldersResArr.push(folder);
          }
        }

      } else if(this.searchType == 'contracts'){

        for(let contract of this.contractsArr){
          if(contract.details.name && contract.details.name.includes(searchValue)){
            this.contractsResArr.push(contract);
          }
        }

      } else if(this.searchType == 'docs'){

        for(let document of this.documentsArr){
          if(document.name && document.name.includes(searchValue) ){
            this.documentsResArr.push(document);
          }
        }
        
      }

    }

    if(this.searchType == 'all'){

      if( this.contractsResArr.length > 0 ){
        //this.is_spinner_showing = true;
        this.no_contracts_found = false;
        console.log('contracts size -> '+this.contractsResArr.length);
      } else if( this.contractsResArr.length == 0 ){
        //this.is_spinner_showing = false;
        this.no_contracts_found = true;
        console.log('contracts size -> '+this.contractsResArr.length);
      }

      if( this.foldersResArr.length > 0 ) {
        //this.is_spinner_showing = false;
        this.no_folders_found = false;
        console.log('folders size -> '+this.foldersResArr.length);
      } else if( this.foldersResArr.length == 0 ){
        //this.is_spinner_showing = false;
        this.no_folders_found = true;
        console.log('folders size -> '+this.foldersResArr.length);
      } 
      
      if( this.documentsResArr.length > 0 ) {
        //this.is_spinner_showing = false;
        this.no_documents_found = false;
        console.log('Documents size -> '+this.documentsResArr.length);
      } else if( this.documentsResArr.length == 0 ){
        //this.is_spinner_showing = false;
        this.no_documents_found = true;
        console.log('Documents size -> '+this.documentsResArr.length);
      }

    }

    if(this.searchType == 'folders'){

      if( this.foldersResArr.length > 0 ) {
        //this.is_spinner_showing = true;
        this.no_folders_found = false;
        console.log('folders size -> '+this.foldersResArr.length);
      } else if( this.foldersResArr.length == 0 ) {
        //this.is_spinner_showing = false;
        this.no_folders_found = true;
        console.log('folders size -> '+this.foldersResArr.length);
      }

    }

    if(this.searchType == 'contracts'){

      if( this.contractsResArr.length > 0 ){
        //this.is_spinner_showing = true;
        this.no_contracts_found = false;
        console.log('contracts size -> '+this.contractsResArr.length);
      } else if( this.contractsResArr.length == 0 ) {
        //this.is_spinner_showing = false;
        this.no_contracts_found = true;
        console.log('contracts size -> '+this.contractsResArr.length);
      }

    }

    if(this.searchType == 'docs'){

      if( this.documentsResArr.length > 0 ) {
        //this.is_spinner_showing = true;
        this.no_documents_found = false;
      } else if( this.documentsResArr.length == 0 ){
        //this.is_spinner_showing = false;
        this.no_documents_found = true;
      }

    }



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
    this.downloadService.getDownloadFile(doc.systemId, doc.docid).subscribe({
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
    dialogConfig.id = 'rename-document-component';
    // dialogConfig.height = '80%';
    // dialogConfig.width = '90%';
    dialogConfig.width = '350px';
    dialogConfig.panelClass = 'bg-dialog-folder';
    dialogConfig.data = passdata;
    // https://material.angular.io/components/dialog/overview
    const renameFileDialog = this.matDialog.open(RenameModalComponent, dialogConfig);

    this.matDialog.getDialogById('rename-document-component').afterClosed().subscribe({
      next: () => {
        this.searchValue = "";
        //this.is_spinner_showing = false;
        this.contractsResArr = [];
        this.foldersResArr = [];
        this.documentsResArr = [];
      }
    });

  }

  onFolderCardClick(clickedFolder){

    this.folderService.emitSelectedFolder(clickedFolder);
    this.router.navigate(['dashboard/overview/folder-detail', { id: clickedFolder.id }]);
  }
}