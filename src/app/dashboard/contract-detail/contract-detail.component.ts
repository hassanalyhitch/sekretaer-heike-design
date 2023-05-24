import {
  Component,
  OnDestroy,
  OnInit,
  AfterViewInit,
  ViewChildren,
  QueryList,
  ElementRef,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ContractData } from '../../models/contract.model';
import { DocumentData } from '../../models/document.model';
import { ContractsService } from '../../services/contracts.service';
import { RenameContractComponent } from '../rename-contract/rename-contract.component';
import { Location } from '@angular/common';
import { RenameModalComponent } from '../rename-modal/rename-modal.component';
import { DownloadService } from '../../services/download-file.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddPageModalComponent } from '../add-page-modal/add-page-modal.component';
import { LoadingService } from '../../services/loading.service';
import { EditSmallPictureComponent } from '../edit-small-picture/edit-small-picture.component';

@Component({
  selector: 'app-contract-detail',
  templateUrl: './contract-detail.component.html',
  styleUrls: ['./contract-detail.component.scss'],
})
export class ContractDetailComponent implements OnInit, OnDestroy {

  contract_id: string;
  src_link_for_small_picture: string;

  swipedLeft: boolean = false;
  sortDateByAsc:boolean = true;

  ascDate:DocumentData[] = [];
  descDate:DocumentData[] = [];
  docArr: DocumentData[] = [];

  contractSub: Subscription;
  documents: any;
 
  contract: ContractData = <ContractData>{
    id: 0,
    details: {
      Amsidnr: '',
      CustomerAmsidnr: '',
      InsuranceId: '',
      ContractNumber: '',
      Company: '',
      StartDate: '',
      EndDate: '',
      YearlyPayment: '',
      Paymethod: '',
      Branch: '',
      Risk: '',
      docs: [],
      tarif: '',
      productSek: '',
      isFav: 0,
      ownPicture: ''
    },
    isSelected: false,
  };

  previousContractId: string;
  nextContractId: string;

  previousContract: ContractData;
  nextContract: ContractData;

  isFirstItem: boolean = false;
  isLastItem: boolean = false;

  allContracts: ContractData[];

  contractDetailSub: Subscription;

  @ViewChildren('documentItem') documentItemList: QueryList<ElementRef>;

  constructor(
    private route: ActivatedRoute,
    private matDialog: MatDialog,
    private router: Router,
    private translate: TranslateService,
    private contractService: ContractsService,
    private _location: Location,
    private downloadService: DownloadService,
    private snackbar:MatSnackBar,
    private loadingService:LoadingService
  ) {
    this.loadingService.emitIsLoading(true);

    this.previousContractId = '';
    this.nextContractId = '';
    this.allContracts = [];

    this.isFirstItem = false;
    this.isLastItem = false;
  }

  ngOnInit() {

    this.contractDetailSub = this.router.events.subscribe((event: Event) => {

      if (event instanceof NavigationEnd) {
        this.loadingService.emitIsLoading(true);
        this._init();
      }
    });

    this._init();

  }

  _init(){
    this.contract_id = this.route.snapshot.paramMap.get('id');
    
    this.allContracts = this.contractService.userContractsArr;

    for(let i = 0; i < this.allContracts.length; i++){
      
      //check if contract is first item
      if(i == 0 && this.contract_id == this.allContracts[i].details.Amsidnr){
        this.isFirstItem = true;
      }
      
      //check if contract is the last item
      if((this.allContracts.length - 1) == i && this.contract_id == this.allContracts[i].details.Amsidnr){
        this.isLastItem = true;
      }

    }

    //check if next contract exists
    if(!this.isLastItem){
      
      for(let contractItem of this.allContracts ){
        
        if(contractItem.details.Amsidnr == this.contract_id && this.allContracts.length > 1){
          this.nextContractId = this.allContracts[this.allContracts.indexOf(contractItem)+1].details.Amsidnr;
          //console.log('indeOf next contract ',this.allContracts.indexOf(contractItem)+1);
        }
      }
      //console.log('current contract id ', this.contract_id);
      //console.log('NEXT CONTRACT: contract id ', this.nextContractId);
      //console.log('');
    }

    //check if previous contract exists
    if(!this.isFirstItem){
      for(let contractItem of this.allContracts ){
        if(contractItem.details.Amsidnr == this.contract_id && this.allContracts.length > 1){
          this.previousContractId = this.allContracts[this.allContracts.indexOf(contractItem)-1].details.Amsidnr;
          //console.log('indeOf prev contract ',this.allContracts.indexOf(contractItem)-1);
        }
      }
      //console.log('current contract id ', this.contract_id);
      //console.log('PREV CONTRACT: contract id ', this.previousContractId);
      //console.log('');
    }
    

    this.contractService
      .getContractDetails(this.contract_id)
      .subscribe({
        next: (resp:any) => {

          this.contract = this.contractService.selectedContract;

          if(this.contract.details.ownPicture.includes('data:image')){

            this.src_link_for_small_picture = this.contract.details.ownPicture;

          } else {
            this.src_link_for_small_picture = "../assets/default_small_picture.svg";
          }

          //reset documents array to empty
          if(this.docArr.length > 0){
            this.docArr = [];
          }

          if (resp.hasOwnProperty('docs')) {
            for (let i = 0; i < resp.docs.length; i++) {
              this.docArr.push(resp.docs[i]);
            }
            this.sortDocumentsInAscendingOrderOnly();
          }

        },
        complete: () => {
          this.loadingService.emitIsLoading(false);
        },
      });
  }

  onContractSwipe(evt) {
    const swipeDirection = Math.abs(evt.deltaX) > 40 ? (evt.deltaX > 0 ? 'right' : 'left'):'';

    switch(swipeDirection){
      case 'left':{
        //console.log('contract swiped left ',this.nextContractId);
        //console.log('is last item ',this.isLastItem);
        //console.log(' ');
        //next contract
        if(!this.isLastItem && this.nextContractId != ''){
          this.router.navigate(['dashboard/overview/contract-detail', 
            { 
              id: this.nextContractId
            }
          ]);
        }
        break;
      }
      case 'right':{
        //console.log('contract swiped right ',this.previousContractId);
        //console.log('is first item ',this.isFirstItem);
        //console.log('');
        //previous contract
        if(!this.isFirstItem && this.previousContractId != ''){
          this.router.navigate(['dashboard/overview/contract-detail', 
            { 
              id: this.previousContractId
            }
          ]);
        } 
        break;
      }
    }
  }

  ngOnDestroy() {
   this.contractDetailSub.unsubscribe();
  }

  openModal(file) {
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
        this.contractService
          .getContractDetails(this.contract_id)
          .subscribe({
            next: (resp: any) => {
              this.contract.details.name = resp.name;
            },
          });
      },
    });

  }

  markFav(contract: ContractData) {
    this.contractService
      .makeContractFavourite(contract.details.Amsidnr)
      .subscribe({
        next: (resp: any) => {
          this.contract.details.favoriteId = resp.id;
          this.contract.details.isFav = '1';
        },
        error: (resp) => {
          this.snackbar.open(this.translate.instant('contract_detail.mark_fav_error'),this.translate.instant('snack_bar.action_button'),{
            duration:1500,
            panelClass:['snack_error'],
          });
        },
        complete:()=>{
          this.snackbar.open(this.translate.instant('contract_detail.mark_fav_success'),this.translate.instant('snack_bar.action_button'),{
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
          this.contract.details.isFav = '0';
        },
        error: (resp) => {
          this.snackbar.open(this.translate.instant('contract_detail.unmark_fav_error'),this.translate.instant('snack_bar.action_button'),{
            panelClass:['snack_error'],
            duration:1500,
          })
        },
        complete:()=>{
          this.snackbar.open(this.translate.instant('contract_detail.unmark_fav_success'),this.translate.instant('snack_bar.action_button'),{
            panelClass:['snack_success'],
            duration:1500,
          })
        }
      });
  }

  toggleFav(contract: ContractData) {
    this.contract.details.isFav == '1'
      ? this.unmarkFav(contract)
      : this.markFav(contract);
  }

  onAddPage() {
    this.router.navigate(['dashboard/home/adddocument']);
  }

  onBackNavClick() {
    this._location.back();
  }

  ngAfterViewInit() {
    this.documentItemList.changes.subscribe({
      next: (t) => {
        if (this.docArr.length > 0) {
          //console.log('after view init ' + this.documentItemList.length);
          this.sortDocumentsInAscendingOrderOnly();
        }
      },
    });
  }

  renameFileModal(file) {
    const dialogConfig = new MatDialogConfig();
    let passdata:string = '{"docName": "'+file.name+'","docid": "'+file.docid+'","systemId": "'+file.systemId+'","fromLocation":"contract" }';

    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = false;
    dialogConfig.id = 'rename-document-dialog';
    dialogConfig.width = '350px';
    dialogConfig.panelClass = 'bg-dialog-folder';
    dialogConfig.data = passdata;

    const renameFileDialog = this.matDialog.open(RenameModalComponent, dialogConfig);

    this.matDialog.getDialogById('rename-document-dialog').afterClosed().subscribe({
      next:()=>{
        
        this.contractService
        .getContractDetails(this.contract_id)
        .subscribe({
          next:(resp: any) =>{

            this.docArr.length = 0;

            this.contract = this.contractService.selectedContract;
            
            if (resp.hasOwnProperty('docs')) {
              for (let i = 0; i < resp.docs.length; i++) {
                this.docArr.push(resp.docs[i]);
              }
              this.sortDocumentsInAscendingOrderOnly();
            }

          },
          complete:()=>{},
        });

      }
    });

  }

  onSwipe(evt, doc: DocumentData) {
    const swipeDirection = Math.abs(evt.deltaX) > 40 ? (evt.deltaX > 0 ? 'right' : 'left'):'';
    
    switch(swipeDirection){
      case 'left':{
        doc.swipedLeft = true;
        break;
      }
      case 'right':{
        doc.swipedLeft = false;
        break;
      }
    }
  }

  sortByDate(){
    if(this.sortDateByAsc){
      this.docArr.sort((a,b)=>{
        try{
          let dateA = new Date(a.createdAt);
          let dateB = new Date(b.createdAt);

          if ((dateA instanceof Date && !isNaN(dateA.getTime()))&&(dateB instanceof Date && !isNaN(dateB.getTime()))) {
            //valid date object
            return dateA >= dateB ? 1 : -1; 
          } else if((dateA instanceof Date && !isNaN(dateA.getTime()))&& !(dateB instanceof Date && !isNaN(dateB.getTime()))){
            // invalid date object
            return -1;
          } else if(!(dateA instanceof Date && !isNaN(dateA.getTime()))&& (dateB instanceof Date && !isNaN(dateB.getTime()))){
            // invalid date object
            return 1;
          } else {
            return 0;
          }
        }  catch(e){
          
        }
      });
      this.sortDateByAsc = !this.sortDateByAsc;
    }else {
      this.docArr.reverse();
      this.sortDateByAsc = !this.sortDateByAsc;

    }
  }

  showTariffInfo(){
    if(this.contract.details.tarif != "" && !this.contract.details.tarif.includes('TODO')){
      return true;
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

        this.contractService
        .getContractDetails(this.contract_id)
        .subscribe({
          next: (resp:any) => {

            this.contract = this.contractService.selectedContract;

            if(this.contract.details.ownPicture.includes('data:image')){

              this.src_link_for_small_picture = this.contract.details.ownPicture;

            } else {
              this.src_link_for_small_picture = "../assets/default_small_picture.svg";
            }

            if (resp.hasOwnProperty('docs')) {
              for (let i = 0; i < resp.docs.length; i++) {
                this.docArr.push(resp.docs[i]);
              }
            }

          },
          complete: () => {
            this.loadingService.emitIsLoading(false);
          },
        });

      },
      error:(resp)=>{

      }
    });
  }

  editSmallPicture(contract_id: string, small_picture_link: string){

    const dialogConfig = new MatDialogConfig();

    let passdata:string = '{"contractId": "'+contract_id+'","smallPictureLink": "'+small_picture_link+'"}';

    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = false;
    dialogConfig.id = 'edit-small-picture-modal-component';
    dialogConfig.width = '400px';
    dialogConfig.data = passdata;

    dialogConfig.panelClass = 'bg-dialog-folder';
    const modalDialog = this.matDialog.open(EditSmallPictureComponent, dialogConfig);
    
    this.matDialog.getDialogById('edit-small-picture-modal-component').afterClosed().subscribe({
      next:()=>{

      },
      error:(resp)=>{
      
      }
    });

  }

  sortDocumentsInAscendingOrderOnly(){
    this.docArr.sort((a,b)=>{
      try{
        let dateA = new Date(a.createdAt);
        let dateB = new Date(b.createdAt);

        if ((dateA instanceof Date && !isNaN(dateA.getTime()))&&(dateB instanceof Date && !isNaN(dateB.getTime()))) {
          //valid date object
          return dateA >= dateB ? 1 : -1; 
        } else if((dateA instanceof Date && !isNaN(dateA.getTime()))&& !(dateB instanceof Date && !isNaN(dateB.getTime()))){
          // invalid date object
          return -1;
        } else if(!(dateA instanceof Date && !isNaN(dateA.getTime()))&& (dateB instanceof Date && !isNaN(dateB.getTime()))){
          // invalid date object
          return 1;
        } else {
          return 0;
        }
      }  catch(e){
        
      }
    });

    this.docArr.reverse();
  }

}
