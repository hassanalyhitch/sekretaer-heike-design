import { LoadingService } from 'src/app/services/loading.service';
import { Component, OnInit } from '@angular/core';
import { PersonalData } from 'src/app/models/personal-data.model';
import { PersonalDataService } from 'src/app/services/personal-data.service';

@Component({
  selector: 'app-my-data',
  templateUrl: './my-data.component.html',
  styleUrls: ['./my-data.component.scss']
})
export class MyDataComponent implements OnInit {
  myName:string ="";
  myZipCode:string ="";
  myCity:string ="";
  myStreet:string= "";

  constructor(private personaldataService:PersonalDataService,private loadingService:LoadingService) {
    this.loadingService.emitIsLoading(true);
   }

  ngOnInit(): void {
    this.personaldataService.getMyPersonalDetails().subscribe({
      next:(resp:PersonalData) =>{
        console.log(resp);

        this.myName = resp.myData.VNAME;
        this.myCity = resp.myData.VN_ORT;
        this.myZipCode = resp.myData.VN_PLZ;
        this.myStreet = resp.myData.VN_STR;
      },
      complete:()=>{
        this.loadingService.emitIsLoading(false);
      }
    });
  }


}
