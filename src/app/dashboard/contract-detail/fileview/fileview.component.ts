import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fileview',
  templateUrl: './fileview.component.html',
  styleUrls: ['./fileview.component.css']
})
export class FileviewComponent implements OnInit {

  
  fileName:string;
  linkToDoc:string;
  fileurl:string = "https://docs.google.com/gview?&embedded=true&url=";
  baseUrl:string = "https://testapi.maxpool.de";
  safeUrl:SafeResourceUrl ;
  previewLoaded:boolean = false;

  constructor(private route: ActivatedRoute,private sanitizer:DomSanitizer) { 

    this.linkToDoc = this.route.snapshot.paramMap.get('id');

    // this.fileName = this.dataObj.fileName;
    this.fileurl = this.fileurl + this.baseUrl+this.linkToDoc;
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.fileurl)
    console.log(this.safeUrl);}

  ngOnInit() {
    document.getElementById('embedView').addEventListener("load",()=>{
      this.previewLoaded = true;
    },false);
  }

}