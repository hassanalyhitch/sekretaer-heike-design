import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentData } from '../../models/document.model';

@Component({
  selector: 'app-document-item',
  templateUrl: './document-item.component.html',
  styleUrls: ['./document-item.component.css']
})
export class DocumentItemComponent implements OnInit {

  @Input() doc: DocumentData;
  constructor(private router: Router) { }

  ngOnInit() {
    if(this.doc){
      // console.log(this.doc);
      if(this.doc.createdAt){
        //format date 
        this.doc.createdAt = formatDate(this.doc.createdAt, "dd.MM.YYYY","en");
      }
    }
  }
  onDocumentClick(doc: DocumentData){

    this.router.navigate(['dashboard/home/contract-detail/fileview', { id: doc.linkToDoc}],{ skipLocationChange: false });
  }

}