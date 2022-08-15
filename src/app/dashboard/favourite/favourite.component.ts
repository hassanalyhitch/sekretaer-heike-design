import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContractData } from '../../models/contract.model';
import { ContractsService } from '../../services/contracts.service';

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.css']
})
export class FavouriteComponent implements OnInit {

  favContractArr:ContractData[] = [];
  allContractsArr:ContractData[] = [];

  constructor(private router:Router, private contractService: ContractsService) { }

  ngOnInit() {
    this.contractService.getContracts().subscribe({
      next: ()=>{
        this.allContractsArr = this.contractService.userContractsArr;
        this.allContractsArr.forEach((contract)=>{
          
          if(contract.details.isFav === 1 || contract.details.isFav === '1' ){
            this.favContractArr.push(contract);
          }
          
        });
        console.log(this.favContractArr.length);
      }
    });
    
  }

  onFavContractClick(favItem){
    let clickedContract: ContractData = this.favContractArr[favItem];
    // console.log(clickedContract);
    this.contractService.emitSelectedFolder(clickedContract);
    this.router.navigate(['dashboard/favourite/contract-detail', { id: clickedContract.details.Amsidnr }]);
  }
  favArrHasNoContent(){
    return this.favContractArr.length < 1 ? true : false ;
  }
}