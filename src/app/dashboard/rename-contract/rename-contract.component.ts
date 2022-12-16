import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RenameContractService } from '../../services/rename-contract.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-rename-contract',
  templateUrl: './rename-contract.component.html',
  styleUrls: ['./rename-contract.component.css']
})
export class RenameContractComponent implements OnInit {

  dataObj:{
    contractName: string,
    contractId: string
  };
  documentName: string = "";
  newContractName: string= "";

  submitted: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA)public data:any, 
    private renameService: RenameContractService,
    private dialogRef: MatDialogRef<RenameContractComponent>,
    private snackBar: MatSnackBar,
    private translate:TranslateService) { 

    this.dataObj = JSON.parse(this.data);
    this.documentName = this.dataObj.contractName;
    
  }

  ngOnInit() {
    // alert(this.data);
  }

  onSubmit(formData: any) {

    this.submitted = true;

    //console.log(formData);

    this.renameService.rename(this.dataObj.contractId , formData).subscribe({
      next:(resp)=>{
        //console.log(resp);
        this.submitted = false;
      },
      error:(e)=>{

        this.submitted = false;
    
        //show snackbar with error message
        this.snackBar.open(this.translate.instant('rename_contract.contract_rename_error'), this.translate.instant('snack_bar.action_button'),{
          panelClass: ['snack_error'],
           duration:5000,
        });

        //close dialog
        this.dialogRef.close();
        
      },
      complete:()=>{

        this.submitted = false;

        //show snackbar with success message
        this.snackBar.open(this.translate.instant('rename_contract.contract_rename_success'), this.translate.instant('snack_bar.action_button'),{
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