import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { ContractsService } from "../../services/contracts.service";
import { formatDate } from "@angular/common";
import { ContractData } from "../../models/contract.model";
import { NotificationsService } from "../../services/notification.service";
import { LoginService } from "../../services/login.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  favArr: ContractData[] = [];
  allContractsArr: ContractData[] = [];
  notifCount: number = 0;
  isNotificationCountText: boolean = false;
  
  //chatCheck: number = 0;
  //insuranceCheck: number = 0;
  //isChatFabEnabled: boolean = false;

  @ViewChild("notif", { static: false }) notif: ElementRef<HTMLElement>;

  constructor(
    private router: Router,
    private contractService: ContractsService,
    private notificationService: NotificationsService
  ) {}

  ngOnInit() {
    this.contractService.getContracts().subscribe({
      complete: () => {
        this.allContractsArr = this.contractService.userContractsArr;
        // console.log('all_________________________________________________');
        // console.table(this.allContractsArr);
        this.allContractsArr.forEach((contract) => {
          if (contract.details.isFav === 1 || contract.details.isFav === "1") {
            this.favArr.push(contract);
          }
        });

        // console.log('fav_________________________________________________');
        // console.table(this.favArr);
      },
    });

    // this.notif.nativeElement.setAttribute("notification-count", this.notifCount+"");
    this.notificationService.getNotifications().subscribe({
      next: () => {
        this.notifCount = this.notificationService.notifCount;
        if(this.notifCount < 8){

          this.isNotificationCountText = false;

          // document
          // .getElementById("notif")
          // .setAttribute("notification-count", this.notifCount + "");

        } else if(this.notifCount > 8){

          this.isNotificationCountText = true;

        }
        
      },
    });

    // this.chatCheck = this.loginService.chatCheck;
    // this.insuranceCheck = this.loginService.insuranceCheck;

    // if (this.chatCheck > 0) {
    //   this.isChatFabEnabled = true;
    // } else if (this.chatCheck === 0) {
    //   this.isChatFabEnabled = false;
    // }
    
  }

  onFavContractClick(favItem) {
    let clickedContract: ContractData = this.favArr[favItem];
    // console.log(clickedContract);
    this.contractService.emitSelectedFolder(clickedContract);
    this.router.navigate([
      "dashboard/home/contract-detail",
      { id: clickedContract.details.Amsidnr },
    ]);
  }
  favArrHasNoContent() {
    return this.favArr.length < 1 ? true : false;
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
