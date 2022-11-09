import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-home-fab-icons',
  templateUrl: './home-fab-icons.component.html',
  styleUrls: ['./home-fab-icons.component.css']
})
export class HomeFabIconsComponent implements OnInit {

  isChatFabEnabled: boolean = false;
  insuranceCheck: number = 0;
  chatCheck: number = 0;

  constructor(private loginService: LoginService, private router: Router,) { }

  ngOnInit(): void {

    this.chatCheck = this.loginService.chatCheck;
    this.insuranceCheck = this.loginService.insuranceCheck;

    if (this.chatCheck > 0) {
      this.isChatFabEnabled = true;
    } else if (this.chatCheck === 0) {
      this.isChatFabEnabled = false;
    }

  }

  onChatClick() {
    this.router.navigate(["dashboard/home/chat"]);
  }

  onOpenBrokerPage() {
    this.router.navigate(["dashboard/broker"]);
  }

  onSearchClick(){
    this.router.navigate(["dashboard/search"]);
  }
}
