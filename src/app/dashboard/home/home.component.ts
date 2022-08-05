import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContractsService } from '../../services/contracts.service';
import { formatDate } from '@angular/common';
import { ContractData } from '../../models/contract.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  favArr:ContractData[] = [];
  allContractsArr:ContractData[] = [];

  constructor(private router:Router, private contractService: ContractsService) { }

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
}