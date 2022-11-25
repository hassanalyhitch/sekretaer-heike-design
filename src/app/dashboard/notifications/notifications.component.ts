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
  copyOfAllNotifsArr:NotificationData[] = [];
  searchValue = "";

  //sort arrays
  ascType:NotificationData[] = [];
  descType:NotificationData[] = [];
  sortTypeByAsc:boolean = true;

  ascTitle:NotificationData[] = [];
  descTitle:NotificationData[] = [];
  sortTitleByAsc:boolean = true;

  ascDate:NotificationData[] = [];
  descDate:NotificationData[] = [];
  sortDateByAsc:boolean = true;

  constructor(private router:Router, private notifService: NotificationsService) { 
    
  }

  ngOnInit() {
    this._init();

  }

  _init(){
    this.notifService.getNotifications().subscribe({
      next:(resp)=>{
        
        if(Array.isArray(resp)){
          resp.sort((a, b) => a.isRead.localeCompare(b.isRead));
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
      },
      complete:()=>{
        console.log(this.allNotifsArr.length);
      }
    });
    //a copy to avoid unneccesary network requests
    this.copyOfAllNotifsArr = this.allNotifsArr;
  }

  filterSearch(searchValue:string){
    console.log(searchValue);
    if(searchValue != undefined && searchValue != ""){
      let searchResult = this.allNotifsArr.filter((obj) => {
        if( obj.infoHeadline.toLowerCase().includes(searchValue.toLowerCase())
         || (obj.infoText != null && obj.infoText.toLowerCase().includes(searchValue.toLowerCase()))){
          return true;
        }
      });
      this.allNotifsArr = searchResult;
    } else if( searchValue == ""){
      this.allNotifsArr = this.copyOfAllNotifsArr;
    }
  }

  sortByType(){
    
    if(this.sortTypeByAsc){
      this.ascType = this.allNotifsArr.sort((a, b) => a.links[0].assocType.localeCompare(b.links[0].assocType));
      this.allNotifsArr = this.ascType;
      this.sortTypeByAsc = !this.sortTypeByAsc;
    } else {
      this.descType = this.allNotifsArr.sort((a, b) => a.links[0].assocType.localeCompare(b.links[0].assocType)).reverse();
      this.allNotifsArr = this.descType;
      this.sortTypeByAsc = !this.sortTypeByAsc;

    }
  }

  sortByTitle(){
    if(this.sortTitleByAsc){
      this.ascTitle = this.allNotifsArr.sort((a, b) => a.infoHeadline.localeCompare(b.infoHeadline));
      this.allNotifsArr = this.ascTitle;
      this.sortTitleByAsc = !this.sortTitleByAsc;
    } else {
      this.descTitle = this.allNotifsArr.sort((a, b) => a.infoHeadline.localeCompare(b.infoHeadline)).reverse();
      this.allNotifsArr = this.descTitle;
      this.sortTitleByAsc = !this.sortTitleByAsc;

    }
  }

  sortByDate(){
    if(this.sortDateByAsc){
      this.ascDate = this.allNotifsArr.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      this.allNotifsArr = this.ascDate;
      this.sortDateByAsc = !this.sortDateByAsc;
    } else {
      this.descDate = this.allNotifsArr.sort((a, b) => a.createdAt.localeCompare(b.createdAt)).reverse();
      this.allNotifsArr = this.descDate;
      this.sortDateByAsc = !this.sortDateByAsc;

    }
  }

}