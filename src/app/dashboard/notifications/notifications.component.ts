import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

  constructor(private router:Router, private notifService: NotificationsService) { 
    this.notifService.getNotifications().subscribe({
      next:(resp)=>{
        console.table(resp);
        if(Array.isArray(resp)){

          for(let item of resp){
            //format date 
            try{
              item['createdAt'] = formatDate(item['createdAt'], "dd.MM.YYYY","en");
              item['readTime'] = formatDate(item['readTime'], "dd.MM.YYYY","en");

            } catch(e:any){
              console.log(e.message);
            }
            let notif: NotificationData = {
              notificationId: item['notificationId'],
              loginId: item['loginId'],
              customerAmsidnr: item['customerAmsidnr'],
              createdAt: item['createdAt'],
              readTime: item['readTime'],
              assocType: item['assocType'],
              assocId: item['assocId'],
              assocType2: item['assocType2'],
              assocId2: item['assocId2'],
              info: item['info']
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