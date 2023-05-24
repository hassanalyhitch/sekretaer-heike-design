import { LoadingService } from '../../services/loading.service';
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

          //console.log(resp);

          resp.sort((a, b) => a.isRead.toString().localeCompare(b.isRead.toString()));

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
            
          //console.log('notifArr Date A '+notif.createdAt);

          if(notif.createdAt.includes('.')){
            let d1:string = notif.createdAt.split(' ')[0];
            
            notif.createdAt = d1.split('.').reverse().toString().replace(/,/g,".") + " " + notif.createdAt.split(' ')[1];

          }
            
            this.allNotifsArr.push(notif);

           // console.log('Created at -> '+notif.createdAt);
          }

          

          //this.allNotifsArr[2].createdAt = "2023.04.25 06:07:34";
          //this.allNotifsArr[3].createdAt = "2023.04.24 05:07:34";

        } else{
          //error
        }
      },
      complete:()=>{
        this.loadingService.emitIsLoading(false);
      }
    });
    //a copy to avoid unneccesary network requests
    this.copyOfAllNotifsArr = this.allNotifsArr;
  }

  filterSearch(searchValue:string){
    if(searchValue != undefined && searchValue != ""){
      let searchResult = this.allNotifsArr.filter((obj) => {
        if( obj.infoHeadline != null && obj.infoHeadline.toLowerCase().includes(searchValue.toLowerCase())
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
      this.allNotifsArr.sort((a, b) => {
        if(a.links === null && b.links === null){
          return -1;
        } else if(a.links === null && b.links !== null){
          return 1;
        } else if(a.links !== null && b.links === null){
          return -1;
        } else {
          return a.links[0].assocType.localeCompare(b.links[0].assocType);
        }
      });
      this.sortTypeByAsc = !this.sortTypeByAsc;
    } else {
      this.allNotifsArr.reverse();
      this.sortTypeByAsc = !this.sortTypeByAsc;

    }
  }

  sortByTitle(){
    //console.log('before sorting ',this.sortTitleByAsc);
    //console.table(this.allNotifsArr);

    if(this.sortTitleByAsc){
      this.allNotifsArr.sort((a, b) => {
       
        if(a.infoHeadline !== null && b.infoHeadline !== null) {
          return a.infoHeadline.toLowerCase().localeCompare(b.infoHeadline.toLowerCase());
        } else if(a.infoHeadline === null && b.infoHeadline === null){
          return 0;
        } else if(a.infoHeadline === null && b.infoHeadline !== null){
          return 1;
        } else if(a.infoHeadline !== null && b.infoHeadline === null){
          return -1;
        } 
      });
      this.sortTitleByAsc = !this.sortTitleByAsc;
      //console.log('after sorting ',this.sortTitleByAsc);
      //console.table(this.allNotifsArr);
    } else {
      this.allNotifsArr.reverse();
      this.sortTitleByAsc = !this.sortTitleByAsc;
      //console.log('Reverse array',this.sortTitleByAsc);
      //console.table(this.allNotifsArr);

    }
  }

  sortByDate(){
    if(this.sortDateByAsc){
      this.allNotifsArr = this.allNotifsArr.sort((a, b) => { 

        try{

          let dateA = new Date(a.createdAt);
          let dateB = new Date(b.createdAt);

          if ((dateA instanceof Date && !isNaN(dateA.getTime()))&&(dateB instanceof Date && !isNaN(dateB.getTime()))) {
            //valid date object
            return dateA >= dateB ? 1 : -1; 
          } else if((dateA instanceof Date && !isNaN(dateA.getTime()))&& !(dateB instanceof Date && !isNaN(dateB.getTime()))){
            // invalid date object
            return -1;
          } else if(!(dateA instanceof Date && !isNaN(dateA.getTime()))&& (dateB instanceof Date && !isNaN(dateB.getTime()))){
            // invalid date object
            return 1;
          } else {
            return 0;
          }
        } catch(e){
        }
        
    });

    //console.table(this.allNotifsArr);

      this.sortDateByAsc = !this.sortDateByAsc;
    } else {
      this.allNotifsArr.reverse();
      //console.table(this.allNotifsArr);
      this.sortDateByAsc = !this.sortDateByAsc;

    }
  }

}