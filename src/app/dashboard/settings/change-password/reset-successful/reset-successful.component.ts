import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-successful',
  templateUrl: './reset-successful.component.html',
  styleUrls: ['./reset-successful.component.scss']
})
export class ResetSuccessfulComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {

  }

  backToHome(){
    this.router.navigate(['dashboard/home']);
  }
  
  backToSettings(){
    this.router.navigate(['dashboard/settings']);
  }

}
