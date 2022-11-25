import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotificationData } from '../../../models/notification.model';
import { NotificationsService } from '../../../services/notification.service';
import { NotificationModalComponent } from '../notification-modal/notification-modal.component';

@Component({
  selector: 'app-notification-item',
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.css']
})
export class NotificationItemComponent implements OnInit {

  notifMessage:string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam";
  @Input() notification: NotificationData;

  notifIcon:string = "";

  constructor(
    private router: Router,private notificationService: NotificationsService, private matDialog: MatDialog) { }

  ngOnInit() {
    
    if(this.notification.links != null && this.notification.links.length > 0){

      for(let i=0; i<this.notification.links.length; i++){

        switch(this.notification.links[i].assocType){
          case "vamsidnr" : {
            this.notifIcon = "/assets/icon_document.svg";
            break;
          }
          case "dms" : {
            this.notifIcon = "/assets/icon_pdf.svg";
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
            this.notifIcon = "/assets/icon_document.svg";
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
  
  openModal(notification: NotificationData) {
    const dialogConfig = new MatDialogConfig();
    let passdata:string = JSON.stringify(this.notification);
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = false;
    dialogConfig.id = 'notification-modal-component';
    dialogConfig.height = '90%';
    dialogConfig.width = '90%';
    dialogConfig.data = passdata;
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(NotificationModalComponent, dialogConfig);
  }

  //emeit selected notification, and navigate to notification-detail
  onNotificationClick(notification: NotificationData){
    this.notificationService.emitSelectedNotification(notification);
    this.router.navigate(["dashboard/home/notifications/notification-detail"]);
  }

}