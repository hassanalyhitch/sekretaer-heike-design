import { LoadingService } from '../../../services/loading.service';
import { Component, OnInit } from '@angular/core';
import { PersonalData } from '../../../models/personal-data.model';
import { PersonalDataService } from '../../../services/personal-data.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-my-data',
  templateUrl: './my-data.component.html',
  styleUrls: ['./my-data.component.scss']
})
export class MyDataComponent implements OnInit {
  myStreet:string[]=[];
  myName:string[]=[];

  myZipCode:string ="";
  myCity:string ="";
  

  constructor(private personaldataService:PersonalDataService ,
    private loadingService:LoadingService,
    private _location:Location,
    ) {
    this.loadingService.emitIsLoading(true);
   }

  ngOnInit(): void {
    this.personaldataService.getMyPersonalDetails().subscribe({
      next:(resp:PersonalData) =>{
       
        this.myName = resp.myData.ShowName.split(", ");
        this.myCity = resp.myData.City;
        this.myZipCode = resp.myData.ZipCode;
        this.myStreet = resp.myData.Street.split(" ");
      },
      complete:()=>{
        this.loadingService.emitIsLoading(false);
      }
    });
  }
  onBackNavClick(){
    this._location.back();
  }
  onSubmit(personalData:PersonalData){
   
  }

}
