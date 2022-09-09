import { Component, OnInit,Input,EventEmitter,Output } from '@angular/core';
import { UploadFileData } from '../../../../models/upload-file.model';


@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {

  @Input() uploadFile:UploadFileData;
  @Output() deleteFile = new EventEmitter <string>();
  constructor() { }

  ngOnInit(): void {
  }
  onDeleteFile(fileId){
    this.deleteFile.emit(fileId);
  }

}
