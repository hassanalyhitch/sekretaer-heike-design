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

  notMobile = false;

  constructor(private http:HttpClient,
    private snackbar:MatSnackBar,
    private translate: TranslateService) { }

  ngOnInit() {
    this.getLocation();
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (position) {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          this.whereIsThis(this.lat, this.lng).subscribe({
            next:(resp:any)=>{
              // this.snackbar.open("You are accessing from "+resp.display_name,this.translate.instant('snack_bar.action_button'),{
              //   duration:10000,
              //   panelClass:['snack'],
              // });
            },
            error:(resp)=>{
             
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
    //https://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit={limit}&appid={API key}
    //https://eu1.locationiq.com/v1/reverse?key=YOUR_ACCESS_TOKEN&lat=LATITUDE&lon=LONGITUDE&format=json
    //Call API
    return this.http.get('https://eu1.locationiq.com/v1/reverse?key=pk.343eb1cee62c9704c1e140a97a783dd6&lat='+Latitude+'&lon='+Longitude+'&format=json');
    // return this.http.get('https://api.openweathermap.org/geo/1.0/reverse?lat='+Latitude+'&lon='+Longitude+'&appid=585bb7ca9265879a6b7e815bdf5f027d');
  }
}