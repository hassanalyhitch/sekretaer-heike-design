import { LoadingService } from '../../services/loading.service';
import { Component, OnInit } from '@angular/core';
import { BrokerData } from '../../models/broker.model';
import { BrokerService } from '../../services/broker.service';
@Component({
  selector: 'app-broker',
  templateUrl: './broker.component.html',
  styleUrls: ['./broker.component.css']
})
export class BrokerComponent implements OnInit {

  brokerName: string = "";
  brokerNumber: string = "";
  brokerStreet: string = "";
  brokerEmail: string = "";
  mailto: string = "mailto:";
  telto: string = "tel:";

  constructor(private brokerService:BrokerService, private loadingService:LoadingService) {
    this.loadingService.emitIsLoading(true);
   }

  ngOnInit() {
    this.brokerService.getBrokerDetails().subscribe({
      next:(resp:BrokerData)=>{
        console.log(resp);

        this.brokerName = resp.myBroker.V_NAME;
        this.brokerNumber = resp.myBroker.V_TEL1;
        this.brokerStreet = resp.myBroker.V_STRASSE;
        this.brokerEmail = resp.myBroker.V_EMAIL;
        this.mailto = this.mailto + this.brokerEmail;
        this.telto = this.telto + this.brokerNumber;

       
      },
      complete:()=>{
        this.loadingService.emitIsLoading(false);
      }
    });
  }

}
