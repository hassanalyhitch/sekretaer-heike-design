import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ContractData } from '../../../models/contract.model';
import { RenameContractComponent } from '../../rename-contract/rename-contract.component';
import { ContractsService } from '../../../services/contracts.service';
import { FoldersService } from '../../../services/folder.service';
import { AddPageModalComponent } from '../../add-page-modal/add-page-modal.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contract-category',
  templateUrl: './contract-category.component.html',
  styleUrls: ['./contract-category.component.scss']
})

export class ContractCategoryComponent implements OnInit, AfterViewInit {

  templateContractArrLength: number = 0;

  @Input('contractArr') allContractsArr:ContractData[] = [];
  localGroup: ContractData[] = [];
  subsetArr:ContractData[] = [];

  collapsed:boolean = true;

  showCard3:boolean = false;
  showCard2:boolean = false;
  showCard1:boolean = false;
  @Input('showTitle') showTitle:boolean = false;
  @Input('groupTitle') groupTitle:string = "";

  @ViewChild('defaultContractCard', {static: false, read: ElementRef}) defaultContractCard: ElementRef<HTMLElement>;
  @ViewChild('cards', {static: false, read: ElementRef}) cardsRef: ElementRef<HTMLElement>;
  @ViewChild('extraCards', {static: false, read: ElementRef}) extraCardsRef: ElementRef<HTMLElement>;
  collapseObservable: any;
  private collapseSubscription: Subscription;

  constructor(
    private contractService: ContractsService,
    private matDialog: MatDialog
  ) { 
  }

  ngOnInit(): void {
    this._init();
  }

  ngAfterViewInit(){
    this.collapseObservable = this.contractService.registerObs();
    this.collapseSubscription = this.collapseObservable.subscribe({
      next:(val)=>{
        this.collapse();
      }
    });

  }

  _init(){
      
      this.localGroup = this.allContractsArr;
      this.templateContractArrLength = this.localGroup.length;

      if(this.templateContractArrLength == 1){
        this.collapsed = false;
      }

      this.subsetArr.length = 0;

      if(this.localGroup.length>3){
        this.showCard1 = true;
        this.showCard2 = true;
        this.showCard3 = true;
        for(let i=3; i<this.localGroup.length; i++){
          this.subsetArr.push(this.localGroup[i]);
        }
      } else {
        this.localGroup.length>0 ? this.showCard3 = true: this.showCard3 = false;
        this.localGroup.length>1 ? this.showCard2 = true: this.showCard2 = false;
        this.localGroup.length>2 ? this.showCard1 = true: this.showCard1 = false;
        let emptyContract: ContractData = {
          id: 0,
          details: {
            Amsidnr: "",
            BranchSekretaer: "",
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
            favoriteId: "",
            iconLeft:   "",
            ownPicture: "",
            SharedWithBroker:""
          },
          isSelected: false,
          swipedLeft: false
        }
        this.localGroup.push(emptyContract);
        this.localGroup.push(emptyContract);
        this.localGroup.push(emptyContract);
      }

  }


  collapse(){
    
    //console.log("contractcategory this.collapsed called 1");
    if(this.templateContractArrLength > 1){
      //console.log("contractcategory this.collapsed called 2");
      
      if(!this.collapsed){
        //console.log("contractcategory this.collapsed called 3");

        this.cardsRef.nativeElement.setAttribute("style","min-height:230px;height:230px;");
        
        if(this.extraCardsRef!== undefined)
          this.extraCardsRef.nativeElement.setAttribute("style","transition: opacity 0s;");
        setTimeout(()=>{this.collapsed = true;},200);
      }

    }
    
  }

  onContractSwipe(evt,contract:ContractData){
    const swipeDirection = Math.abs(evt.deltaX) > 40 ? (evt.deltaX > 0 ? 'right' : 'left'):'';

    switch(swipeDirection){
      case 'left':{
        if(!this.collapsed){
          contract.swipedLeft = true;
        }
        break;
      }
      case 'right':{
        contract.swipedLeft = false;
        break;
      }
    }

  }

  renameContract(contract:ContractData) {
    const dialogConfig = new MatDialogConfig();
    // let passdata:string = '{"fileName": "'+this.file.name+'","fileUrl": "'+this.file.fileUrl+'"}';
    let passdata: string =
      '{"contractName": "' +
      contract.details.name +
      '","contractId": "' +
      contract.details.Amsidnr +
      '"}';

    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = false;
    dialogConfig.id = 'rename-contract-dialog';
    // dialogConfig.height = '80%';
    dialogConfig.width = '350px';
    dialogConfig.panelClass = 'bg-dialog-folder';
    dialogConfig.data = passdata;
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(
      RenameContractComponent,
      dialogConfig
    );

    this.matDialog.getDialogById('rename-contract-dialog').afterClosed().subscribe({
      next: () => {

        this.contractService
          .getContractDetails(contract.details.Amsidnr)
          .subscribe({
            next: (resp: any) => {
              
              contract.details.name = resp.name;

              //refresh contract list
              this._init();

            },
          });

      },
    });

  }

  addContractDoc(contract: ContractData) {

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
        
      }
    });
  }

  onDefaultInsuranceCardClick(){

    if(this.collapsed===false){

      this.defaultContractCard.nativeElement.click();
      
    } else {
  
      if(this.showCard3 && !this.showCard2 && !this.showCard1){
        //show detail page
        this.collapsed = false;
        this.defaultContractCard.nativeElement.click();
        
      } else if(this.showCard2 && !this.showCard1){
        //expand 2
        this.collapsed = false;
        this.cardsRef.nativeElement.setAttribute("style","min-height:380px;height:380px;");
        setTimeout(()=>{
          if(this.extraCardsRef!== undefined)
            this.extraCardsRef.nativeElement.setAttribute("style","transition: all 0.4s;opacity:1;");
        },10);
        
      } else {
        //expand all
        this.collapsed = false;
        this.cardsRef.nativeElement.setAttribute("style","min-height:570px;height:570px;");
        setTimeout(()=>{
          if(this.extraCardsRef!== undefined)
            this.extraCardsRef.nativeElement.setAttribute("style","transition: all 0.4s;opacity:1;");
        },10);
        
      }

    }

  }
  

}
