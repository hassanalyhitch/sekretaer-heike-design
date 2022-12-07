import { LoadingService } from '../../services/loading.service';
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

  constructor(private router:Router, private notifService: NotificationsService,private loadingService:LoadingService) 
  { 
    this.loadingService.emitIsLoading(true);
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
        // console.table(this.allNotifsArr);
        this.loadingService.emitIsLoading(false);
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
    console.log("sortByType");
    if(this.sortTypeByAsc){
      this.allNotifsArr.sort((a, b) => {
        if(a.links === null){
          console.log(a);
        }
        if(a.links === null||b.links === null){
          return -1;
        } else {
        return a.links[0].assocType.localeCompare(b.links[0].assocType);}
      });
      this.sortTypeByAsc = !this.sortTypeByAsc;
    } else {
      this.allNotifsArr.reverse();
      this.sortTypeByAsc = !this.sortTypeByAsc;

    }
  }

  sortByTitle(){
    console.log("sortByTitle");
    if(this.sortTitleByAsc){
      this.allNotifsArr.sort((a, b) => {
        // console.log(a.infoHeadline);
        if(a.infoHeadline === null || b.infoHeadline === null){
          return -1;
        }
        return a.infoHeadline.localeCompare(b.infoHeadline);
      });
      this.sortTitleByAsc = !this.sortTitleByAsc;
    } else {
      this.allNotifsArr.reverse();
      this.sortTitleByAsc = !this.sortTitleByAsc;

    }
  }

  sortByDate(){
    console.log("sortByDate");
    if(this.sortDateByAsc){
      this.allNotifsArr.sort((a, b) => {  
        try{

          var dateA = new Date(a.createdAt).getTime();
          var dateB = new Date(b.createdAt).getTime();

        } catch(e){
          return 1;
        }
        
        return dateA > dateB ? 1 : -1;  
    });
      this.sortDateByAsc = !this.sortDateByAsc;
    } else {
      this.allNotifsArr.reverse();
      this.sortDateByAsc = !this.sortDateByAsc;

    }
  }

}