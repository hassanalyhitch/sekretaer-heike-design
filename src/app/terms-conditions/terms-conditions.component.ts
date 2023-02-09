import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.css']
})

export class TermsConditionsComponent implements OnInit {

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

  onCloseButtonClicked(){
    this._location.back();
  }

}
