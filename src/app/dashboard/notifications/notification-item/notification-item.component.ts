import { Component, Input, OnInit } from '@angular/core';
import { NotificationData } from '../../../models/notification.model';

@Component({
  selector: 'app-notification-item',
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.css']
})
export class NotificationItemComponent implements OnInit {

  notifMessage:string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam";
  @Input() notification: NotificationData;

  notifIcon:string = "";

  constructor() { }

  ngOnInit() {
    console.log(this.notification.info + " "+this.notification.customerAmsidnr);
    switch(this.notification.assocType){
      case "vamsidnr" : {
        this.notifIcon = "/assets/contract-icon.svg";
        break;
      }
      case "dms" : {
        this.notifIcon = "/assets/doc-icon.svg";
        break;
      }
      default: {
        this.notifIcon = "/assets/doc-icon.svg";
        break;
      }
    }
  }

}