import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ContractsService } from '../../services/contracts.service';
import { ContractData } from '../../models/contract.model';
import { RenameContractComponent } from '../rename-contract/rename-contract.component';
import { AddPageModalComponent } from '../add-page-modal/add-page-modal.component';

@Component({
  selector: 'app-fav-item',
  templateUrl: './fav-item.component.html',
  styleUrls: ['./fav-item.component.css']
})
export class FavItemComponent implements OnInit {

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
  
  @Output() favoriteEvent = new EventEmitter<boolean>();

  src_link_for_icon_left: string;
  src_link_for_small_picture: string;

  constructor(
    private route: ActivatedRoute,
    private matDialog: MatDialog,
    private router: Router,
    private translate: TranslateService,
    private contractService: ContractsService,
    private snackbar:MatSnackBar
  ) {

    this.src_link_for_icon_left = "../assets/icon_allgemein.svg"; //default logo for icon left

  }

  ngOnInit() {

    //console.log("Contract Icon Left -> "+this.contractItem.details.iconLeft);

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
    // let passdata:string = '{"fileName": "'+this.file.name+'","fileUrl": "'+this.file.fileUrl+'"}';
    let passdata: string =
      '{"contractName": "' +
      file.details.name +
      '","contractId": "' +
      file.details.Amsidnr +
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

        // this.contractService
        //   .getContractDetails(this.contract_id)
        //   .subscribe({
        //     next: (resp: any) => {
              
        //       this.contract.details.name = resp.name;

        //     },
        //   });

      },
    });

  }

  markFav(contract: ContractData) {
    this.contractService
      .makeContractFavourite(contract.details.Amsidnr)
      .subscribe({
        next: (resp: any) => {
          console.log(resp);
          //this.contract.details.favoriteId = resp.id;
          //this.contract.details.isFav = '1';
        },
        error: (resp) => {
          // console.log(resp);
          // console.log(contract.details.Amsidnr);
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
          console.log(resp);
          //this.contract.details.isFav = '0';
        },
        error: (resp) => {
          // console.log(resp);
          // console.log(contract.details.favoriteId);
          this.snackbar.open(this.translate.instant('contract_detail.unmark_fav_error'),this.translate.instant('snack_bar.action_button'),{
            panelClass:['snack_error'],
            duration:1500,
          })
        },
        complete:()=>{
          this.snackbar.open(this.translate.instant('contract_detail.unmark_fav_success'),this.translate.instant('snack_bar.action_button'),{
            panelClass:['snack_success'],
            duration:1500,
          });
          this.favoriteEvent.emit(true);
        }
      });
  }

  onContractClick(clickedContract) {

    // console.log("From Fav Item Component: Contract Details ->"+JSON.stringify(clickedContract));
    //console.log(this.collapsed);

    if(!this.collapsed){

      this.contractService.emitSelectedFolder(clickedContract);
      this.router.navigate([
        "dashboard/home/contract-detail",
        { id: clickedContract.details.Amsidnr },
      ]);
    }

    return false;
  }

  addNewDocument(contract: ContractData) {

    const dialogConfig = new MatDialogConfig();

    let passdata:string = '{"contractName": "'+contract.details.name+'","contractId": "'+contract.details.Amsidnr+'","document_type":"contract" }';

    console.log("from fav item ->"+passdata);

    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = false;
    dialogConfig.id = 'add-document-modal-component';
    //dialogConfig.height = '350px';
    dialogConfig.width = '400px';
    dialogConfig.data = passdata;

    dialogConfig.panelClass = 'bg-dialog-folder';
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(AddPageModalComponent, dialogConfig);
    
    this.matDialog.getDialogById('add-document-modal-component').afterClosed().subscribe({
      next:()=>{

        // this.folderService.getFolderDetails(this.folder.id).subscribe({
        //   next:(resp:any) =>{
        //     console.log('folder-details');
        //     this.folder = this.folderService.selectedFolder;
        //   },
        //   complete:()=>{},
        // });

      },
      error:(resp)=>{
        console.log(resp);
      }
    });
  }

}