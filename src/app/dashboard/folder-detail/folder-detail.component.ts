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

@Component({
  selector: 'app-folder-detail',
  templateUrl: './folder-detail.component.html',
  styleUrls: ['./folder-detail.component.css']
})
export class FolderDetailComponent implements OnInit, OnDestroy {

 folder:FolderData;
  //hrTitle: string;
  //hrTitle2: string;

  parentNav: string = '';
  currentNav: string = '';
  mainFolder: FolderData;
  parentFolder: FolderData;
  hasParent: boolean = false;
  routeListener: Subscription;
  visitedFolderArray:FolderData[] = [];

  docArr: DocumentData[] = [];
  folderSub:Subscription;
  sortDocDateByAsc:boolean =true;

  sortSubFolderDate:boolean =true;
  subFoldersArr:FolderData[] = [];

  constructor(
    private router:Router, 
    private route:ActivatedRoute, 
    private folderService: FoldersService,
    private matDialog: MatDialog, 
    private translate:TranslateService, 
    private _location: Location,
    private downloadService: DownloadService,
    private snackbar:MatSnackBar
    ) { 

    }

  ngOnInit() {

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
    
    this.folderSub = this.folderService.selectObservable.subscribe({
      next:(folder) => {
        this.folder = folder;
        this.folderService
        .getFolderDetails(this.folder.id)
        .subscribe({
          next:(resp:any) =>{
            console.log('folder-details');
            if(resp.hasOwnProperty('docs')){
              for (let i = 0; i< resp.docs.length; i++){
                // this.folder.docs.push(resp.docs[i]);
                console.log(folder.docs.length); 
              }
                 
            }
          },
          complete:()=>{},
        });
      },
    });



  }

  ngOnDestroy(){
    this.hasParent = false;
    console.log('hasParent -> '+this.hasParent);
    this.routeListener.unsubscribe();
    this.visitedFolderArray = [];
    // this.folderSub.unsubscribe();
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
    this.folderService.makeFolderFavourite(folder.id).subscribe({
      next:(resp:any)=>{
        console.log(resp);
        this.folder.favoriteId = resp.id;
        this.folder.isFavorite = 1;
      },
      error:(resp)=>{
        console.log(resp);
        console.log(folder.customerAmsidnr);
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
    this.folderService.deleteFolderFavourite(folder.favoriteId).subscribe({
      next:(resp:any)=>{
        console.log(resp);
        this.folder.isFavorite = 0;
      },
      error:(resp)=>{
        console.log(resp);
        console.log(folder.favoriteId);
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
        this.folderService.getFolderDetails(this.folder.id).subscribe({
          next:(resp:any) =>{
            console.log('folder-details');
            this.folder = this.folderService.selectedFolder;
          },
          complete:()=>{},
        });
      },
      error:(resp)=>{
        console.log(resp);
      }
    });
  }
  
  addNewFolder(){
    const dialogConfig = new MatDialogConfig();
    
    let passdata:string = '{"parentFolderId": "'+this.folder.id+'"}';
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = false;
    dialogConfig.id = 'newfolder-modal-component';
    //dialogConfig.height = '400px';
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
    // let passdata:string = '{"fileName": "'+this.file.name+'","fileUrl": "'+this.file.fileUrl+'"}';
    let passdata:string = '{"docName": "'+file.name+'","docid": "'+file.docid+'","systemId": "'+file.systemId+'"}';
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = false;
    dialogConfig.id = 'modal-component';
    // dialogConfig.height = '80%';
    dialogConfig.width = '350px';
    dialogConfig.panelClass = 'bg-dialog-folder';
    dialogConfig.data = passdata;
    // https://material.angular.io/components/dialog/overview
    const renameFileDialog = this.matDialog.open(RenameModalComponent, dialogConfig);
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

  onClick(doc: DocumentData){
    console.log('tap !');
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
          console.log(e);
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
          console.log(e);
        }
      });
      this.sortSubFolderDate = !this.sortSubFolderDate;
    }
    else{
      this.folder.subFolders.reverse();
      this.sortSubFolderDate = !this.sortSubFolderDate;
    }
  }
}