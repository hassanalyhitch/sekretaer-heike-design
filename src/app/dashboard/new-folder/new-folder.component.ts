import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewFolderService } from '../../services/new-folder.service';

@Component({
  selector: 'app-new-folder',
  templateUrl: './new-folder.component.html',
  styleUrls: ['./new-folder.component.css']
})
export class NewFolderComponent implements OnInit {

 
  newFolderName: string= "";

  constructor(@Inject(MAT_DIALOG_DATA)public data:any, private newFolderService: NewFolderService, private dialogRef: MatDialogRef<NewFolderComponent>) { 
    
  }

  ngOnInit() {
  }
  
  onSubmit(formData: any) {
    console.log(formData);
    this.newFolderService.addNewFolder(this.newFolderName).subscribe({
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