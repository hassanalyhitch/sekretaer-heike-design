import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FoldersService } from '../../services/folder.service';

@Component({
  selector: 'app-new-folder',
  templateUrl: './new-folder.component.html',
  styleUrls: ['./new-folder.component.css']
})
export class NewFolderComponent implements OnInit {

 
  newFolderName: string= "";

  constructor(@Inject(MAT_DIALOG_DATA)public data:any, private folderService: FoldersService, private dialogRef: MatDialogRef<NewFolderComponent>) { 
    this.data = JSON.parse(this.data);

  }

  ngOnInit() {
  }
  
  onSubmit(formData: any) {
    console.log(this.newFolderName, this.data.parentFolderId);
    this.folderService.addNewFolder(this.newFolderName, this.data.parentFolderId).subscribe({
      next:(resp)=>{
        console.log(resp);
        this.dialogRef.close();
      },
      error:(resp)=>{
        console.log(resp);
      },
      complete:()=>{
        
      }
    });
    
  }

}