import { Component, OnInit } from '@angular/core';
import { BrokerData } from '../../models/broker.model';
import { BrokerService } from '../../services/broker.service';
@Component({
  selector: 'app-broker',
  templateUrl: './broker.component.html',
  styleUrls: ['./broker.component.css']
})
export class BrokerComponent implements OnInit {

  brokerName:string="";
  brokerNumber:string="";
  brokerStreet:string="";

  constructor(private brokerService:BrokerService) { }

  ngOnInit() {
    this.brokerService.getBrokerDetails().subscribe({
      next:(resp:BrokerData)=>{

        console.log(resp);

        this.brokerName=resp.myBroker.V_NAME;
        this.brokerNumber=resp.myBroker.V_TEL1;
        this.brokerStreet=resp.myBroker.V_STRASSE;
      },
      error:(e)=>{
        console.log(e);
      }
    });
  }

}
