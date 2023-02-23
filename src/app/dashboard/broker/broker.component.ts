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

  brokerName:    string = "";
  brokerNumber:  string = "";
  brokerStreet:  string = "";
  brokerEmail:   string = "";
  brokerCity:    string = "";
  brokerZipCode: string = "";
  mailto:        string = "mailto:";
  telto:         string = "tel:";

  constructor(private brokerService:BrokerService, private loadingService:LoadingService) 
  {
    this.loadingService.emitIsLoading(true);
   }

  ngOnInit() {
    this.brokerService.getBrokerDetails().subscribe({
      next:(resp:BrokerData)=>{
        
        this.brokerName = resp.myBroker.name;
        this.brokerNumber = resp.myBroker.tel1;
        this.brokerStreet = resp.myBroker.streed;
        this.brokerEmail = resp.myBroker.email;
        this.brokerCity = resp.myBroker.city;
        this.brokerZipCode = resp.myBroker.zipcode;
        this.mailto = this.mailto + this.brokerEmail;
        this.telto = this.telto + this.brokerNumber;

      },
      complete:()=>{
        this.loadingService.emitIsLoading(false);
      }
    });
  }

}
