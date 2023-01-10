import { formatDate } from '@angular/common';
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

  notifIcon:string = "/assets/icon_document.svg";
  bg_white:boolean = false;
  isInfo:boolean = false;
  formatedDate:string;

  constructor(
    private router: Router,private notificationService: NotificationsService, private matDialog: MatDialog) { }

  ngOnInit() {
    
    if(this.notification.links != null && this.notification.links.length > 0){

      for(let i=0; i<this.notification.links.length; i++){

        switch(this.notification.links[i].assocType){
          case "vamsidnr" : {
            this.notifIcon = "/assets/icon_document.svg";
            this.bg_white = false;
            this.isInfo = false;
            break;
          }
          case "dms" : {
            this.notifIcon = "/assets/icon_pdf.svg";
            this.bg_white = false;
            this.isInfo = false;
            break;
          }
          case "chat" : {
            this.notifIcon = "/assets/chat-icon.svg";
            this.bg_white = true;
            this.isInfo = false;
            break;
          }
          case "info" : {
            this.notifIcon = "/assets/info-icon.svg";
            this.bg_white = true;
            this.isInfo = true;
            break;
          }
          default: {
            this.notifIcon = "/assets/icon_document.svg";
            break;
          }
        }
      }
    }
    this.formatedDate = this.dateEngine(this.notification.createdAt);
    if(this.formatedDate == "Invalid Date") this.formatedDate = "" ;
  }

  dateEngine(a_date){
    a_date = new Date(a_date);
    const today = new Date
    const yesterday = new Date; 
    yesterday.setDate(today.getDate() - 1);

    if((a_date > this.fiveDaysAgo(today))){

      if(a_date.toLocaleDateString() == today.toLocaleDateString()){
        return 'Today'
      }else if (a_date.toLocaleDateString() == yesterday.toLocaleDateString()) {
        return 'Yesterday'
      }
      return a_date.toLocaleDateString('en-US', {
        weekday : 'long'
      });

    } else {
      // format date 
        try{
          a_date = formatDate(a_date, "dd.MM.YYYY","en");
          return a_date;
        } catch(e:any){
          
          return a_date;
        }
    }
  }

  fiveDaysAgo(date, days:number = 4) {
    var result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
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