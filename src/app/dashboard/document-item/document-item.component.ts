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
  constructor(private router: Router,private matDialog: MatDialog) { }

  ngOnInit() {
    if(this.doc){
      // console.log(this.doc);
      if(this.doc.createdAt){
        try{
          //format date 
          this.doc.createdAt = formatDate(this.doc.createdAt, "dd.MM.YYYY","en");

        } catch(error){

        }
      }
    }
  }
  onDocumentClick(doc: DocumentData){

    this.router.navigate(['dashboard/home/contract-detail/fileview', { id: doc.linkToDoc}],{ skipLocationChange: false });
  }


}