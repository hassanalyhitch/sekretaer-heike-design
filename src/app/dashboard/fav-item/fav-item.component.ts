import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ContractsService } from '../../services/contracts.service';
import { ContractData } from '../../models/contract.model';
import { RenameContractComponent } from '../rename-contract/rename-contract.component';
import { AddPageModalComponent } from '../add-page-modal/add-page-modal.component';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-fav-item',
  templateUrl: './fav-item.component.html',
  styleUrls: ['./fav-item.component.css']
})
export class FavItemComponent implements OnInit {

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
      isFav: 1,
      iconLeft: "",
      ownPicture : ""
    },
    isSelected: false
  };

  @Input() collapsed: boolean = false;
  
  @Output() favoriteEvent = new EventEmitter<number>();

  src_link_for_icon_left: string;
  src_link_for_small_picture: string;

  constructor(
    private matDialog: MatDialog,
    private router: Router,
    private translate: TranslateService,
    private contractService: ContractsService,
    private snackbar:MatSnackBar,
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
  ){

    this.isMobileView = false;
    this.isDesktopView = false;
    this.src_link_for_icon_left = "../assets/icon_allgemein.svg"; //default logo for icon left
  }

  ngOnInit() {

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

    if(this.contractItem.details.ownPicture.includes('data:image')){

      this.src_link_for_small_picture = this.contractItem.details.ownPicture;

    } else {
      this.src_link_for_small_picture = "../assets/default_small_picture.svg";
    }

    if(this.contractItem.details.iconLeft == "Icon_Allgemein.svg"){
    
      this.src_link_for_icon_left = "../assets/icon_allgemein.svg";

    } else if(this.contractItem.details.iconLeft == "Icon_Gewerbe.svg"){
      
      this.src_link_for_icon_left = "../assets/icon_gewerbe.svg";

    } else if(this.contractItem.details.iconLeft == "Icon_Haftpflicht.svg"){
      
      this.src_link_for_icon_left = "../assets/icon_haftpflicht.svg";
      
    } else if(this.contractItem.details.iconLeft == "Icon_Kfz.svg"){
      
      this.src_link_for_icon_left = "../assets/icon_kfz.svg";
      
    } else if(this.contractItem.details.iconLeft == "Icon_Krank.svg"){
      
      this.src_link_for_icon_left = "../assets/icon_kranken.svg";
      
    } else if(this.contractItem.details.iconLeft == "Icon_LV.svg"){
      
      this.src_link_for_icon_left = "../assets/icon_lv.svg";
      
    } else if(this.contractItem.details.iconLeft == "Icon_Rechtsschutz.svg"){
      
      this.src_link_for_icon_left = "../assets/icon_rechtsschutz.svg";
      
    } else if(this.contractItem.details.iconLeft == "Icon_Tier.svg"){
      
      this.src_link_for_icon_left = "../assets/icon_tier.svg";
      
    } else if(this.contractItem.details.iconLeft == "Icon_Unfall.svg"){
      
      this.src_link_for_icon_left = "../assets/icon_unfall.svg";
      
    } else {
      // none of the above
      this.src_link_for_icon_left = "../assets/icon_allgemein.svg";

    }

  }

  openRenameContractModal(file) {
    const dialogConfig = new MatDialogConfig();
    let passdata: string =
      '{"contractName": "' +
      file.details.name +
      '","contractId": "' +
      file.details.Amsidnr +
      '"}';
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = false;
    dialogConfig.id = 'rename-contract-dialog';
    dialogConfig.width = '350px';
    dialogConfig.panelClass = 'bg-dialog-folder';
    dialogConfig.data = passdata;

    const modalDialog = this.matDialog.open(
      RenameContractComponent,
      dialogConfig
    );

    this.matDialog.getDialogById('rename-contract-dialog').afterClosed().subscribe({
      next: () => {
      },
    });

  }

  markFav(contract: ContractData) {
    this.contractService
      .makeContractFavourite(contract.details.Amsidnr)
      .subscribe({
        next: (resp: any) => {
          this.contractItem.details.favoriteId = resp.id;
        },
        error: (resp) => {
          this.snackbar.open(this.translate.instant('fav_item.mark_fav_error'),this.translate.instant('snack_bar.action_button'),{
            duration:1500,
            panelClass:['snack_error'],
          });
        },
        complete:()=>{
          this.contractItem.details.isFav = 1;

          this.snackbar.open(this.translate.instant('fav_item.mark_fav_success'),this.translate.instant('snack_bar.action_button'),{
            duration:1500,
            panelClass:['snack_success'],
          });
          
        }
      });
  }

  unmarkFav(contract: ContractData) {
    this.contractService
      .deleteContractFavourite(contract.details.favoriteId)
      .subscribe({
        next: (resp: any) => {
          this.favoriteEvent.emit(this.contractItem.id);
          this.contractItem.details.isFav = 0;
        },
        error: (resp) => {
          this.snackbar.open(this.translate.instant('fav_item.unmark_fav_error'),this.translate.instant('snack_bar.action_button'),{
            panelClass:['snack_error'],
            duration:1500,
          })
        },
        complete:()=>{
          this.snackbar.open(this.translate.instant('fav_item.unmark_fav_success'),this.translate.instant('snack_bar.action_button'),{
            panelClass:['snack_success'],
            duration:1500,
          });

          
        }
      });
  }

  onContractClick(clickedContract) {

    if(!this.collapsed){
      this.contractService.emitSelectedContract(clickedContract);

      if(this.router.url.includes('home')){

          if(this.isMobileView){
            this.router.navigate([
              "dashboard/home/contract-detail",
              { id: clickedContract.details.Amsidnr },
            ]);

          } else {
            this.router.navigate([
              '/dashboard/home/', 
              { outlets: { 'desktop': ['contract-detail', {id: clickedContract.details.Amsidnr}] } }
            ]);
          }

      } else if(this.router.url.includes('overview')) {

        if(this.isMobileView){
          this.router.navigate([
            "dashboard/overview/contract-detail",
            { id: clickedContract.details.Amsidnr },
          ]);
        } else {
          this.router.navigate([
            '/dashboard/overview/', 
            { outlets: { 'desktop': ['contract-detail', {id: clickedContract.details.Amsidnr}] } }
          ]);
        }

      } else if(this.router.url.includes('favourite')) {
        if(this.isMobileView){
          this.router.navigate([
            "dashboard/favourite/contract-detail",
            { id: clickedContract.details.Amsidnr },
          ]);
        }
      }

    }

    return false;
  }

  addNewDocument(contract: ContractData) {

    const dialogConfig = new MatDialogConfig();

    let passdata:string = '{"contractName": "'+contract.details.name+'","contractId": "'+contract.details.Amsidnr+'","document_type":"contract" }';

    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = false;
    dialogConfig.id = 'add-document-modal-component';
    dialogConfig.width = '400px';
    dialogConfig.data = passdata;
    dialogConfig.panelClass = 'bg-dialog-folder';
    
    const modalDialog = this.matDialog.open(AddPageModalComponent, dialogConfig);
    
    this.matDialog.getDialogById('add-document-modal-component').afterClosed().subscribe({
      next:()=>{
      },
      error:(resp)=>{
        //console.log(resp);
      }
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

}