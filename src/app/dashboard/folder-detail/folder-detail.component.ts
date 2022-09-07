import { Component, OnInit } from '@angular/core';
import { FolderData } from '../../models/folder.model';
import { FoldersService } from '../../services/folder.service';

@Component({
  selector: 'app-folder-detail',
  templateUrl: './folder-detail.component.html',
  styleUrls: ['./folder-detail.component.css']
})
export class FolderDetailComponent implements OnInit {

  folder: FolderData;

  constructor(private folderService: FoldersService) { }

  ngOnInit() {
    console.log(this.folderService.selectedFolder);
    this.folder = this.folderService.selectedFolder;
  }

}