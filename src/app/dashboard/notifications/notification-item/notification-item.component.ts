import { Component, Input, OnInit } from '@angular/core';
import { NotificationData } from '../../../models/notification.model';
import { NotificationsService } from '../../../services/notification.service';

@Component({
  selector: 'app-notification-item',
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.css']
})
export class NotificationItemComponent implements OnInit {

  notifMessage:string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam";
  @Input() notification: NotificationData;

  notifIcon:string = "";

  constructor(private notificationService: NotificationsService) { }

  ngOnInit() {
    
    if(this.notification.links.length > 0){

      for(let i=0; i<this.notification.links.length; i++){

        switch(this.notification.links[i].assocType){
          case "vamsidnr" : {
            this.notifIcon = "/assets/contract-icon.svg";
            break;
          }
          case "dms" : {
            this.notifIcon = "/assets/doc-icon.svg";
            break;
          }
          case "chat" : {
            this.notifIcon = "/assets/chat-icon.svg";
            break;
          }
          case "info" : {
            this.notifIcon = "/assets/info-icon.svg";
            break;
          }
          default: {
            this.notifIcon = "/assets/doc-icon.svg";
            break;
          }
        }
      }
    }
  }

  contains(obj) {
    let i = this.notification.links.length;
    while (i--) {
       if (this.notification.links[i].assocType === obj) {
           return true;
       }
    }
    return false;
  }

  markAsRead(notificationId){
    this.notificationService.markAsRead(notificationId).subscribe({
      next:()=>{

      },
      error:()=>{

      },
      complete:()=>{

      }
    });
  }

}