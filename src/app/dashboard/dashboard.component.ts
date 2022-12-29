import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpErrorResponse,HttpHeaders} from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public lat;
  public lng;

  constructor(private http:HttpClient,
    private snackbar:MatSnackBar,
    private translate: TranslateService) { }

  ngOnInit() {
    // this.getLocation();
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (position) {
          console.log("Latitude: " + position.coords.latitude +
            "Longitude: " + position.coords.longitude);
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          this.whereIsThis(this.lat, this.lng).subscribe({
            next:(resp)=>{
              alert(resp);
              this.snackbar.open(this.translate.instant('contract_detail.mark_fav_error'),this.translate.instant('snack_bar.action_button'),{
                duration:1500
              });
            },
            error:(resp)=>{
              alert(resp);
            }
          });
        }
      },
        (error) => console.log(error));
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  whereIsThis(Latitude: number, Longitude: number){
    //Call API
    return this.http.get('http://api.openweathermap.org/geo/1.0/reverse?lat='+Latitude+'&lon='+Longitude+'&limit=5&appid={585bb7ca9265879a6b7e815bdf5f027d}')
  }
}