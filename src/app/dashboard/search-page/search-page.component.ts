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
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { SearchService } from '../.././../app/services/search.service';

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

  //screen layout changes
  destroyed = new Subject<void>();

  isMobileView: boolean;
  isDesktopView: boolean;
  isSpinnerLoading: boolean = false;

  // Create a map to display breakpoint names for layout changes.
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);

  searchQueryUpdate = new Subject<string>();

  constructor(
    private searchService: SearchService,
    private breakpointObserver: BreakpointObserver,
    private lowerCasePipe: LowerCasePipe,
    private contractService: ContractsService, 
    private folderService: FoldersService, 
    private router:Router,
    private downloadService: DownloadService,
    private matDialog: MatDialog,
    private translate:TranslateService,
    private snackbar:MatSnackBar,
    private route:ActivatedRoute) { 

      this.isMobileView = false;
      this.isDesktopView = false;

      // Debounce search.
      this.searchQueryUpdate.pipe(
        debounceTime(1000),
        distinctUntilChanged())
        .subscribe(value => {
          this.filterSearch(value);
        });

    }

  ngOnInit() {

    //-------------------screen changes-----------------
    this.breakpointObserver
    .observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ])
    .pipe(takeUntil(this.destroyed))
    .subscribe(result => {
      for (const query of Object.keys(result.breakpoints)) {
        if (result.breakpoints[query]) {

        //this.currentScreenSize = this.displayNameMap.get(query) ?? 'Unknown';

        if(this.displayNameMap.get(query) == 'XSmall'){

          this.isMobileView = true;
          this.isDesktopView = false;
    
        } else if(this.displayNameMap.get(query) == 'Small'){
    
          this.isMobileView = true;
          this.isDesktopView = false;
    
        } else if(this.displayNameMap.get(query) == 'Medium'){
    
          this.isMobileView = false;
          this.isDesktopView = true;
    
        } else if(this.displayNameMap.get(query) == 'Large'){
    
          this.isMobileView = false;
          this.isDesktopView = true;
          
        } else if(this.displayNameMap.get(query) == 'XLarge'){
    
          this.isMobileView = false;
          this.isDesktopView = true;
          
        }
    
        }
      }
    });

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

  }
  
  filterSearch(searchQuery: string){

    if(this.searchedValue != undefined && this.searchedValue != ""){

      this.contractsResArr = [];
      this.foldersResArr = [];
      this.documentsResArr = [];

      if(this.searchType == 'all'){

        this.isSpinnerLoading = true;

        this.searchService.getSearchResults(this.lowerCasePipe.transform(searchQuery))
                          .subscribe({
                            next:(resp: any)=>{

                              if(Array.isArray(resp)){
                                
                                for(let item of resp){
                                  
                                  switch(item.category){
                                    case 'folder': {
                                      
                                      let folder: FolderData = {
                                        id: item.details['id'],
                                        loginId : item.details['loginId'],
                                        customerAmsidnr:  item.details['customerAmsidnr'],
                                        createdAt:  item.details['createdAt'],         
                                        ownerFolderId : item.details['ownerFolderId'],
                                        folderName : item.details['folderName'],
                                        createTime : item.details['createdAt'],
                                        subFolders : item.details['subFolders'],
                                        docs : item.details['docs'],
                                        isFavorite: item.details['isFavorite'],
                                        isSelected: false,
                                        swipedLeft: false
                                      };
                                      if('favoriteId' in item){
                                        folder.favoriteId = item.details['favoriteId'];
                                      }
                                      this.foldersResArr.push(folder);

                                      

                                      break;
                                    } 
                                    case 'contract': {

                                      let contract: ContractData = {
                                        id: this.contractsResArr.length +1,
                                        details: {
                                          Amsidnr:         item.details['Amsidnr'],
                                          BranchSekretaer: item.details['BranchSekretaer'],
                                          CustomerAmsidnr: item.details['CustomerAmsidnr'],
                                          InsuranceId:     item.details['Contractnumber'],
                                          ContractNumber:  item.details['Contractnumber'],
                                          Company:         item.details['CompanyShort'],
                                          StartDate:       item.details['Begin'],
                                          EndDate:         item.details['End'],
                                          YearlyPayment:   item.details['YearlyPayment'],
                                          Paymethod:       item.details['PaymentMethod'],
                                          Branch:          item.details['Branch'],
                                          Risk:            item.details['Risk'],
                                          docs:            item.details['docs'],
                                          name:            item['name'],
                                          productSek:      item.details['ProductSekretaer'],
                                          tarif:           item.details['tarif'],
                                          isFav:           0,
                                          favoriteId:      item.details['favoriteId'],
                                          iconLeft:        item.details['iconLeft'],
                                          ownPicture:      item.details['ownPicture']
                                        },
                                        isSelected: false,
                                        swipedLeft: false
                                      };
                                      this.contractsResArr.push(contract);
                                      
                                      break;
                                    } 
                                    case 'dms': {

                                      let document: DocumentData = {
                                        category:  item.details['category'],
                                        createdAt: item.details['createdAt'],
                                        docid:     item.details['docid'],
                                        linkToDoc: item.details['linkToDoc'],
                                        name:      item.details['name'],
                                        systemId:  item.details['systemId'],
                                        extension: item.details['extension']
                                      };

                                      this.documentsResArr.push(document);
                                      
                                      break;
                                    } 

                                  }
                                }
                              }

                              this.isSpinnerLoading = false;

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
                      
                            },
                            error:()=>{
                              
                              //reset values
                              this.isSpinnerLoading = false;
                              this.contractsResArr = [];
                              this.foldersResArr = [];
                              this.documentsResArr = [];

                            },
                            complete:()=>{
                              this.isSpinnerLoading = false;
                            }
                          });

      } else if(this.searchType == 'folders'){

        //searching  folders only
        this.searchService.getSearchResults(this.lowerCasePipe.transform(searchQuery))
                          .subscribe({
                            next:(resp: any)=>{

                              if(Array.isArray(resp)){
                                
                                for(let item of resp){
                                  
                                  switch(item.category){
                                    case 'folder': {
                                      
                                      let folder: FolderData = {
                                        id: item.details['id'],
                                        loginId : item.details['loginId'],
                                        customerAmsidnr:  item.details['customerAmsidnr'],
                                        createdAt:  item.details['createdAt'],         
                                        ownerFolderId : item.details['ownerFolderId'],
                                        folderName : item.details['folderName'],
                                        createTime : item.details['createdAt'],
                                        subFolders : item.details['subFolders'],
                                        docs : item.details['docs'],
                                        isFavorite: item.details['isFavorite'],
                                        isSelected: false,
                                        swipedLeft: false
                                      };
                                      if('favoriteId' in item){
                                        folder.favoriteId = item.details['favoriteId'];
                                      }
                                      this.foldersResArr.push(folder);

                                      break;
                                    } 
                                    

                                  }
                                }
                              }

                            },
                            error:()=>{
                              
                              //reset values
                              this.isSpinnerLoading = false;
                              this.contractsResArr = [];
                              this.foldersResArr = [];
                              this.documentsResArr = [];

                            },
                            complete:()=>{
                              this.isSpinnerLoading = false;
                            }
                          });

        if( this.foldersResArr.length > 0 ) {
          this.no_folders_found = false;
  
        } else if( this.foldersResArr.length == 0 ) {
          this.no_folders_found = true;
  
        }

      } else if(this.searchType == 'contracts'){

        //searching  contracts only
        this.searchService.getSearchResults(this.lowerCasePipe.transform(searchQuery))
                          .subscribe({
                            next:(resp: any)=>{

                              if(Array.isArray(resp)){
                                
                                for(let item of resp){
                                  
                                  switch(item.category){
                                     
                                    case 'contract': {

                                      let contract: ContractData = {
                                        id: this.contractsResArr.length +1,
                                        details: {
                                          Amsidnr:         item.details['Amsidnr'],
                                          BranchSekretaer: item.details['BranchSekretaer'],
                                          CustomerAmsidnr: item.details['CustomerAmsidnr'],
                                          InsuranceId:     item.details['Contractnumber'],
                                          ContractNumber:  item.details['Contractnumber'],
                                          Company:         item.details['CompanyShort'],
                                          StartDate:       item.details['Begin'],
                                          EndDate:         item.details['End'],
                                          YearlyPayment:   item.details['YearlyPayment'],
                                          Paymethod:       item.details['PaymentMethod'],
                                          Branch:          item.details['Branch'],
                                          Risk:            item.details['Risk'],
                                          docs:            item.details['docs'],
                                          name:            item['name'],
                                          productSek:      item.details['ProductSekretaer'],
                                          tarif:           item.details['tarif'],
                                          isFav:           0,
                                          favoriteId:      item.details['favoriteId'],
                                          iconLeft:        item.details['iconLeft'],
                                          ownPicture:      item.details['ownPicture']
                                        },
                                        isSelected: false,
                                        swipedLeft: false
                                      };
                                      this.contractsResArr.push(contract);
                                      
                                      break;
                                    } 
                                  
                                  }
                                }
                              }

                            },
                            error:()=>{
                              
                              //reset values
                              this.isSpinnerLoading = false;
                              this.contractsResArr = [];
                              this.foldersResArr = [];
                              this.documentsResArr = [];

                            },
                            complete:()=>{
                              this.isSpinnerLoading = false;
                            }
                          });

        if( this.contractsResArr.length > 0 ){
          this.no_contracts_found = false;
          
        } else if( this.contractsResArr.length == 0 ) {
          this.no_contracts_found = true;
        
        }

      } else if(this.searchType == 'docs'){

        //searching documents only
        this.searchService.getSearchResults(this.lowerCasePipe.transform(searchQuery))
                          .subscribe({
                            next:(resp: any)=>{

                              if(Array.isArray(resp)){
                                
                                for(let item of resp){
                                  
                                  switch(item.category){
                                     
                                    case 'dms': {

                                      let document: DocumentData = {
                                        category:  item.details['category'],
                                        createdAt: item.details['createdAt'],
                                        docid:     item.details['docid'],
                                        linkToDoc: item.details['linkToDoc'],
                                        name:      item.details['name'],
                                        systemId:  item.details['systemId'],
                                        extension: item.details['extension']
                                      };

                                      this.documentsResArr.push(document);
                                      
                                      break;
                                    } 

                                  }
                                }
                              }

                            },
                            error:()=>{

                              
                              //reset values
                              this.isSpinnerLoading = false;
                              this.contractsResArr = [];
                              this.foldersResArr = [];
                              this.documentsResArr = [];

                            },
                            complete:()=>{
                              this.isSpinnerLoading = false;
                            }
                          });

        if( this.documentsResArr.length > 0 ) {
          this.no_documents_found = false;
        } else if( this.documentsResArr.length == 0 ){
          this.no_documents_found = true;
        }

      }

    } else if(this.searchedValue == ''){
      //reset the arrays
      this.contractsResArr = [];
      this.foldersResArr = [];
      this.documentsResArr = [];

    }

  }
  
  onContractClick(clickedContract){
    
    this.contractService.emitSelectedContract(clickedContract);

    if(this.router.url.includes('search')){

      if(this.isMobileView){

        this.router.navigate([
          'dashboard/overview/contract-detail', 
          { id: clickedContract.details.Amsidnr }
        ]);

      } else {

        this.router.navigate([
          '/dashboard/overview/',
          { outlets: { 'desktop': ['contract-detail', { id: clickedContract.details.Amsidnr }] } }
        ]);

      }

    }
    
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

    if(doc.extension == "jpg" || doc.extension == "jpeg" || doc.extension == "pdf" ){
      
      if(this.router.url.includes('search')){

        if(this.isMobileView){

          this.router.navigate([
            'dashboard/overview/fileview', 
            { id: doc.docid , extension:doc.extension, url:doc.linkToDoc, docName:doc.name, sys:doc.systemId}],
            { skipLocationChange: false });

        } else {

          this.router.navigate([
            'dashboard/overview/',
            { outlets: { 'desktop': ['fileview', { id: doc.docid , extension:doc.extension, url:doc.linkToDoc, docName:doc.name, sys:doc.systemId}] } }
          ]);

        }

      }

    }
    else if(doc.extension == "zip"){
      this.snackbar.open(
        this.translate.instant('document_item.document_download_request'), 
        this.translate.instant('snack_bar.action_button'),{
        duration:5000,
        panelClass:['snack'],
      });
      
      this.downloadService.getBase64DownloadFile(doc.systemId, doc.docid).subscribe({
        next:(resp:any)=>{
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
            this.translate.instant('document_item.document_download_failed'),
            this.translate.instant('snack_bar.action_button'),{
            panelClass:['snack_error'],
            duration:1500,
          })
        }
      });
    }
    
    
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

    if(this.router.url.includes('search')){

      if(this.isMobileView){
        this.router.navigate(
          ['dashboard/overview/folder-detail', { id: clickedFolder.id }]);

      } else {
        this.router.navigate([
          '/dashboard/overview/', 
          { outlets: { 'desktop': ['folder-detail', { id: clickedFolder.id }] } }
        ]);
      }

    }
  }

  ngOnDestroy(){
    this.destroyed.next();
    this.destroyed.complete();
  }
}