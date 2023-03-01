import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DocumentData } from '../../models/document.model';
import { RenameModalComponent } from '../rename-modal/rename-modal.component';

@Component({
  selector: 'app-document-item',
  templateUrl: './document-item.component.html',
  styleUrls: ['./document-item.component.css']
})
export class DocumentItemComponent implements OnInit {

  @Input() doc: DocumentData;

  broker_icon_link: string;
  selected_theme:   string;

  sharedWithBroker: boolean;

  constructor(private router: Router,private matDialog: MatDialog) { 

    this.broker_icon_link = "../assets/icon_broker_simple_default.svg"; // default broker icon
    this.selected_theme   = "";

    this.sharedWithBroker = false;
  }

  ngOnInit() {

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

  onDocumentClick(doc: DocumentData){
    this.router.navigate(['dashboard/home/contract-detail/fileview', { id: doc.linkToDoc}],{ skipLocationChange: false });
  }


  openModal(file) {
    const dialogConfig = new MatDialogConfig();
    // let passdata:string = '{"fileName": "'+this.file.name+'","fileUrl": "'+this.file.fileUrl+'"}';
    let passdata:string = '{"docName": "'+file.name+'","docid": "'+file.docid+'","systemId": "'+file.systemId+'"}';
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = false;
    dialogConfig.id = 'modal-component';
    // dialogConfig.height = '80%';
    // dialogConfig.width = '90%';
    dialogConfig.data = passdata;
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(RenameModalComponent, dialogConfig);
  }
}