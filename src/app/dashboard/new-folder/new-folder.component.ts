import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { FoldersService } from '../../services/folder.service';

@Component({
  selector: 'app-new-folder',
  templateUrl: './new-folder.component.html',
  styleUrls: ['./new-folder.component.css']
})
export class NewFolderComponent implements OnInit {

  newFolderName: string= "";

  submitted: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA)public data:any, 
              private folderService: FoldersService, 
              private dialogRef: MatDialogRef<NewFolderComponent>,
              private snackBar: MatSnackBar,
              private translate:TranslateService) { 
                this.data = JSON.parse(this.data);
              }

  ngOnInit() {}

  onSubmit(formData: any) {
  

    this.submitted = true;

    //create a sub folder
    if (this.data.parentFolderId > 0){


      this.folderService.addNewFolder(this.newFolderName, this.data.parentFolderId).subscribe({
        next:(resp)=>{
          this.submitted = false;
          this.dialogRef.close(); 
        },
        error:(resp)=>{
          this.submitted = false;

          //show snackbar with error message
          this.snackBar.open(this.translate.instant('new_folder_dialog.sub_folder_creation_error'), this.translate.instant('snack_bar.action_button'),{
            panelClass: ['snack_error'],
             duration:5000,
          });

        },
        complete:()=>{
          this.submitted = false;

          //show snackbar with success message
          this.snackBar.open(this.translate.instant('new_folder_dialog.sub_folder_creation_success'), this.translate.instant('snack_bar.action_button'),{
            panelClass: ['snack_success'],
            duration:5000,
          });

        }
      });
      
    //create a parent folder
    } else if (this.data.parentFolderId == 0){
      this.folderService.addNewFolder(this.newFolderName, "0").subscribe({
        next:(resp)=>{
          this.submitted = false;
          this.dialogRef.close();
        },
        error:(resp)=>{
          this.submitted = false;         
          //show snackbar with error message
          this.snackBar.open(this.translate.instant('new_folder_dialog.folder_creation_error'),  this.translate.instant('snack_bar.action_button'),{
            panelClass: ['snack_error'],
             duration:5000,
          });

        },
        complete:()=>{
          this.submitted = false;

          //show snackbar with success message
          this.snackBar.open(this.translate.instant('new_folder_dialog.folder_creation_success'), this.translate.instant('snack_bar.action_button'),{
            panelClass: ['snack_success'],
            duration:5000,
          });

        }
      });

    }
    
  }

  closeDialog(){
   this.dialogRef.close();
  }

}