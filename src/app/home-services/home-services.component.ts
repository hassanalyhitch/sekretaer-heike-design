import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BrokerService } from '../services/broker.service';
import { BrokerData } from '../models/broker.model';
import { NotificationsService } from '../services/notification.service';

@Component({
  selector: 'app-home-services',
  templateUrl: './home-services.component.html',
  styleUrls: ['./home-services.component.scss']
})

export class HomeServicesComponent implements OnInit {

  notifCount: number = 0;

  zeroNotifCount:boolean = false;
  isNotificationCountText: boolean = false;
  
  telto: string = "tel:";
  brokerNumber: string = "";

  constructor(
    private router: Router,
    private brokerService:BrokerService,
    private notificationService: NotificationsService) { }

  ngOnInit(): void {

    this.brokerService.getBrokerDetails().subscribe({
      next:(resp:BrokerData)=>{

        this.brokerNumber = resp.myBroker.tel1;
        this.telto = this.telto + this.brokerNumber;


        this.notificationService.getUnreadNotifications().subscribe({
          next: () => {
            this.notifCount = this.notificationService.notifCount;
            if(this.notifCount >= 0 && this.notifCount <= 99){
    
              this.isNotificationCountText = false;
    
            } else if(this.notifCount > 99){
    
              this.isNotificationCountText = true;
    
            } else{
              this.zeroNotifCount = true;
            }
            
          },
          complete:()=>{}
        });

      },
      complete:()=>{
      }
    });

  }

  onAddPage() {
    this.router.navigate(["dashboard/home/adddocument"]);
  }

  onNotifClick() {
    this.router.navigate(["dashboard/home/notifications"]);
  }
  onChatClick() {
    this.router.navigate(["dashboard/home/chat"]);
  }

  onOpenBrokerPage() {
    this.router.navigate(["dashboard/broker"]);
  }

}
