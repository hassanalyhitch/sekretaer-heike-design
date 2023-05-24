import { Component, Input, OnDestroy, OnInit,ViewChildren,QueryList,ElementRef } from '@angular/core';
import { NavigationEnd, Router, Event, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { FolderData } from '../../models/folder.model';
import { FoldersService } from '../../services/folder.service';
import { Location } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RenameFolderComponent } from '../rename-folder/rename-folder.component';
import { NewFolderComponent } from '../new-folder/new-folder.component';
import { DocumentData } from '../../models/document.model';
import { RenameModalComponent } from '../rename-modal/rename-modal.component';
import { DownloadService } from '../../services/download-file.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddPageModalComponent } from '../add-page-modal/add-page-modal.component';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-folder-detail',
  templateUrl: './folder-detail.component.html',
  styleUrls: ['./folder-detail.component.css']
})
export class FolderDetailComponent implements OnInit, OnDestroy {

 folder:FolderData; 
 mainFolder: FolderData;

  parentNav: string = '';
  currentNav: string = '';
  selected_folder_id: string = '';

  visitedFolderArray:FolderData[] = [];
  docArr: DocumentData[] = [];
  subFoldersArr:FolderData[] = [];
  parentFolder: FolderData;

  sortDocDateByAsc:boolean =true;
  sortSubFolderDate:boolean =true;
  hasParent: boolean = false;


  folderSub:Subscription;
  routeListener: Subscription;

  constructor(
    private router:Router, 
    private route:ActivatedRoute, 
    private folderService: FoldersService,
    private matDialog: MatDialog, 
    private translate:TranslateService, 
    private _location: Location,
    private downloadService: DownloadService,
    private snackbar:MatSnackBar,
    private loadingService:LoadingService
    ) {
      this.loadingService.emitIsLoading(true); 
    }

  ngOnInit() {

    this.selected_folder_id = this.route.snapshot.paramMap.get('id');

    this.folderSub = this.folderService
        .getFolderDetails(this.selected_folder_id)
        .subscribe({
          next:() =>{

            this.folder = this.folderService.selectedFolder;

          },
          complete:()=>{
            this.loadingService.emitIsLoading(false);
          },
        });

    this.routeListener = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        
        this.folder = this.folderService.selectedFolder;

        if(this.visitedFolderArray.length>0){
          for(let i=0; i<this.visitedFolderArray.length; i++){
            
            if(this.visitedFolderArray[i].id == this.route.snapshot.params['id']){
              
              //..has been visited but data may have changed, show the old and request for new data
              this.folderService.emitSelectedFolder(this.visitedFolderArray[i]);
              this.folder = this.folderService.selectedFolder;
              
              //set parentName, which shows at the top of the page
              for(let x=0; x<this.visitedFolderArray.length; x++){
                if(this.visitedFolderArray[x].id == this.folder.ownerFolderId){
                  this.parentNav = this.visitedFolderArray[x].folderName;
                }
              }
              //http request here
            }
          }
        } 
        if(this.mainFolder.id == this.route.snapshot.params['id']){
          this.parentNav = '';
          this.folder = this.mainFolder;
        }
        this.currentNav = this.folder.folderName;
      }
    });

    this.folder = this.folderService.selectedFolder;
    this.currentNav = this.folder.folderName;

    //main folder set once and shouldn't change
    this.mainFolder = this.folder; 
    this.visitedFolderArray.push(this.mainFolder);
    // --------------------------------------------------

    //sort documents by date
    this.sortDocumentsByDateOnly();
    this.folder.docs.reverse();
    
  }

  ngOnDestroy(){
    this.hasParent = false;
    this.routeListener.unsubscribe();
    this.folderSub.unsubscribe();
    this.visitedFolderArray = [];
  }
  
  onFolderCardClick(clickedFolder: FolderData){
    this.folderService.emitSelectedFolder(clickedFolder);
    this.visitedFolderArray.push(clickedFolder);
    this.parentFolder = this.folder;
    this.hasParent = true;

    this.router.navigate(['/dashboard/overview/folder-detail', { id: clickedFolder.id }]);
  }

  onBackNavClick(){
    this._location.back();
  }

  markFav(folder: FolderData){
   // console.log('Mark Favourite '+folder.id);

    this.folderService.makeFolderFavourite(folder.id).subscribe({
      next:(resp:any)=>{
        this.folder.favoriteId = resp.id;
        this.folder.isFavorite = 1;
      },
      error:(resp)=>{
        this.snackbar.open(this.translate.instant('folder-detail.mark_fav_error'),this.translate.instant('snack_bar.action_button'),{
          panelClass:['snack_error'],
          duration:1500,
        })
      },
      complete:()=>{
        this.snackbar.open(this.translate.instant('folder-detail.mark_fav_success'),this.translate.instant('snack_bar.action_button'),{
          panelClass:['snack_success'],
          duration:1500,
        })
      }
    });
  }

  unmarkFav(folder: FolderData){
   // console.log('Un Favourite '+folder.favoriteId);

    this.folderService.deleteFolderFavourite(folder.favoriteId).subscribe({
      next:(resp:any)=>{
        this.folder.isFavorite = 0;
      },
      error:(resp)=>{
        this.snackbar.open(this.translate.instant('folder-detail.unmark_fav_error'),this.translate.instant('snack_bar.action_button'),{
          panelClass:['snack_error'],
          duration:1500,
        })
      },
      complete:()=>{
        this.snackbar.open(this.translate.instant('folder-detail.unmark_fav_success'),this.translate.instant('snack_bar.action_button'),{
          panelClass:['snack_success'],
          duration:1500,
        })
      }
    });
  }

  toggleFav(folder: FolderData){
    this.folder.isFavorite == 1 ? this.unmarkFav(folder) : this.markFav(folder);
  }
    
  openModal(folder: FolderData) {
    const dialogConfig = new MatDialogConfig();
    let passdata:string = '{"folderName": "'+folder.folderName+'","folderId": "'+folder.id+'"}';
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = false;
    dialogConfig.id = 'renamefolder-modal-component';
    dialogConfig.width = '350px';
    dialogConfig.data = passdata;

    dialogConfig.panelClass = 'bg-dialog-folder';
    const modalDialog = this.matDialog.open(RenameFolderComponent, dialogConfig);
    
    this.matDialog.getDialogById('renamefolder-modal-component').afterClosed().subscribe({
      next:()=>{
        this.folderService.getFolderDetails(this.folder.id).subscribe({
          next:(resp:any) =>{
            //console.log('folder-details');
            this.folder = this.folderService.selectedFolder;
          },
          complete:()=>{},
        });
      },
      error:(resp)=>{
        //console.log(resp);
      }
    });
  }
  
  addNewFolder(){
    const dialogConfig = new MatDialogConfig();
    
    let passdata:string = '{"parentFolderId": "'+this.folder.id+'"}';
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = false;
    dialogConfig.id = 'newfolder-modal-component';
    dialogConfig.width = '350px';
    dialogConfig.data = passdata;
    dialogConfig.panelClass = 'bg-dialog-folder';
    const modalDialog = this.matDialog.open(NewFolderComponent, dialogConfig);
    
    this.matDialog.getDialogById('newfolder-modal-component').afterClosed().subscribe({
      next:()=>{
        
         this.folder = this.folderService.selectedFolder;
         this.onFolderCardClick(this.folder);
      }
    });
  }

  onAddDocument(){
    this.router.navigate(['dashboard/home/adddocument',{type:'folder'}]);
  }
  
  renameFileModal(file) {
    const dialogConfig = new MatDialogConfig();

    let passdata:string = '{"docName": "'+file.name+'","docid": "'+file.docid+'","systemId": "'+file.systemId+'","fromLocation":"folder" }';
    
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = false;
    dialogConfig.id = 'rename-doc-component';
    dialogConfig.width = '350px';
    dialogConfig.panelClass = 'bg-dialog-folder';
    dialogConfig.data = passdata;

    const renameFileDialog = this.matDialog.open(RenameModalComponent, dialogConfig);

    this.matDialog.getDialogById('rename-doc-component').afterClosed().subscribe({
      next:()=>{
        
        this.folderService
        .getFolderDetails(this.selected_folder_id)
        .subscribe({
          next:() =>{

            this.folder = this.folderService.selectedFolder

          },
          complete:()=>{},
        });

      }
    });

  }

  onSwipe(evt, doc: DocumentData) {
    const swipeDirection = Math.abs(evt.deltaX) > 40 ? (evt.deltaX > 0 ? 'right' : 'left'):'';
    
    //console.log('swiped '+swipeDirection);
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

  sortByDocDate(){
    if(this.sortDocDateByAsc){
      this.folder.docs.sort((a, b) => {  
        try{

          let dateA = new Date(a.createdAt);
          let dateB = new Date(b.createdAt);

          if ((dateA instanceof Date && !isNaN(dateA.getTime()))&&(dateB instanceof Date && !isNaN(dateB.getTime()))) {
            //valid date object
            return dateA >= dateB ? 1 : -1; 
          } else {
            console.log("invalid date");
          }
        } catch(e){
          //console.log(e);
        }
        
    });
      this.sortDocDateByAsc = !this.sortDocDateByAsc;
    } else {
      this.folder.docs.reverse();
      this.sortDocDateByAsc = !this.sortDocDateByAsc;
    }
    
  }

  sortSubFoldersDate(){
    if(this.sortSubFolderDate){
      this.folder.subFolders.sort((a,b)=>{
        try{
          let dateA = new Date(a.createdAt);
          let dateB = new Date (b.createdAt);
          if ((dateA instanceof Date && !isNaN(dateA.getTime()))&&(dateB instanceof Date && !isNaN(dateB.getTime()))) {
            //valid date object
            return dateA >= dateB ? 1 : -1; 
          } else {
            console.log("invalid date");
          }
        }
        catch(e){
          //console.log(e);
        }
      });
      this.sortSubFolderDate = !this.sortSubFolderDate;
    }
    else{
      this.folder.subFolders.reverse();
      this.sortSubFolderDate = !this.sortSubFolderDate;
    }
  }

  addNewDoc(folder: FolderData) {
    const dialogConfig = new MatDialogConfig();

    let passdata:string = '{ "folderName": "'+folder.folderName+'","folderId": "'+folder.id+'","document_type":"folder" }';
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = false;
    dialogConfig.id = 'add-document-modal-component';
    dialogConfig.width = '400px';
    dialogConfig.data = passdata;

    dialogConfig.panelClass = 'bg-dialog-folder';
    const modalDialog = this.matDialog.open(AddPageModalComponent, dialogConfig);
    
    this.matDialog.getDialogById('add-document-modal-component').afterClosed().subscribe({
      next:()=>{
        this.folderService.getFolderDetails(this.folder.id).subscribe({
          next:(resp:any) =>{
            //console.log('folder-details');
            this.folder = this.folderService.selectedFolder;
          },
          complete:()=>{},
        });
      },
      error:(resp)=>{
        //console.log(resp);
      }
    });
  }

  onSubFolderSwipe(evt,subfolder:FolderData){
    const swipeDirection = Math.abs(evt.deltaX) > 40 ? (evt.deltaX > 0 ? 'right' : 'left'):'';
    
    //console.log('swiped '+swipeDirection);
    switch(swipeDirection){
      case 'left':{
        subfolder.swipedLeft = true;
        break;
      }
      case 'right':{

       subfolder.swipedLeft = false;
        break;
      }
    }

  }

  renameSubFolder(subfolder:FolderData){
    const dialogConfig = new MatDialogConfig();
    let passdata:string = '{"folderName": "'+subfolder.folderName+'","folderId": "'+subfolder.id+'"}';
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = false;
    dialogConfig.id = 'renamefolder-modal-component';
    dialogConfig.width = '350px';
    dialogConfig.data = passdata;

    dialogConfig.panelClass = 'bg-dialog-folder';
    const modalDialog = this.matDialog.open(RenameFolderComponent, dialogConfig);
    
    this.matDialog.getDialogById('renamefolder-modal-component').afterClosed().subscribe({
      next:()=>{
        this.folderService.getFolderDetails(this.folder.id).subscribe({
          next:(resp:any) =>{
            //console.log('folder-details');
            this.folder = this.folderService.selectedFolder;
          },
          complete:()=>{},
        });
      },
      error:(resp)=>{
        //console.log(resp);
      }
    });
  }

  sortDocumentsByDateOnly(){
    this.folder.docs.sort((a, b) => {  
      try{

        let dateA = new Date(a.createdAt);
        let dateB = new Date(b.createdAt);

        if ((dateA instanceof Date && !isNaN(dateA.getTime()))&&(dateB instanceof Date && !isNaN(dateB.getTime()))) {
          //valid date object
          return dateA >= dateB ? 1 : -1; 
        } else {
          //console.log("invalid date");
        }
      } catch(e){
        //console.log(e);
      }
      
  });

  }


}