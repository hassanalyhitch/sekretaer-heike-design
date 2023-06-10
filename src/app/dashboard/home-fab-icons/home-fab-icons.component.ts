import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-home-fab-icons',
  templateUrl: './home-fab-icons.component.html',
  styleUrls: ['./home-fab-icons.component.css']
})
export class HomeFabIconsComponent implements OnInit {

  @Input() fab_location: string;
  @Input() broker_email: string;

  isChatFabEnabled:              boolean;
  isSendEmailToBrokerFabEnabled: boolean;

  insuranceCheck: number;
  chatCheck:      number;

  constructor(private loginService: LoginService, private router: Router,) { 
    this.isChatFabEnabled              = false;
    this.isSendEmailToBrokerFabEnabled = false;
  
    this.insuranceCheck = 0;
    this.chatCheck      = 0;

    this.broker_email = "";
    this.fab_location = "";

  }

  ngOnInit(): void {

    this.chatCheck = this.loginService.chatCheck;
    this.insuranceCheck = this.loginService.insuranceCheck;

    if (this.chatCheck > 0) {
      this.isChatFabEnabled = true;
    } else if (this.chatCheck === 0) {
      this.isChatFabEnabled = false;
    }

    if(this.fab_location == "home_page"){
      this.isSendEmailToBrokerFabEnabled = false;
    } else if(this.fab_location == "broker_page"){
      this.isSendEmailToBrokerFabEnabled = true;
    }

  }

  onChatClick() {
    this.router.navigate(["dashboard/home/chat"]);
  }

  onOpenBrokerPage() {
    this.router.navigate(["dashboard/broker"]);
  }

  onSearchClick(){
    this.router.navigate(['dashboard/search', {searchType:'all'}]);
  }
}
