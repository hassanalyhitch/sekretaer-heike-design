import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ContractData } from '../../models/contract.model';
import { DocumentData } from '../../models/document.model';
import { ContractsService } from '../../services/contracts.service';
import { RenameContractComponent } from '../rename-contract/rename-contract.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-contract-detail',
  templateUrl: './contract-detail.component.html',
  styleUrls: ['./contract-detail.component.css']
})
export class ContractDetailComponent implements OnInit, OnDestroy {

  @Input() index:string;
  
  contract: ContractData = <ContractData>{
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
      tarif: "",
      productSek: "",
      isFav: 0
    },
    isSelected: false
  };
  contractSub: Subscription;
  documents:any ;

  docArr: DocumentData[] = [];

  constructor(
    private route: ActivatedRoute,
    private matDialog: MatDialog,
    private router: Router, 
    private translate:TranslateService,
    private contractService: ContractsService,
    private _location: Location) {

  
    this.contractSub = contractService.selectObservable.subscribe({
      next:(contract)=>{
        // console.log(contract);
        this.contract = contract;
        contractService.getContractDetails(this.contract.details.Amsidnr).subscribe({
          next:(resp:any)=>{
              if(resp.hasOwnProperty('docs')){
                for(let i=0; i<resp.docs.length; i++){
                  this.docArr.push(resp.docs[i]);
                }
                // console.table(this.docArr);
              }
              if(this.docArr.length>0){
                this.documents = document.getElementsByClassName('_document');
                console.log(this.documents.length);
                this.swipeLeft();
              }
          },
          complete:()=>{
            
          }
        });
      }
    });
  }

  ngOnInit() {
    this.index = this.route.snapshot.paramMap.get('id');

    this.matDialog.afterAllClosed.subscribe({
      next:()=>{
        console.log('closed dialogs in next');
        this.contractService.getContractDetails(this.contract.details.Amsidnr).subscribe({
          next:(resp:any)=>{
              if(resp.hasOwnProperty('docs')){
                this.docArr = [];
                for(let i=0; i<resp.docs.length; i++){
                  this.docArr.push(resp.docs[i]);
                }
                // console.log(resp);
                this.contract.details.name = resp.name;
              }
          }
        });
      }
    });

  }

  ngOnDestroy(){
    this.contractSub.unsubscribe();

  }
  
  openModal(file) {
    const dialogConfig = new MatDialogConfig();
    // let passdata:string = '{"fileName": "'+this.file.name+'","fileUrl": "'+this.file.fileUrl+'"}';
    let passdata:string = '{"contractName": "'+file.details.name+'","contractId": "'+file.details.Amsidnr+'"}';
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = false;
    dialogConfig.id = 'renamecontract-modal-component';
    // dialogConfig.height = '80%';
    // dialogConfig.width = '90%';
    dialogConfig.data = passdata;
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(RenameContractComponent, dialogConfig);
  }

  markFav(contract: ContractData){
    this.contractService.makeContractFavourite(contract.details.Amsidnr).subscribe({
      next:(resp:any)=>{
        console.log(resp);
        this.contract.details.favoriteId = resp.id;
        this.contract.details.isFav = "1";
      },
      error:(resp)=>{
        console.log(resp);
        console.log(contract.details.Amsidnr);
      }
    });
  }
  
  unmarkFav(contract: ContractData){
    this.contractService.deleteContractFavourite(contract.details.favoriteId).subscribe({
      next:(resp:any)=>{
        console.log(resp);
        this.contract.details.isFav = "0";
      },
      error:(resp)=>{
        console.log(resp);
        console.log(contract.details.favoriteId);
      }
    });
  }

  toggleFav(contract: ContractData){
    this.contract.details.isFav == "1" ? this.unmarkFav(contract) : this.markFav(contract);
  }

  onAddPage(){
    this.router.navigate(['dashboard/home/adddocument']);
  }

  onBackNavClick(){
    this._location.back();
  }

  
  swipeLeft(){
      
    // var list = document.getElementsByClassName('task-list')[0];
    
    var mouseOrigin;
    var isSwiping = false;
    var mouseRelease;
    var currentTask: HTMLElement;
    var swipeMargin=80;
    var originalClassList;
    
    // Array.prototype.forEach.call(documents, function addSwipe(element){
    //   element.addEventListener('mousedown', startSwipe); 
    // });

    for (let element of this.documents) {
      element.addEventListener('mousedown', (evt)=>{
        
        mouseOrigin = evt.screenX;
        currentTask = evt.target;
        isSwiping = true;
        originalClassList = evt.target.classList.value;
        
      });
      
      element.addEventListener('mouseup', endSwipe);
      element.addEventListener('mousemove', detectMouse); 
    }
    

    /* 
      Defined events on document so that a drag or release outside of target 
      could be handled easily 
    */
    
    
    //ENDSWIPE
    function endSwipe(evt){
      var completedTask;    
      console.log(currentTask);
      if( currentTask.classList.contains("completing") ){
        currentTask.classList.remove("completing");
        currentTask.classList.add("completed");
        // list.appendChild(currentTask);
      }
      else if( currentTask.classList.contains("deleting") ){
        currentTask.remove();     
        alert("swiped left");
        console.log("swiped left"); 
      }      
      
      mouseOrigin = null;
      isSwiping = false;     
      currentTask.style.margin = "0";
      currentTask = null;
    }
    
    //DETECTMOUSE
    function detectMouse(evt){
      var currentMousePosition = evt.screenX;
      var swipeDifference = Math.abs(mouseOrigin - currentMousePosition)
      
      if(isSwiping && currentTask && (swipeDifference > swipeMargin) ){ 
        if( (swipeDifference-swipeMargin) <= swipeMargin ){
          //no change, allows user to take no action
          currentTask.classList.remove("completing");
          currentTask.classList.remove("deleting");
          currentTask.style.margin = "0";
        }
        else if( mouseOrigin > currentMousePosition ){
          //swipe left        
          currentTask.classList.remove("completing");
          currentTask.classList.add("deleting");
          currentTask.style.marginLeft = -swipeDifference+"px";
        }
      }
    }  
    
  };
}