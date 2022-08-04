import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-fileview',
  templateUrl: './fileview.component.html',
  styleUrls: ['./fileview.component.css']
})
export class FileviewComponent implements OnInit {

  
  fileName:string;
  dataObj:{
    fileName:string,
    fileUrl:string
  };
  fileurl:string = "https://docs.google.com/gview?&embedded=true&url=";
  safeUrl:SafeResourceUrl ;
  previewLoaded:boolean = false;

  constructor() { }

  ngOnInit() {
  }

}