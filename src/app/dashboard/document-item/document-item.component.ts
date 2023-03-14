import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DownloadService } from 'src/app/services/download-file.service';
import { DocumentData } from '../../models/document.model';
import { RenameModalComponent } from '../rename-modal/rename-modal.component';

@Component({
  selector: 'app-document-item',
  templateUrl: './document-item.component.html',
  styleUrls: ['./document-item.component.css']
})
export class DocumentItemComponent implements OnInit {

  @Input() doc: DocumentData;

  @Input() from_location: string;

  broker_icon_link: string;
  selected_theme:   string;

  sharedWithBroker: boolean;
  enableSharedWithBrokerIcon: boolean;

  //document extension
  isDocument: boolean;
  isPDF: boolean;
  isJPEG: boolean;

  constructor(
    private router: Router,
    private matDialog: MatDialog,
    private snackbar:MatSnackBar,
    private translate: TranslateService,
    private downloadService: DownloadService,
  ) { 

    this.broker_icon_link = "../assets/icon_broker_simple_default.svg"; // default broker icon
    this.selected_theme   = "";

    this.sharedWithBroker = false;
    this.enableSharedWithBrokerIcon = false;

    //document extension
    this.isDocument = false;
    this.isPDF = false;
    this.isJPEG = false;
  }

  ngOnInit() {

    if(this.from_location == "contract_details"){
      this.enableSharedWithBrokerIcon = true;
    } else if(this.from_location == "folder"){
      this.enableSharedWithBrokerIcon = false;
    }

    console.log("Document Item Extension -> "+this.doc.extension);

    //check file extension
    if(this.doc.extension == "pdf"){
      this.isPDF = true;
    } else if(this.doc.extension == "docx"){
      this.isDocument = true;
    } else if(this.doc.extension == "jpg"){
      this.isJPEG = true;
    } else {
      this.isDocument = true;
    }

    this.selected_theme = localStorage.getItem('theme_selected');

    if(this.sharedWithBroker && !this.selected_theme){

      this.broker_icon_link = "../assets/icon_broker_simple_pink.svg";

    } else if(this.sharedWithBroker && this.selected_theme == 'pink'){

      this.broker_icon_link = "../assets/icon_broker_simple_pink.svg";

    } else if(this.sharedWithBroker && this.selected_theme == 'blue'){

      this.broker_icon_link = "../assets/icon_broker_simple_blue.svg";

    } else {

      // default broker icon
      this.broker_icon_link = "../assets/icon_broker_simple_default.svg"; 
    }
    
  }

  // onDocumentClick(doc: DocumentData){
  //   this.router.navigate(['dashboard/home/contract-detail/fileview', { id: doc.linkToDoc}],{ skipLocationChange: false });
  // }

  // openModal(file) {
  //   const dialogConfig = new MatDialogConfig();
  //   // let passdata:string = '{"fileName": "'+this.file.name+'","fileUrl": "'+this.file.fileUrl+'"}';
  //   let passdata:string = '{"docName": "'+file.name+'","docid": "'+file.docid+'","systemId": "'+file.systemId+'"}';
  //   // The user can't close the dialog by clicking outside its body
  //   dialogConfig.disableClose = false;
  //   dialogConfig.id = 'modal-component';
  //   // dialogConfig.height = '80%';
  //   // dialogConfig.width = '90%';
  //   dialogConfig.data = passdata;
  //   // https://material.angular.io/components/dialog/overview
  //   const modalDialog = this.matDialog.open(RenameModalComponent, dialogConfig);
  // }

  //onDocumentClick(doc: DocumentData){

    // console.log('Document Download Initiated!');

    // this.snackbar.open(this.translate.instant('contract_detail.document_download_request'), 
    // this.translate.instant('snack_bar.action_button'),{
    //   duration: 8000,
    //   panelClass:['snack'],
    // });

    // -------------------------------------------------------------------------------------------//
    //                 downloading using blob                                                     //
    // -------------------------------------------------------------------------------------------//
    // this.downloadService.getDownloadFile(doc.systemId, doc.docid).subscribe({
    //   next:(resp:any)=>{
        
    //   // const keys = resp.headers.keys();
    //   // var headers = keys.map(key =>
    //   //     `${key}=>: ${resp.headers.get(key)}`
    //   //   );

    //   let nameWithExtension = resp.headers.get('content-disposition').split("=")[1];
    //   console.log(nameWithExtension);

    //     try{
    //       var mimetype = "application/octetstream" //hacky approach that browsers seem to accept.
    //       var file = new File([resp.body], doc.name,{type: mimetype});
    //       const url = window.URL.createObjectURL(file);

    //       const link = document.createElement('a');
    //       link.setAttribute('target', '_blank');
    //       link.setAttribute('href', url);
    //       link.setAttribute('download', nameWithExtension);
    //       document.body.appendChild(link);
    //       link.click();
    //       link.remove();
          
    //       URL.revokeObjectURL(url);

    //     } catch(e){
    //       console.log(e);
    //     }
    //   },
    //   error: (resp) => {
    //     // console.log(resp);
    //     // console.log(contract.details.favoriteId);
    //     this.snackbar.open("Download request failed.",this.translate.instant('snack_bar.action_button'),{
    //       panelClass:['snack_error'],
    //       duration:1500,
    //     })
    //   }
    // });

    // -------------------------------------------------------------------------------------------//
    //                 downloading using base64                                                     //
    // -------------------------------------------------------------------------------------------//
    // this.downloadService.getBase64DownloadFile(doc.systemId, doc.docid).subscribe({
    //   next:(resp:any)=>{
    //     console.log(resp.body);
    //     //use of application/octetstream is a hacky approach that browsers seem to accept.
    //     let base64String = "data:application/octetstream;base64," + resp.body.document;
        
    //     const link = document.createElement('a');
    //     link.setAttribute('target', '_blank');
    //     link.setAttribute('href', base64String);
    //     link.setAttribute('download', resp.body.meta.name+'.'+resp.body.meta.extension);
    //     document.body.appendChild(link);
    //     link.click();
    //     link.remove();
    //   },
    //   error: (resp) => {
    //     console.log(resp);

    //     this.snackbar.open(
    //       this.translate.instant('contract_detail.document_download_failed'),
    //       this.translate.instant('snack_bar.action_button'),{
    //         panelClass:['snack_error'],
    //         duration: 8000,
    //     });

    //   }
    // });

  //}

  onDocumentClick(doc: DocumentData){

    console.log('tap !');

    this.snackbar.open("Download requested. Please wait.", this.translate.instant('snack_bar.action_button'),{
      duration:5000,
      panelClass:['snack'],
    });
    
    // -------------------------------------------------------------------------------------------//
    //                 downloading using blob                                                     //
    // -------------------------------------------------------------------------------------------//
    // this.downloadService.getDownloadFile(doc.systemId, doc.docid).subscribe({
    //   next:(resp:any)=>{
        
    //   // const keys = resp.headers.keys();
    //   // var headers = keys.map(key =>
    //   //     `${key}=>: ${resp.headers.get(key)}`
    //   //   );

    //   let nameWithExtension = resp.headers.get('content-disposition').split("=")[1];
    //   console.log(nameWithExtension);

    //     try{
    //       var mimetype = "application/octetstream" //hacky approach that browsers seem to accept.
    //       var file = new File([resp.body], doc.name,{type: mimetype});
    //       const url = window.URL.createObjectURL(file);

    //       const link = document.createElement('a');
    //       link.setAttribute('target', '_blank');
    //       link.setAttribute('href', url);
    //       link.setAttribute('download', nameWithExtension);
    //       document.body.appendChild(link);
    //       link.click();
    //       link.remove();
          
    //       URL.revokeObjectURL(url);

    //     } catch(e){
    //       console.log(e);
    //     }
    //   },
    //   error: (resp) => {
    //     // console.log(resp);
    //     // console.log(contract.details.favoriteId);
    //     this.snackbar.open("Download request failed.",this.translate.instant('snack_bar.action_button'),{
    //       panelClass:['snack_error'],
    //       duration:1500,
    //     })
    //   }
    // });


    // -------------------------------------------------------------------------------------------//
    //                 downloading using base64                                                     //
    // -------------------------------------------------------------------------------------------//
    this.downloadService.getBase64DownloadFile(doc.systemId, doc.docid).subscribe({
      next:(resp:any)=>{
        console.log(resp.url.split("/api")[0]+resp.body.linkToDoc);
        //use of application/octetstream is a hacky approach that browsers seem to accept.
        // let base64String = "data:application/octetstream;base64," + resp.body.document;
        
        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        link.setAttribute('href', resp.url.split("/api")[0]+resp.body.linkToDoc);
        link.setAttribute('download', resp.body.name+'.'+resp.body.extension);
        document.body.appendChild(link);
        link.click();
        link.remove();
        this.snackbar.open("Downloading (https:) Test File", this.translate.instant('snack_bar.action_button'),{
          duration:5000,
          panelClass:['snack'],
        });
      },
      error: (resp) => {
        console.log(resp);
        this.snackbar.open("Download request failed.",this.translate.instant('snack_bar.action_button'),{
          panelClass:['snack_error'],
          duration:1500,
        })
      }
    });
  }

  onShareWithBroker(){
    this.sharedWithBroker =!this.sharedWithBroker;

    this.selected_theme = localStorage.getItem('theme_selected');

    if(this.sharedWithBroker && !this.selected_theme){

      this.broker_icon_link = "../assets/icon_broker_simple_pink.svg";

      // display snackbar message
      this.snackbar.open(
        this.translate.instant('contract_detail.shared_with_broker'),
        this.translate.instant('snack_bar.action_button'),{
          duration: 8000,
          panelClass:['snack_success'],
        }
      );

    } else if(this.sharedWithBroker && this.selected_theme == 'pink'){

      this.broker_icon_link = "../assets/icon_broker_simple_pink.svg";

      // display snackbar message
      this.snackbar.open(
        this.translate.instant('contract_detail.shared_with_broker'),
        this.translate.instant('snack_bar.action_button'),{
          duration: 8000,
          panelClass:['snack_success'],
        }
      );

    } else if(this.sharedWithBroker && this.selected_theme == 'blue'){

      this.broker_icon_link = "../assets/icon_broker_simple_blue.svg";

      // display snackbar message
      this.snackbar.open(
        this.translate.instant('contract_detail.shared_with_broker'),
        this.translate.instant('snack_bar.action_button'),{
          duration: 8000,
          panelClass:['snack_success'],
        }
      );

    } else {

      // default broker icon
      this.broker_icon_link = "../assets/icon_broker_simple_default.svg";
      
      // display snackbar message
      this.snackbar.open(
        this.translate.instant('contract_detail.unshared_with_broker'),
        this.translate.instant('snack_bar.action_button'),{
          duration: 8000,
          panelClass:['snack_error'],
        }
      );
      
    }
    
  }

}