import { LoadingService } from '../../services/loading.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BrokerData } from '../../models/broker.model';
import { BrokerService } from '../../services/broker.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-broker',
  templateUrl: './broker.component.html',
  styleUrls: ['./broker.component.css']
})
export class BrokerComponent implements OnInit, OnDestroy{

  brokerName:    string = "";
  brokerNumber:  string = "";
  brokerStreet:  string = "";
  brokerEmail:   string = "";
  brokerCity:    string = "";
  brokerZipCode: string = "";
  mailto:        string = "mailto:";
  telto:         string = "tel:";

  //screen layout changes
  destroyed = new Subject<void>();
  currentScreenSize: string;

  isMobileView: boolean;
  isDesktopView: boolean;

  // Create a map to display breakpoint names for layout changes.
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);

  constructor(
    private brokerService: BrokerService, 
    private loadingService: LoadingService,
    private breakpointObserver: BreakpointObserver) 
  {
    this.loadingService.emitIsLoading(true);

    this.isMobileView = false;
    this.isDesktopView = false;
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

    //-------------------screen changes-----------------
    this.breakpointObserver
    .observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ])
    .pipe(takeUntil(this.destroyed))
    .subscribe(result => {
      for (const query of Object.keys(result.breakpoints)) {
        if (result.breakpoints[query]) {

        this.currentScreenSize = this.displayNameMap.get(query) ?? 'Unknown';

        if(this.displayNameMap.get(query) == 'XSmall'){

          this.isMobileView = true;
          this.isDesktopView = false;
    
        } else if(this.displayNameMap.get(query) == 'Small'){
    
          this.isMobileView = true;
          this.isDesktopView = false;
    
        } else if(this.displayNameMap.get(query) == 'Medium'){
    
          this.isMobileView = false;
          this.isDesktopView = true;
    
        } else if(this.displayNameMap.get(query) == 'Large'){
    
          this.isMobileView = false;
          this.isDesktopView = true;
          
        } else if(this.displayNameMap.get(query) == 'XLarge'){
    
          this.isMobileView = false;
          this.isDesktopView = true;
          
        }
    
        }
      }
    });
    
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

}
