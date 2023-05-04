import {AfterViewInit,Component, ElementRef, OnInit,QueryList,ViewChild,ViewChildren} from "@angular/core";
import { Router } from "@angular/router";
import { ContractsService } from "../../services/contracts.service";
import { ContractData } from "../../models/contract.model";
import { NotificationsService } from "../../services/notification.service";
import { LoadingService } from '../../services/loading.service';
import { BrokerService } from '../../services/broker.service';
import { BrokerData } from '../../models/broker.model';
import { FoldersService } from '../../services/folder.service';
import { FolderData } from '../..//models/folder.model';

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit,AfterViewInit{
  
  notifCount: number = 0;

  zeroNotifCount:boolean = false;
  isNotificationCountText: boolean = false;
  
  telto: string = "tel:";
  brokerNumber: string = "";
 
  favArr: ContractData[];
  allContractsArr: ContractData[] = [];

  favFoldersArr: FolderData[] = [];
  allFoldersArr: FolderData[] = [];
 

  
  @ViewChild("notif", { static: false }) notif: ElementRef<HTMLElement>;
  @ViewChildren("contracts") contracts:QueryList<ElementRef>;
  @ViewChildren("folders") folders:QueryList<ElementRef>;
  lineObjectArr:{isActive: boolean, startsFrom: number, endsAt: number}[] = [];

  constructor(
    private router: Router,
    private contractService: ContractsService,
    private notificationService: NotificationsService,
    private loadingService:LoadingService,
    private brokerService:BrokerService,
    private folderService: FoldersService
  ) {
    this.loadingService.emitIsLoading(true);
  }


  ngOnInit() {
    this.favArr = [];
    this.contractService.getContracts().subscribe({
      next: () => {
        this.allContractsArr = this.contractService.userContractsArr;
        this.favArr.length = 0;
        this.allContractsArr.forEach((contract) => {
          if (contract.details.isFav === 1 || contract.details.isFav === "1") {
            this.favArr.push(contract);
           }
        });


        //all favorite folders
        this.folderService.getFolders().subscribe({
          next: (resp)=>{

            this.allFoldersArr = this.folderService.userFolderArr;
            this.allFoldersArr.forEach((folder)=>{
              if(folder.isFavorite === 1 ){
                this.favFoldersArr.push(folder);
              }
            
            });
                    
          },
          complete:()=>{
            
          }
        });

        this.brokerService.getBrokerDetails().subscribe({
          next:(resp:BrokerData)=>{
    
            this.brokerNumber = resp.myBroker.tel1;
            this.telto = this.telto + this.brokerNumber;
    

            this.notificationService.getUnreadNotifications().subscribe({
              next: () => {
                this.notifCount = this.notificationService.notifCount;
                if(this.notifCount >= 0 && this.notifCount <= 99){
        
                  this.isNotificationCountText = false;
        
                } else if(this.notifCount > 99){
        
                  this.isNotificationCountText = true;
        
                } else{
                  this.zeroNotifCount = true;
                }
                
              },
              complete:()=>{
                this.loadingService.emitIsLoading(false);
              }
            });

          },
          complete:()=>{
          }
        });

      },
    });

  }

  refresh(id:number){
    for(let i of this.favArr){
      if(i.id == id ){
        this.favArr = this.favArr.filter(item => item !== i);
      }
    }
  }

  ngAfterViewInit(){
    let isScrolling, start,end, distance,totalScrollWidth;
    let cardWidth = 1; //initializing just to avoid division errors
    let favArrCount = 0;
    let cardstart = 0;
    let cardend = 0;
    let globalThis = this;

    this.contracts.changes.subscribe({
      next:()=>{
        globalThis.lineObjectArr = [];
        cardstart = 0;
        cardend = 0;
        this.contracts.toArray().forEach((element:ElementRef, index)=>{
          let target = element.nativeElement as HTMLElement;
          cardWidth = target.clientWidth;


          favArrCount = this.favArr.length + this.favFoldersArr.length;

          cardend = cardend + cardWidth;
          globalThis.lineObjectArr.push({isActive: false, startsFrom: cardstart, endsAt: cardend});
          cardstart = cardend+1;

          //reset scroll
          globalThis.lineObjectArr[0].isActive = true;
          document.getElementById("fav-wrapper").scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });

        });

      }
    });

    document.getElementById("fav-wrapper").addEventListener('scroll', function (event) {
        // Set starting position
      if (!start) {
        start = document.getElementById("fav-wrapper").scrollWidth;
      }

      // Clear our timeout throughout the scroll
      window.clearTimeout(isScrolling);

      // Set a timeout to run after scrolling ends to avoid infinity loops
      isScrolling = setTimeout(function() {

        // Calculate distance
        const box = document.getElementById("fav-wrapper");
        

        distance = box.scrollLeft;
        totalScrollWidth = box.scrollWidth;
        // Run the callback to set active line
        scroll_callback(distance, totalScrollWidth);

        // Reset calculations
        start = null;
        end = null;
        distance = null;

      }, 66);

  }, false);

  function scroll_callback(distance, totalScrollWidth){
    
    distance = distance + 16; //plus 16 for margins
    for(let line of globalThis.lineObjectArr){
      line.isActive = false;
    }
    for(let i=0; i<globalThis.lineObjectArr.length; i++){
      if(distance+16>=globalThis.lineObjectArr[i].startsFrom && distance+16<=globalThis.lineObjectArr[i].endsAt){
        globalThis.lineObjectArr[i].isActive = true;
      }
    }
    
  }
  
  }

  onFavContractClick(favItem) {
    let clickedContract: ContractData = this.favArr[favItem];
    this.contractService.emitSelectedFolder(clickedContract);
    this.router.navigate([
      "dashboard/home/contract-detail",
      { id: clickedContract.details.Amsidnr },
    ]);
  }

  favArrHasNoContent() {
    return this.favArr.length < 1 && this.favFoldersArr.length < 1;
  }

  onAddPage() {
    this.router.navigate(["dashboard/home/adddocument"]);
  }

  onNotifClick() {
    this.router.navigate(["dashboard/home/notifications"]);
  }
  onChatClick() {
    this.router.navigate(["dashboard/home/chat"]);
  }

  onOpenBrokerPage() {
    this.router.navigate(["dashboard/broker"]);
  }

  openFavouritesPage(){
    this.router.navigate(["dashboard/favourite"]);
  }

  scrollToContract(id){
    this.contracts.forEach((element:ElementRef, index)=>{
      let target = element.nativeElement as HTMLElement;
      if(index == id){

        // target.scrollIntoView({behavior: "smooth"});
        document.getElementById("fav-wrapper").scrollTo({
          left:this.lineObjectArr[id].startsFrom,
          behavior:'smooth'
        });
        return;
      }
    });
  }

  onFolderCardClick(clickedFolder){
    this.folderService.emitSelectedFolder(clickedFolder);
    this.router.navigate(['dashboard/overview/folder-detail', { id: clickedFolder.id }]);
  }


}

