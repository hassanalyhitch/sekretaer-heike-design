import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
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

  submitted: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA)public data:any, 
    private folderService: FoldersService,
    private dialogRef: MatDialogRef<RenameFolderComponent>,
    private snackBar: MatSnackBar,
    private translate:TranslateService) { 

      this.dataObj = JSON.parse(this.data);
      this.documentName = this.dataObj.folderName;
  }

  ngOnInit() {
    // alert(this.data);
  }


  onSubmit(formData: any) {

    this.submitted = true;

    //console.log(formData);

    this.folderService.rename(this.dataObj.folderId , formData).subscribe({
      next:(resp)=>{
        //console.log(resp);
        this.submitted = false;
      },
      error:(e)=>{

        this.submitted = false;
    
        //show snackbar with error message
        this.snackBar.open(this.translate.instant('rename_folder.folder_rename_error'),  this.translate.instant('snack_bar.action_button'),{
          panelClass: ['snack_error'],
           duration:5000,
        });

        //close dialog
        this.dialogRef.close();
        
      },
      complete:()=>{

        this.submitted = false;

        //show snackbar with success message
        this.snackBar.open(this.translate.instant('rename_folder.folder_rename_success'), this.translate.instant('snack_bar.action_button'),{
          panelClass: ['snack_success'],
          duration:5000,
        });

        //close dialog
        this.dialogRef.close();
        
      }
    });

  }

  closeDialog(){
    this.dialogRef.close();
  } 
}