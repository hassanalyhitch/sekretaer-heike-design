import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContractData } from '../../models/contract.model';
import { ContractsService } from '../../services/contracts.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  subsetArr:ContractData[] = [];
  allContractsArr:ContractData[] = [];

  showCard2:boolean = false;
  showCard1:boolean = false;

  collapsed:boolean = true;

  constructor(private router:Router, private contractService: ContractsService) { }

  ngOnInit() {
    this.contractService.getContracts().subscribe({
      next: ()=>{
        this.allContractsArr = this.contractService.userContractsArr;

        if(this.contractService.userContractsArr.length>3){
          for(let i=3; i<this.contractService.userContractsArr.length; i++){
            this.subsetArr.push(this.contractService.userContractsArr[i]);
          }
        }
        this.allContractsArr.length>1 ? this.showCard2 = true: this.showCard2 = false;
        this.allContractsArr.length>2 ? this.showCard1 = true: this.showCard1 = false;
      }
    });
    
  }

  onCardClick(){

  }

  collapse(){
    document.getElementById("cards").setAttribute("style","min-height:230px;height:230px;");
    document.getElementById("extra-cards").setAttribute("style","transition: opacity 0s;");
    setTimeout(()=>{this.collapsed = true;},200);
    
  }

  onDefaultInsuranceCardClick(){

    if(this.allContractsArr.length==1){
      //show detail page

    } else if(this.allContractsArr.length==2){
      //expand 2
      this.collapsed = false;
      document.getElementById("cards").setAttribute("style","min-height:380px;height:380px;");
      setTimeout(()=>{
        document.getElementById("extra-cards").setAttribute("style","transition: all 0.4s;opacity:1;");
      },400);
      
    } else {
      //expand all
      this.collapsed = false;
      document.getElementById("cards").setAttribute("style","min-height:570px;height:570px;");
      setTimeout(()=>{
        document.getElementById("extra-cards").setAttribute("style","transition: all 0.4s;opacity:1;");
      },400);
    }
  }

}