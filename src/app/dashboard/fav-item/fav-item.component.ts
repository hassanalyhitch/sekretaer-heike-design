import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContractsService } from 'src/app/services/contracts.service';
import { ContractData } from '../../models/contract.model';

@Component({
  selector: 'app-fav-item',
  templateUrl: './fav-item.component.html',
  styleUrls: ['./fav-item.component.css']
})
export class FavItemComponent implements OnInit {

  @Input() contractItem: ContractData = <ContractData>{
    id: 0,
    details: {
      Amsidnr: "",
      CustomerAmsidnr: "",
      InsuranceId: "",
      ContractNumber: "",
      Company: "",
      StartDate: "",
      EndDate: "",
      YearlyPayment: "",
      Paymethod: "",
      Branch: "",
      Risk: "",
      docs: [],
      name: "",
      productSek: "",
      tarif: "",
      isFav: 1
    },
    isSelected: false
  };

  constructor(private contractService: ContractsService, private router:Router) {
  }

  ngOnInit() {
  }

  onCardClick(clickedContract){
    
    this.contractService.emitSelectedFolder(clickedContract);
    this.router.navigate(['dashboard/overview/contract-detail', { id: clickedContract.details.Amsidnr }]);
    
  }
}