import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})

export class PrivacyPolicyComponent implements OnInit, AfterContentInit {

  inSettings: boolean;

  constructor(private _location: Location) { }

  ngOnInit(): void {

    if(window.location.href.includes("settings")){
      //if logged in
      this.inSettings = true;
    } else {
      //if not logged in
      this.inSettings = false;
    }

  }

  ngAfterContentInit(){

      let myiFrame:any = document.getElementById("iFrame");
      let doc = myiFrame.contentDocument;
      doc.body.innerHTML = doc.body.innerHTML + 
      '<style>::-webkit-scrollbar {width: 0px;height: 0px;overflow-y: scroll;background: grey;box-shadow: inset 0 0 4px #707070;border-radius: 8px;}::-webkit-scrollbar-thumb {background: #009ee2;border-radius: 8px;}*{scrollbar-width: none !important;}</style>';
      console.log("ContentInit");
   
  }

  onCloseButtonClicked(){
    this._location.back();
  }

}
