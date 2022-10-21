import { Component, Input,OnInit } from '@angular/core';
import { FolderData } from '../../models/folder.model';

@Component({
  selector: 'app-sub-folder-card',
  templateUrl: './sub-folder-card.component.html',
  styleUrls: ['./sub-folder-card.component.css']
})

export class SubFolderCardComponent implements OnInit{

  @Input() folder:FolderData = <FolderData>{
    id :  "",
    loginId :  "",
    customerAmsidnr :  "",
    ownerFolderId :  "",
    folderName :  "",
    createTime :  "",
    createdAt :  "",
    subFolders : [],
    docs: [],
    isSelected:false
  };

  constructor() { }

  ngOnInit() {}

}
