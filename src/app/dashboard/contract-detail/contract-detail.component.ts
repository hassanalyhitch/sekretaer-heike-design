import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  AfterViewInit,
  ViewChildren,
  QueryList,
  ElementRef,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ContractData } from '../../models/contract.model';
import { DocumentData } from '../../models/document.model';
import { ContractsService } from '../../services/contracts.service';
import { RenameContractComponent } from '../rename-contract/rename-contract.component';
import { Location } from '@angular/common';
import { RenameModalComponent } from '../rename-modal/rename-modal.component';

@Component({
  selector: 'app-contract-detail',
  templateUrl: './contract-detail.component.html',
  styleUrls: ['./contract-detail.component.css'],
})
export class ContractDetailComponent implements OnInit, OnDestroy {
  @Input() index: string;

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
    },
    isSelected: false,
  };
  contractSub: Subscription;
  documents: any;
  swipedLeft: boolean = false;

  @ViewChildren('documentItem') documentItemList: QueryList<ElementRef>;

  docArr: DocumentData[] = [];

  constructor(
    private route: ActivatedRoute,
    private matDialog: MatDialog,
    private router: Router,
    private translate: TranslateService,
    private contractService: ContractsService,
    private _location: Location
  ) {
    this.contractSub = contractService.selectObservable.subscribe({
      next: (contract) => {
        // console.log(contract);
        this.contract = contract;
        contractService
          .getContractDetails(this.contract.details.Amsidnr)
          .subscribe({
            next: (resp: any) => {
              if (resp.hasOwnProperty('docs')) {
                for (let i = 0; i < resp.docs.length; i++) {
                  this.docArr.push(resp.docs[i]);
                }
                // console.table(this.docArr);
              }
            },
            complete: () => {},
          });
      },
    });
  }

  ngOnInit() {
    console.log('on view init');
    this.index = this.route.snapshot.paramMap.get('id');

    this.matDialog.afterAllClosed.subscribe({
      next: () => {
        console.log('closed dialogs in next');
        this.contractService
          .getContractDetails(this.contract.details.Amsidnr)
          .subscribe({
            next: (resp: any) => {
              if (resp.hasOwnProperty('docs')) {
                this.docArr = [];
                for (let i = 0; i < resp.docs.length; i++) {
                  resp.docs.swipedLeft = false;
                  this.docArr.push(resp.docs[i]);
                }
                // console.log(resp);
                this.contract.details.name = resp.name;
              }
            },
          });
      },
    });
  }

  ngOnDestroy() {
    this.contractSub.unsubscribe();
  }

  openModal(file) {
    const dialogConfig = new MatDialogConfig();
    // let passdata:string = '{"fileName": "'+this.file.name+'","fileUrl": "'+this.file.fileUrl+'"}';
    let passdata: string =
      '{"contractName": "' +
      file.details.name +
      '","contractId": "' +
      file.details.Amsidnr +
      '"}';
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = false;
    dialogConfig.id = 'renamecontract-modal-component';
    // dialogConfig.height = '80%';
    // dialogConfig.width = '90%';
    dialogConfig.data = passdata;
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(
      RenameContractComponent,
      dialogConfig
    );
  }

  markFav(contract: ContractData) {
    this.contractService
      .makeContractFavourite(contract.details.Amsidnr)
      .subscribe({
        next: (resp: any) => {
          console.log(resp);
          this.contract.details.favoriteId = resp.id;
          this.contract.details.isFav = '1';
        },
        error: (resp) => {
          console.log(resp);
          console.log(contract.details.Amsidnr);
        },
      });
  }

  unmarkFav(contract: ContractData) {
    this.contractService
      .deleteContractFavourite(contract.details.favoriteId)
      .subscribe({
        next: (resp: any) => {
          console.log(resp);
          this.contract.details.isFav = '0';
        },
        error: (resp) => {
          console.log(resp);
          console.log(contract.details.favoriteId);
        },
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
    console.log('afterViewInit ' + this.docArr.length);
    this.documentItemList.changes.subscribe({
      next: (t) => {
        if (this.docArr.length > 0) {
          console.log('after view init ' + this.documentItemList.length);
          // this.swipeLeft();
        }
      },
    });
  }

  renameFileModal(file) {
    const dialogConfig = new MatDialogConfig();
    // let passdata:string = '{"fileName": "'+this.file.name+'","fileUrl": "'+this.file.fileUrl+'"}';
    let passdata:string = '{"docName": "'+file.name+'","docid": "'+file.docid+'","systemId": "'+file.systemId+'"}';
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = false;
    dialogConfig.id = 'modal-component';
    // dialogConfig.height = '80%';
    // dialogConfig.width = '90%';
    dialogConfig.data = passdata;
    // https://material.angular.io/components/dialog/overview
    const renameFileDialog = this.matDialog.open(RenameModalComponent, dialogConfig);
  }

  onSwipe(evt, doc: DocumentData) {
    const swipeDirection = Math.abs(evt.deltaX) > 40 ? (evt.deltaX > 0 ? 'right' : 'left'):'';
    
    console.log('swiped '+swipeDirection);
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

  // swipeLeft() {
  //   // var list = document.getElementsByClassName('task-list')[0];

  //   var mouseOrigin;
  //   var isSwiping = false;
  //   var mouseRelease;
  //   var currentTask;
  //   var swipeMargin = 40;
  //   var originalClassList;
  //   let mainClass = this;
  //   let touchstartX = 0;
  //   var touchstartY = 0;
  //   var touchendX = 0;
  //   var touchendY = 0;

  //   // Array.prototype.forEach.call(documents, function addSwipe(element){
  //   //   element.addEventListener('mousedown', startSwipe);
  //   // });

  //   this.documentItemList.forEach((element) => {
  //     element.nativeElement.addEventListener('mousedown', (evt) =>
  //       startSwipe(evt, element)
  //     );
  //     element.nativeElement.addEventListener(
  //       'touchstart',
  //       function (event) {
  //         touchstartX = event.screenX;
  //         touchstartY = event.screenY;
  //         console.log('touch start');
  //       },
  //       false
  //     );
  //   });

  //   this.documentItemList.forEach((element) => {
  //     element.nativeElement.addEventListener('mousemove', detectMouse);
  //     element.nativeElement.addEventListener('mouseup', endSwipe);

  //     element.nativeElement.addEventListener(
  //       'touchend',
  //       function (event) {
  //         touchendX = event.screenX;
  //         touchendY = event.screenY;
  //         handleGesture();
  //       },
  //       false
  //     );
  //   });

  //   // touch swipe

  //   function handleGesture() {
  //     var swiped = 'swiped: ';
  //     if (touchendX < touchstartX) {
  //       console.log(swiped + 'left!');
  //     }
  //     if (touchendX > touchstartX) {
  //       console.log(swiped + 'right!');
  //     }
  //     if (touchendY < touchstartY) {
  //       console.log(swiped + 'down!');
  //     }
  //     if (touchendY > touchstartY) {
  //       console.log(swiped + 'up!');
  //     }
  //     if (touchendY == touchstartY) {
  //       console.log('tap!');
  //     }
  //   }

  //   //STARTSWIPE
  //   function startSwipe(evt, element) {
  //     mouseOrigin = evt.screenX;
  //     currentTask = element.nativeElement;
  //     isSwiping = true;
  //     originalClassList = evt.target.classList.value;
  //   }

  //   //ENDSWIPE
  //   function endSwipe(evt) {
  //     console.log(currentTask);
  //     if (currentTask.classList.contains('swipingRight')) {
  //       currentTask.classList.remove('swipingRight');
  //       currentTask.classList.remove('swipingLeft');
  //       mainClass.swipedLeft = false;
  //       currentTask.style.marginLeft = 0 + 'px';
  //       currentTask.style.marginRight = 0 + 'px';
  //       // list.appendChild(currentTask);
  //     } else if (currentTask.classList.contains('swipingLeft')) {
  //       // currentTask.remove();
  //       console.log('swipe end');
  //       currentTask.classList.remove('swipingLeft');
  //       currentTask.classList.remove('swipingRight');
  //       mainClass.swipedLeft = true;
  //       currentTask.style.marginLeft = -swipeMargin + 'px';
  //       currentTask.style.marginRight = swipeMargin + 'px';
  //     }

  //     mouseOrigin = null;
  //     isSwiping = false;
  //     currentTask.style.margin = '0';
  //     currentTask = null;
  //   }

  //   //DETECTMOUSE
  //   function detectMouse(evt) {
  //     var currentMousePosition = evt.screenX;
  //     var swipeDifference = Math.abs(mouseOrigin - currentMousePosition);

  //     if (isSwiping && currentTask && swipeDifference > swipeMargin) {
  //       if (swipeDifference - swipeMargin < swipeMargin) {
  //         //swiping right
  //         console.log('swiping right');
  //         currentTask.classList.remove('swipingLeft');
  //         currentTask.classList.add('swipingRight');
  //         currentTask.style.marginLeft = swipeDifference + 'px';
  //         currentTask.style.marginRight = -swipeDifference + 'px';
  //       } else if (mouseOrigin > currentMousePosition) {
  //         //swipe left
  //         console.log('swiping left');
  //         currentTask.classList.remove('swipingRight');
  //         currentTask.classList.add('swipingLeft');
  //         currentTask.style.marginLeft = -swipeDifference + 'px';
  //         currentTask.style.marginRight = swipeDifference + 'px';
  //       }
  //     }
  //   }
  // }
}
