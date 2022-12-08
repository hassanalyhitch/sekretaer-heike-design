import { Component, OnInit } from '@angular/core';
import { NotificationData } from '../../../models/notification.model';
import { NotificationsService } from '../../../services/notification.service';

@Component({
  selector: 'app-notification-detail',
  templateUrl: './notification-detail.component.html',
  styleUrls: ['./notification-detail.component.css']
})
export class NotificationDetailComponent implements OnInit {

  notification:NotificationData;

  constructor(private notificationService: NotificationsService) { }

  ngOnInit() {
    this.notification = this.notificationService.notification;

    console.log(this.notification);
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

  contains(obj) {
    let i = this.notification.links.length;
    while (i--) {
       if (this.notification.links[i].assocType === obj) {
           return true;
       }
    }
    return false;
  }

}