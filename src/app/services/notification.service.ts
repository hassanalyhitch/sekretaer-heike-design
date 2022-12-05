import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Observer, tap } from "rxjs";
import { NotificationData } from "../models/notification.model";
import { LoginService } from "./login.service";

@Injectable({ providedIn: 'root' })
export class NotificationsService {

  notification: NotificationData = <NotificationData>{
    notificationId: "",
    customerLoginId: "",
    customerAmsidnr: "",
    createdAt: "",
    readTime: "",
    infoText: "",
    infoHeadline: "",
    isRead: 0,
    links: []
  };
  observer: Observer<NotificationData>;
  selectObservable: Observable<NotificationData>;
  userNotificationsArr: NotificationData[]; 
  notifCount: number = 0;

  constructor(private http: HttpClient, private loginService: LoginService) {
    this.getUnreadNotifications().subscribe({
      next:(resp)=>{
        
        if(Array.isArray(resp)){
          this.notifCount = resp.length;
        }
      },
      error:(error: any)=>{

        if(error instanceof HttpErrorResponse){
          //Invalid Token or Unauthorised request
          if(error.status == 401){
            this.loginService.emitAuthenticated(false);
          }
        }

      }
    });
  }
 
  emitSelectedNotification(notification:NotificationData){
    this.notification = notification;
  }

  getNotifications() {
    return this.http.get('https://testapi.maxpool.de/api/v1/sekretaer/notifications',{
          headers: new HttpHeaders({
                  'accept': 'application/json',
                  'Content-Type': 'application/json'
              }),
      }
    ).pipe(
      tap({
        next:()=>{

        },
        error:(error: any)=>{

          if(error instanceof HttpErrorResponse){
            //Invalid Token or Unauthorised request
            if(error.status == 401){
              this.loginService.emitAuthenticated(false);
            }
          }

        }
      })
    );

  }

  getUnreadNotifications() {
    return this.http.get('https://testapi.maxpool.de/api/v1/sekretaer/notifications/unread',{
          headers: new HttpHeaders({
                  'accept': 'application/json',
                  'Content-Type': 'application/json'
              }),
      }
    ).pipe(
      tap({
        next:()=>{

        },
        error:(error: any)=>{

          if(error instanceof HttpErrorResponse){
            //Invalid Token or Unauthorised request
            if(error.status == 401){
              this.loginService.emitAuthenticated(false);
            }
          }

        }
      })
    );

  }
  
  markAsRead(notificationId){

    let url ='https://testapi.maxpool.de/api/v1/sekretaer/notifications/'+notificationId+'/mark/read';

    return this.http.put(url, {
      headers: new HttpHeaders({
        'accept': 'application/json',
        'Content-Type': 'application/json',
      }),
    }).pipe(
      tap({
        next:()=>{

        },
        error:(error: any)=>{

          if(error instanceof HttpErrorResponse){
            //Invalid Token or Unauthorised request
            if(error.status == 401){
              this.loginService.emitAuthenticated(false);
            }
          }

        }
      })
    );
  }

  

}