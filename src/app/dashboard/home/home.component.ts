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

  constructor(private router:Router, private contractService: ContractsService) { }

  ngOnInit() {
    
    this.contractService.getContracts().subscribe({
      next: (resp) => {
        //loop and assign data to folders array
        console.table(resp);
        if(Array.isArray(resp)){
          let index: number = 0;

          for(let item of resp){
            //format date 
            item['Begin'] = formatDate(item['Begin'], "dd.MM.YYYY","en");
            item['End'] = formatDate(item['End'], "dd.MM.YYYY","en");
            //
            let contract: ContractData = {
              id: index,
              details: {
                Amsidnr: item['Amsidnr'],
                CustomerAmsidnr:  item['CustomerAmsidnr'],
                InsuranceId:  item['Contractnumber'],
                ContractNumber:  item['Contractnumber'],
                Company:  item['Company'],
                StartDate:  item['Begin'],
                EndDate:  item['End'],
                YearlyPayment:  item['YearlyPayment'],
                Paymethod:  item['PaymentMethod'],
                Branch:  item['Branch'],
                Risk:  item['Risk'],
                docs: item['docs'],
                isFav: item['isFavorite']
              },
              isSelected: false
            };
            item['isFavorite'] == 1 ? this.favArr.push(contract): "";
            index++;
          }

       } else {
        //invalid token

       }

      },
      error: (e) => {
        console.log(e);
        
      },
      complete: () => {
        // console.info('complete')
      }
    });
  }

  onFavContractClick(favItem){
    const favId = favItem ? favItem : null;
    this.router.navigate(['dashboard/contract-detail', { id: favId }]);
  }
  favArrHasNoContent(){
    return this.favArr.length < 1 ? true : false ;
  }
}