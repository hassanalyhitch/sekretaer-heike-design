import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, Event, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { FolderData } from '../../models/folder.model';
import { FoldersService } from '../../services/folder.service';
import { Location } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RenameContractComponent } from '../rename-contract/rename-contract.component';

@Component({
  selector: 'app-folder-detail',
  templateUrl: './folder-detail.component.html',
  styleUrls: ['./folder-detail.component.css']
})
export class FolderDetailComponent implements OnInit, OnDestroy {

  folder: FolderData;
  hrTitle: string;
  hrTitle2: string;

  parentNav: string = '';
  currentNav: string = '';
  mainFolder: FolderData;
  parentFolder: FolderData;
  hasParent: boolean = false;
  routeListener: Subscription;
  visitedFolderArray:FolderData[] = [];

  constructor(private router:Router, private route:ActivatedRoute, private folderService: FoldersService,private matDialog: MatDialog, private translate:TranslateService, private _location: Location) { }

  ngOnInit() {
    console.log(this.folderService.selectedFolder);
    this.hrTitle = this.translate.instant('insurance.detail.hrtitle');
    this.hrTitle2 = this.translate.instant('folder-detail.subfolder');

    const wholeDocTemplate = document.getElementsByClassName('section-folderdetail').item(0) as HTMLElement | null;
    if (wholeDocTemplate != null) {
      document.getElementById("folder-hr").setAttribute('data-content', this.hrTitle2);
      document.getElementById("docu-hr").setAttribute('data-content', this.hrTitle);
    } 

    this.routeListener = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        
        this.folder = this.folderService.selectedFolder;

        if(this.visitedFolderArray.length>0){
          for(let i=0; i<this.visitedFolderArray.length; i++){
            
            if(this.visitedFolderArray[i].id == this.route.snapshot.params['id']){
              
              this.folderService.emitSelectedFolder(this.visitedFolderArray[i]);
              this.folder = this.folderService.selectedFolder;

              for(let x=0; x<this.visitedFolderArray.length; x++){
                if(this.visitedFolderArray[x].id == this.folder.ownerFolderId){
                  this.parentNav = this.visitedFolderArray[x].folderName;
                }
              }
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
  
  onFolderCardClick(clickedFolder: FolderData, index){
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
    let passdata:string = '{"contractName": "'+folder.folderName+'","contractId": "'+folder.id+'"}';
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = false;
    dialogConfig.id = 'renamecontract-modal-component';
    // dialogConfig.height = '80%';
    // dialogConfig.width = '90%';
    dialogConfig.data = passdata;
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(RenameContractComponent, dialogConfig);
  }
}