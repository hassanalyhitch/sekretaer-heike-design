import { Component, ElementRef, Inject, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { FileNameData } from 'src/app/models/file-name.model';
import { UploadFileData } from 'src/app/models/upload-file.model';
import { FileSizePipe } from 'src/app/pipes/filesize.pipe';

@Component({
  selector: 'app-edit-small-picture',
  templateUrl: './edit-small-picture.component.html',
  styleUrls: ['./edit-small-picture.component.scss'],
  providers: [FileSizePipe]
})
export class EditSmallPictureComponent implements OnInit {

  dataObj:{
    contractId: string,
    smallPictureLink: string,
  };

  small_picture_src_link: string;
  contract_id: string;

  file: File;
  uploadFileArr: UploadFileData[];

  submitted: boolean;
  small_picture_deleted: boolean;
  showFileName:boolean;

  @ViewChild("selectFile",{static:true}) selectFile:ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA)public data:any,
    private _snackBar: MatSnackBar,
    private translate:TranslateService,
    private fileSizePipe:FileSizePipe,
    private dialogRef: MatDialogRef<EditSmallPictureComponent>) {

      this.small_picture_src_link = '../../../assets/upload-snippet.png';
      this.contract_id = "";
      this.uploadFileArr = [];
      this.file = null;

      this.submitted = false;
      this.small_picture_deleted = false;
      this.showFileName = false;

     }

  ngOnInit(): void {
    this.dataObj = JSON.parse(this.data);
    this.contract_id = this.dataObj.contractId;
    this.small_picture_src_link = this.dataObj.smallPictureLink;
  }

  closeDialog(){
    this.dialogRef.close();
  }

  onSubmit(fileData: FileNameData){

    fileData.doc_file = this.file;
  
    console.table(fileData);

    this.closeDialog();
     
  }
  
  getFileName(event){
  
      this.file = event.target.files[0];
      
      if (this.file.type =='image/png' || this.file.type =='image/jpeg') {
 
        // Encode the file using the FileReader API
        const reader = new FileReader();

        reader.onloadend = () => {
            console.log(reader.result);
            this.small_picture_src_link = reader.result.toString();
            // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
        };

        reader.readAsDataURL(this.file);

        this.showFileName = true;
  
        let _file:UploadFileData ={
          doc_file:this.file,
          fileId : this.uploadFileArr.length +"",
          fileName :this.file.name,
  
          fileSize :this.fileSizePipe.transform(this.file.size,'MB'),
          
          fileType:this.file.type
        
        }
  
        this.uploadFileArr = [];
        this.uploadFileArr.push(_file);
        this.selectFile.nativeElement.value = null;
  
      } else{
        //Reset data
        this.uploadFileArr = [];
        this.selectFile.nativeElement.value = null;
  
        //The file not PDF or JPEG
        this._snackBar.open(
          this.translate.instant('add_document.file_type_alert'),
          this.translate.instant('snack_bar.action_button'),
          {
            panelClass:['snack_fileType'],
            duration: 8000,
          });
  
      }
  
    }
    deleteSmallPicture(contract_id: string){
      console.log("Delete Small Picture Called: Contract Id ->"+contract_id);
      this.closeDialog();
    }

}
