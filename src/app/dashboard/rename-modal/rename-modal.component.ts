import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RenameDocumentService } from '../../services/rename-doc.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-rename-modal',
  templateUrl: './rename-modal.component.html',
  styleUrls: ['./rename-modal.component.css']
})
export class RenameModalComponent implements OnInit {

  dataObj:{
    docName: string,
    docid: string,
    systemId: string
  };
  documentName: string = "";
  newDocName: string= "";
  constructor(@Inject(MAT_DIALOG_DATA)public data:any, private renameDocService: RenameDocumentService, private _location: Location,private dialogRef: MatDialogRef<RenameModalComponent>) { 

    this.dataObj = JSON.parse(this.data);
    this.documentName = this.dataObj.docName;
    
    // console.log(this.dataObj);

  }

  ngOnInit() {
  }
  
  onSubmit(formData: any) {
    this.renameDocService.rename(this.dataObj.systemId, this.dataObj.docid, formData).subscribe({
      complete:()=>{ 
        this.dialogRef.close();
      }
    });
  }

}