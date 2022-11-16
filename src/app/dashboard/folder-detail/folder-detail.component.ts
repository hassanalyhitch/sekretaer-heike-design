import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-folder-detail',
  templateUrl: './folder-detail.component.html',
  styleUrls: ['./folder-detail.component.css']
})
export class FolderDetailComponent implements OnInit, OnDestroy {

  folder: FolderData;
  //hrTitle: string;
  //hrTitle2: string;

  parentNav: string = '';
  currentNav: string = '';
  mainFolder: FolderData;
  parentFolder: FolderData;
  hasParent: boolean = false;
  routeListener: Subscription;
  visitedFolderArray:FolderData[] = [];

  constructor(
    private router:Router, 
    private route:ActivatedRoute, 
    private folderService: FoldersService,
    private matDialog: MatDialog, 
    private translate:TranslateService, 
    private _location: Location,
    private downloadService: DownloadService) { }

  ngOnInit() {
    console.table(this.folderService.selectedFolder);    
    //this.hrTitle = this.translate.instant('folder-detail.documents');
    //this.hrTitle2 = this.translate.instant('folder-detail.subfolder');

    // const wholeDocTemplate = document.getElementsByClassName('section-folderdetail').item(0) as HTMLElement | null;
    // if (wholeDocTemplate != null) {
    //   document.getElementById("folder-hr").setAttribute('data-content', this.hrTitle2);
    //   document.getElementById("docu-hr").setAttribute('data-content', this.hrTitle);
    // } 

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


  }

  ngOnDestroy(){
    this.hasParent = false;
    console.log('hasParent -> '+this.hasParent);
    this.routeListener.unsubscribe();
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
    this.folderService.makeFolderFavourite(folder.id).subscribe({
      next:(resp:any)=>{
        console.log(resp);
        this.folder.favoriteId = resp.id;
        this.folder.isFavorite = 1;
      },
      error:(resp)=>{
        console.log(resp);
        console.log(folder.customerAmsidnr);
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
    dialogConfig.height = '350px';
    dialogConfig.width = '350px';
    dialogConfig.data = passdata;

    dialogConfig.panelClass = 'bg-dialog-folder';
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(RenameFolderComponent, dialogConfig);
    
    this.matDialog.getDialogById('renamefolder-modal-component').afterClosed().subscribe({
      next:()=>{

        // this.currentNav = resp.folderName;
        // this.folder.folderName = resp.foldername;
        
         this.folder = this.folderService.selectedFolder;
         this.currentNav = this.folder.folderName;
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
    dialogConfig.height = '400px';
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
    this.router.navigate(['dashboard/home/adddocument']);
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
}