import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationData } from '../../../models/notification.model';
import { NotificationsService } from '../../../services/notification.service';

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.css']
})
export class NotificationModalComponent implements OnInit {

  notification: NotificationData;

  constructor(
    @Inject(MAT_DIALOG_DATA)public data:any, 
    private notificationService: NotificationsService, 
    private dialogRef: MatDialogRef<NotificationModalComponent>) { 

  }

  ngOnInit() {
    this.notification = JSON.parse(this.data);
    console.log(this.notification);
  }
  
  onCloseModal(){
    this.dialogRef.close();
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