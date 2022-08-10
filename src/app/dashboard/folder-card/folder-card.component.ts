import { Component, Input, OnInit } from '@angular/core';
import { FolderData } from '../../models/folder.model';

@Component({
  selector: 'app-folder-card',
  templateUrl: './folder-card.component.html',
  styleUrls: ['./folder-card.component.css']
})
export class FolderCardComponent implements OnInit {

  @Input() folder:FolderData;
  constructor() { }

  ngOnInit() {
  }

}