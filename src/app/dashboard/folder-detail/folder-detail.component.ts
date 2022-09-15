import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FolderData } from '../../models/folder.model';
import { FoldersService } from '../../services/folder.service';

@Component({
  selector: 'app-folder-detail',
  templateUrl: './folder-detail.component.html',
  styleUrls: ['./folder-detail.component.css']
})
export class FolderDetailComponent implements OnInit {

  folder: FolderData;
  hrTitle: string;
  hrTitle2: string;

  constructor(private router:Router, private folderService: FoldersService, private translate:TranslateService) { }

  ngOnInit() {
    console.log(this.folderService.selectedFolder);
    this.hrTitle = this.translate.instant('insurance.detail.hrtitle');
    this.hrTitle2 = this.translate.instant('folder-detail.subfolder');

    const wholeDocTemplate = document.getElementsByClassName('section-folderdetail').item(0) as HTMLElement | null;
    if (wholeDocTemplate != null) {
      document.getElementById("folder-hr").setAttribute('data-content', this.hrTitle2);
      document.getElementById("docu-hr").setAttribute('data-content', this.hrTitle);
    } 

    this.folder = this.folderService.selectedFolder;

  }
  
  onFolderCardClick(clickedFolder: FolderData){
    console.log("open - > "+clickedFolder.id+" "+clickedFolder.folderName);
    this.folderService.emitSelectedFolder(clickedFolder);
    this.router.navigate(['dashboard/overview/folder-detail', { id: clickedFolder.id }]);
    this.folder = this.folderService.selectedFolder;
  }

}