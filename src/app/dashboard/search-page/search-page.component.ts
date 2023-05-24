import { LowerCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ContractData } from '../../models/contract.model';
import { DocumentData } from '../../models/document.model';
import { FolderData } from '../../models/folder.model';
import { ContractsService } from '../../services/contracts.service';
import { DownloadService } from '../../services/download-file.service';
import { FoldersService } from '../../services/folder.service';
import { RenameModalComponent } from '../rename-modal/rename-modal.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css'],
  providers: [LowerCasePipe]
})
export class SearchPageComponent implements OnInit {

  searchedValue : string = '';

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
    private lowerCasePipe: LowerCasePipe,
    private contractService: ContractsService, 
    private folderService: FoldersService, 
    private router:Router,
    private downloadService: DownloadService,
    private matDialog: MatDialog,
    private translate:TranslateService,
    private snackbar:MatSnackBar,
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
  
  filterSearch(searchQuery: string){

    this.contractsResArr = [];
    this.foldersResArr = [];
    this.documentsResArr = [];
    
    if(this.searchedValue != undefined && this.searchedValue != ""){

      if(this.searchType == 'all'){

// searching all contract fields//

        for(let contract of this.contractsArr){
          if(contract.details.name && 
            this.lowerCasePipe.transform(contract.details.name).includes(this.lowerCasePipe.transform(searchQuery))){
            this.contractsResArr.push(contract);
          }
        }

        for(let contract of this.contractsArr){
          if(contract.details.Branch && 
            this.lowerCasePipe.transform(contract.details.Branch).includes(this.lowerCasePipe.transform(searchQuery))){
            this.contractsResArr.push(contract);
          }
        }


        for(let contract of this.contractsArr){
          if(contract.details.Company && 
            this.lowerCasePipe.transform(contract.details.Company).includes(this.lowerCasePipe.transform(searchQuery))){
            this.contractsResArr.push(contract);
          }
        }

        for(let contract of this.contractsArr){
          if(contract.details.EndDate && 
            this.lowerCasePipe.transform(contract.details.EndDate).includes(this.lowerCasePipe.transform(searchQuery))){
            this.contractsResArr.push(contract);
          }
        }

 // searching all folder fields//       
  
        for(let folder of this.foldersArr){
          if(folder.folderName && 
            this.lowerCasePipe.transform(folder.folderName).includes(this.lowerCasePipe.transform(searchQuery))){
            this.foldersResArr.push(folder);
          }
        }

        for(let folder of this.foldersArr){
          if(folder.createdAt && 
            this.lowerCasePipe.transform(folder.createdAt).includes(this.lowerCasePipe.transform(searchQuery))){
            this.foldersResArr.push(folder);
          }
        }
  
        for(let document of this.documentsArr){
          if(document.name && 
            this.lowerCasePipe.transform(document.name).includes(this.lowerCasePipe.transform(searchQuery)) ){
            this.documentsResArr.push(document);
          }
        }

      } else if(this.searchType == 'folders'){
// searching  folder fields//

        for(let folder of this.foldersArr){
          if(folder.folderName && 
            this.lowerCasePipe.transform(folder.folderName).includes(this.lowerCasePipe.transform(searchQuery))){
            this.foldersResArr.push(folder);
          }
        }

        for(let folder of this.foldersArr){
          if(folder.createdAt && 
            this.lowerCasePipe.transform(folder.createdAt).includes(this.lowerCasePipe.transform(searchQuery))){
            this.foldersResArr.push(folder);
          }
        }

      } else if(this.searchType == 'contracts'){
// searching  contract fields//

        for(let contract of this.contractsArr){
          if(contract.details.name && 
            this.lowerCasePipe.transform(contract.details.name).includes(this.lowerCasePipe.transform(searchQuery))){
            this.contractsResArr.push(contract);
          }
        }

        for(let contract of this.contractsArr){
          if(contract.details.Branch && 
            this.lowerCasePipe.transform(contract.details.Branch).includes(this.lowerCasePipe.transform(searchQuery))){
            this.contractsResArr.push(contract);
          }
        }

        for(let contract of this.contractsArr){
          if(contract.details.Company && 
            this.lowerCasePipe.transform(contract.details.Company).includes(this.lowerCasePipe.transform(searchQuery))){
            this.contractsResArr.push(contract);
          }
        }

        for(let contract of this.contractsArr){
          if(contract.details.EndDate && 
            this.lowerCasePipe.transform(contract.details.EndDate).includes(this.lowerCasePipe.transform(searchQuery))){
            this.contractsResArr.push(contract);
          }
        }

      } else if(this.searchType == 'docs'){

        for(let document of this.documentsArr){
          if(document.name && 
            this.lowerCasePipe.transform(document.name).includes(this.lowerCasePipe.transform(searchQuery)) ){
            this.documentsResArr.push(document);
          }
        }
        
      }

    }

    if(this.searchType == 'all'){

      if( this.contractsResArr.length > 0 ){
        this.no_contracts_found = false;

      } else if( this.contractsResArr.length == 0 ){
        this.no_contracts_found = true;
  
      }

      if( this.foldersResArr.length > 0 ) {
        this.no_folders_found = false;
        
      } else if( this.foldersResArr.length == 0 ){
        this.no_folders_found = true;
    
      } 
      
      if( this.documentsResArr.length > 0 ) {
        this.no_documents_found = false;
 
      } else if( this.documentsResArr.length == 0 ){
        this.no_documents_found = true;

      }

    }

    if(this.searchType == 'folders'){

      if( this.foldersResArr.length > 0 ) {
        this.no_folders_found = false;

      } else if( this.foldersResArr.length == 0 ) {
        this.no_folders_found = true;

      }
    }

    if(this.searchType == 'contracts'){

      if( this.contractsResArr.length > 0 ){
        this.no_contracts_found = false;
       
      } else if( this.contractsResArr.length == 0 ) {
        this.no_contracts_found = true;
      
      }

    }

    if(this.searchType == 'docs'){

      if( this.documentsResArr.length > 0 ) {
        this.no_documents_found = false;
      } else if( this.documentsResArr.length == 0 ){
        this.no_documents_found = true;
      }

    }



  }
  
  onContractClick(clickedContract){
    
    this.contractService.emitSelectedContract(clickedContract);
    this.router.navigate(['dashboard/overview/contract-detail', { id: clickedContract.details.Amsidnr }]);
    
  }
  
  onSwipe(evt, doc: DocumentData) {
    const swipeDirection = Math.abs(evt.deltaX) > 40 ? (evt.deltaX > 0 ? 'right' : 'left'):'';

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


    if(!doc.swipedLeft){
      
    }
    
    this.snackbar.open(
      this.translate.instant('search.document_download_request'), 
      this.translate.instant('snack_bar.action_button'),{
      duration:5000,
      panelClass:['snack'],
    });
  
 
    // -------------------------------------------------------------------------------------------//
    //                 downloading using base64                                                     //
    // -------------------------------------------------------------------------------------------//
    this.downloadService.getBase64DownloadFile(doc.systemId, doc.docid).subscribe({
      next:(resp:any)=>{
      
        //use of application/octetstream is a hacky approach that browsers seem to accept.
        //let base64String = "data:application/octetstream;base64," + resp.body.document;
        
        const link = document.createElement('a');
        
        link.setAttribute('target', '_blank');

        link.setAttribute('href', environment.baseUrl+resp.body.linkToDoc);

        link.setAttribute('download', resp.body.name+'.'+resp.body.extension);
        
        document.body.appendChild(link);
        link.click();
        link.remove();

      },
      error: (resp) => {
        this.snackbar.open(
          this.translate.instant('search.document_download_failed'),
          this.translate.instant('snack_bar.action_button'),{
          panelClass:['snack_error'],
          duration:1500,
        })
      }
    });
  }

  renameFileModal(file) {
    const dialogConfig = new MatDialogConfig();
    let passdata:string = '{"docName": "'+file.name+'","docid": "'+file.docid+'","systemId": "'+file.systemId+'"}';
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = false;
    dialogConfig.id = 'rename-document-component';
    dialogConfig.width = '350px';
    dialogConfig.panelClass = 'bg-dialog-folder';
    dialogConfig.data = passdata;
    
    const renameFileDialog = this.matDialog.open(RenameModalComponent, dialogConfig);

    this.matDialog.getDialogById('rename-document-component').afterClosed().subscribe({
      next: () => {
        this.searchedValue   = "";
        this.contractsResArr = [];
        this.foldersResArr   = [];
        this.documentsResArr = [];
      }
    });

  }

  onFolderCardClick(clickedFolder){

    this.folderService.emitSelectedFolder(clickedFolder);
    this.router.navigate(['dashboard/overview/folder-detail', { id: clickedFolder.id }]);
  }
}