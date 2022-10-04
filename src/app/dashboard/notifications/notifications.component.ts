import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotificationData } from '../../models/notification.model';
import { NotificationsService } from '../../services/notification.service';
import { NotificationModalComponent } from './notification-modal/notification-modal.component';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  allNotifsArr:NotificationData[] = [];

  constructor(private router:Router, private notifService: NotificationsService, private matDialog: MatDialog) { 
    this.notifService.getNotifications().subscribe({
      next:(resp)=>{
        console.table(resp);
        if(Array.isArray(resp)){
          resp.sort((a, b) => a.isRead.localeCompare(b.isRead))
          for(let item of resp){
            //format date 
            try{
              item['createdAt'] = formatDate(item['createdAt'], "dd.MM.YYYY","en");

            } catch(e:any){
              console.log(e.message);
            }
            let notif: NotificationData = {
              notificationId: item['notificationId'],
              customerLoginId: item['customerLoginId'],
              customerAmsidnr: item['customerAmsidnr'],
              createdAt: item['createdAt'],
              readTime: item['readTime'],
              infoText: item['infoText'],
              infoHeadline: item['infoHeadline'],
              isRead: item['isRead'],
              links: item['links']
            };
            this.allNotifsArr.push(notif);
          }
        } else{
          //error
        }
      }
    });
  }

  ngOnInit() {
  }

  openModal(notification: NotificationData) {
    const dialogConfig = new MatDialogConfig();
    let passdata:string = '{"notification": "'+notification+'"}';
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = false;
    dialogConfig.id = 'notification-modal-component';
    dialogConfig.height = '90%';
    dialogConfig.width = '90%';
    dialogConfig.data = passdata;
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(NotificationModalComponent, dialogConfig);
  }
}