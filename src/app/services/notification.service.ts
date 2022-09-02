import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Observer } from "rxjs";
import { NotificationData } from "../models/notification.model";

@Injectable({ providedIn: 'root' })
export class NotificationsService {

  notification: NotificationData = <NotificationData>{
    notificationId: 0,
    customerLoginId: 0,
    customerAmsidnr: "",
    createdAt: "",
    readTime: "",
    assocType: "",
    assocId: "",
    assocType2: "",
    assocId2: "",
    infoHeadline: "",
    infoText: "",
    isRead: "",
    links: ""
  };
  observer: Observer<NotificationData>;
  selectObservable: Observable<NotificationData>;
  userNotificationsArr: NotificationData[]; 
  notifCount: number = 0;

  constructor(private http: HttpClient) {
    this.getNotifications().subscribe({
      next:(resp)=>{
        
        if(Array.isArray(resp)){
          this.notifCount = resp.length;
        }
      }
    });
  }
 
  emitSelectedNotification(notification:NotificationData){
    this.notification = notification;
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