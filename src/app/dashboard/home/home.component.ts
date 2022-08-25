import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContractsService } from '../../services/contracts.service';
import { formatDate } from '@angular/common';
import { ContractData } from '../../models/contract.model';
import { NotificationsService } from '../../services/notification.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  favArr:ContractData[] = [];
  allContractsArr:ContractData[] = [];
  notifCount: number = 0;

  constructor(private router:Router, private contractService: ContractsService, private notificationService: NotificationsService ) { }

  ngOnInit() {
    this.contractService.getContracts().subscribe({
      complete: ()=>{
        this.allContractsArr = this.contractService.userContractsArr;
        this.allContractsArr.forEach((contract)=>{
          
          if(contract.details.isFav === 1 || contract.details.isFav === '1' ){
            this.favArr.push(contract);
          }
        });
      }
    });
    this.notifCount = this.notificationService.notifCount;
  }

  onFavContractClick(favItem){
    let clickedContract: ContractData = this.favArr[favItem];
    // console.log(clickedContract);
    this.contractService.emitSelectedFolder(clickedContract);
    this.router.navigate(['dashboard/home/contract-detail', { id: clickedContract.details.Amsidnr }]);
  }
  favArrHasNoContent(){
    return this.favArr.length < 1 ? true : false ;
  }
  onAddPage(){
    this.router.navigate(['dashboard/home/addpage']);
  }

  onNotifClick(){
    this.router.navigate(['dashboard/home/notifications']);
  }
}