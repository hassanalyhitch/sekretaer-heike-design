import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-rename-modal',
  templateUrl: './rename-modal.component.html',
  styleUrls: ['./rename-modal.component.css']
})
export class RenameModalComponent implements OnInit {

  dataObj:{
    docName: string,
    docid: string
  };
  documentName: string = "";
  newDocName: string= "";
  constructor(@Inject(MAT_DIALOG_DATA)public data:any) { 

    this.dataObj = JSON.parse(this.data);
    this.documentName = this.dataObj.docName;
    

  }

  ngOnInit() {
  }
  
  onSubmit(formData: any) {
  
  }

}