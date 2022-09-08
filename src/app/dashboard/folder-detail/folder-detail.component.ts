import { Component, OnInit } from '@angular/core';
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

  constructor(private folderService: FoldersService, private translate:TranslateService) { }

  ngOnInit() {
    console.log(this.folderService.selectedFolder);
    this.hrTitle = this.translate.instant('insurance.detail.hrtitle');
    const wholeDocTemplate = document.getElementsByClassName('section-folderdetail').item(0) as HTMLElement | null;
    if (wholeDocTemplate != null) {
      document.getElementById("docu-hr").setAttribute('data-content', this.hrTitle);
    } 
    this.folder = this.folderService.selectedFolder;
  }

}