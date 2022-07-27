import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  favArr:number[] = [1,2,3];

  constructor(private router:Router) { }

  ngOnInit() {
  }

  onFavContractClick(favItem){
    const favId = favItem ? favItem : null;
    this.router.navigate(['dashboard/contract-detail', { id: favId }]);
  }
}