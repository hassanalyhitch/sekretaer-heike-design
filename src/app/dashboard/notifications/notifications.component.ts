import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotificationData } from '../../models/notification.model';
import { NotificationsService } from '../../services/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  allNotifsArr:NotificationData[] = [];
  searchValue = "";

  constructor(private router:Router, private notifService: NotificationsService) { 
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

}