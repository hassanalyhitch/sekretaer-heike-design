import { HttpClient,HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BrokerService {

  constructor(private http:HttpClient) { }

  getBrokerDetails(){
    return this.http.get(
        'https://testapi.maxpool.de/api/v1/sekretaer/myprofile',
        {
          headers: new HttpHeaders({
                  'accept': 'application/json',
                  'Content-Type': 'application/json'
            }),
        }
      );
  }
}
