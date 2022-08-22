import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { NotificationData } from "../models/notification.model";

@Injectable({ providedIn: 'root' })
export class FoldersService {


  constructor(private http: HttpClient) {
  }
 
  emitSelectedNotifications(folder:NotificationData){
    // this.folder = folder;
  }

  getNotifications() {
    return this.http.get(
      'https://testapi.maxpool.de/api/v1/sekretaer/notifications/unread',
      {
          headers: new HttpHeaders({
                  'accept': 'application/json',
                  'Content-Type': 'application/json'
              }),
      }
    );

  }

}