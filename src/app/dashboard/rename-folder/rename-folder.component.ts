import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FoldersService } from '../../services/folder.service';

@Component({
  selector: 'app-rename-folder',
  templateUrl: './rename-folder.component.html',
  styleUrls: ['./rename-folder.component.css']
})
export class RenameFolderComponent implements OnInit {

  dataObj:{
    folderName: string,
    folderId: string
  };
  documentName: string = "";
  newFolderName: string= "";

  constructor(@Inject(MAT_DIALOG_DATA)public data:any, private folderService: FoldersService,private dialogRef: MatDialogRef<RenameFolderComponent>) { 

    this.dataObj = JSON.parse(this.data);
    this.documentName = this.dataObj.folderName;
    
  }

  ngOnInit() {
    // alert(this.data);
  }

  onSubmit(formData: any) {
    console.log(formData);
    this.folderService.rename(this.dataObj.folderId , formData).subscribe({
      complete:()=>{ 
        this.dialogRef.close();
      }
    });
  }

  closeDialog(){
    this.dialogRef.close();
  } 
}