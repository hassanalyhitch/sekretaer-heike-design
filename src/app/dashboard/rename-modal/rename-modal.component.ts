import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RenameDocumentService } from '../../services/rename-doc.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

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

  submitted: boolean = false;

  shareWithBroker:boolean=true;
  acceptShare:string ="/assets/icon_broker.svg";
  denyShare:string = "/assets/icons8-done-30.png";

  constructor(
    @Inject(MAT_DIALOG_DATA)public data:any, 
    private renameDocService: RenameDocumentService, 
    private snackBar: MatSnackBar,
    private translate:TranslateService,
    private dialogRef: MatDialogRef<RenameModalComponent>) { 

    this.dataObj = JSON.parse(this.data);
    this.documentName = this.dataObj.docName;
    
    // console.log(this.dataObj);

  }

  ngOnInit() {
  }
  
  onSubmit(formData: any) {

    this.submitted = true;

    this.renameDocService.rename(this.dataObj.systemId, this.dataObj.docid, formData).subscribe({
      next:(resp)=>{
        this.submitted = false;
      },
      error:(e)=>{

        this.submitted = false;
    
        //show snackbar with error message
        this.snackBar.open(this.translate.instant('rename_document.document_rename_error'),  this.translate.instant('snack_bar.action_button'),{
          panelClass: ['snack_error'],
           duration:5000,
        });

        //close dialog
        this.dialogRef.close();
        
      },
      complete:()=>{

        this.submitted = false;

        //show snackbar with success message
        this.snackBar.open(this.translate.instant('rename_document.document_rename_success'), this.translate.instant('snack_bar.action_button'),{
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
  
  onShareWithBroker(){
    this.shareWithBroker = !this.shareWithBroker;
    this.acceptShare = this.shareWithBroker ?  "/assets/icon_broker.svg": "/assets/broker_pink.svg";
  }

}