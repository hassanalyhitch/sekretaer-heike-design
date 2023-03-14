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
    systemId: string,
    fromLocation: string
  };

  documentName: string;
  newDocName: string;
  share_with_broker_logo_link: string;
  selected_theme: string;

  broker_blue_logo: boolean;
  broker_pink_logo: boolean;
  shareWithBroker: boolean;
  submitted: boolean;
  enableShareWithBrokerIcon: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA)public data:any, 
    private renameDocService: RenameDocumentService, 
    private snackBar: MatSnackBar,
    private translate:TranslateService,
    private dialogRef: MatDialogRef<RenameModalComponent>) { 

    this.broker_blue_logo = false;
    this.broker_pink_logo = false;
    this.shareWithBroker  = false;
    this.submitted        = false;
    this.enableShareWithBrokerIcon = false;

    this.selected_theme              = "";
    this.share_with_broker_logo_link = "../assets/icon_broker_round_default.svg";
    this.documentName                = "";
    this.newDocName                  = "";

  }

  ngOnInit() {
    this.dataObj = JSON.parse(this.data);
    this.documentName = this.dataObj.docName;

    if(this.dataObj.fromLocation == "folder"){
      this.enableShareWithBrokerIcon = false;
    } else if(this.dataObj.fromLocation == "contract"){
      this.enableShareWithBrokerIcon = true;
    }

    this.selected_theme = localStorage.getItem('theme_selected');

    if(!this.selected_theme){
      //use default pink logo
      this.broker_pink_logo = true;

    } else if(this.selected_theme == 'pink'){
      //use pink logo
      this.broker_pink_logo = true;

    } else if(this.selected_theme == 'blue'){
      //use blue logo
      this.broker_blue_logo = true;

    }

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
        this.snackBar.open(
          this.translate.instant('rename_document.document_rename_error'),  
          this.translate.instant('snack_bar.action_button'),{
            panelClass: ['snack_error'],
            duration: 8000,
        });

        //close dialog
        this.dialogRef.close();
        
      },
      complete:()=>{

        this.submitted = false;

        //show snackbar with success message
       this.snackBar.open(
        this.translate.instant('rename_document.document_rename_success'), 
        this.translate.instant('snack_bar.action_button'),{
          panelClass: ['snack_success'],
          duration: 8000,
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

    if(this.shareWithBroker && this.broker_blue_logo){

      this.share_with_broker_logo_link = "../assets/icon_broker_round_blue.svg";

      // display snackbar message
      this.snackBar.open(
        this.translate.instant('contract_detail.shared_with_broker'),
        this.translate.instant('snack_bar.action_button'),{
          duration: 8000,
          panelClass:['snack_success'],
        }
      );

    } else if(this.shareWithBroker && this.broker_pink_logo){

      this.share_with_broker_logo_link = "../assets/icon_broker_round_pink.svg";

      // display snackbar message
      this.snackBar.open(
        this.translate.instant('contract_detail.shared_with_broker'),
        this.translate.instant('snack_bar.action_button'),{
          duration: 8000,
          panelClass:['snack_success'],
        }
      );

    } else {

      this.share_with_broker_logo_link = "../assets/icon_broker_round_default.svg";

      // display snackbar message
      this.snackBar.open(
        this.translate.instant('contract_detail.unshared_with_broker'),
        this.translate.instant('snack_bar.action_button'),{
          duration: 8000,
          panelClass:['snack_error'],
        }
      );

    }

  }

}