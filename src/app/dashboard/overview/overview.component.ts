import { LoadingService } from '../../services/loading.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractData } from '../../models/contract.model';
import { FolderData } from '../../models/folder.model';
import { ContractsService } from '../../services/contracts.service';
import { FoldersService } from '../../services/folder.service';
import { NewFolderComponent } from '../new-folder/new-folder.component';
import { AddPageModalComponent } from '../add-page-modal/add-page-modal.component';
import { RenameFolderComponent } from '../rename-folder/rename-folder.component';
import { RenameContractComponent } from '../rename-contract/rename-contract.component';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Subject, takeUntil } from "rxjs";


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  allContractsArr:ContractData[] = [];
  subsetArr:ContractData[] = this.allContractsArr;

  templateContractArrLength: number = 0;
  templateFolderArrLength: number = 0;
  defaultContractReturnVal: boolean = true;

  contractCategory:any[][] = [];

  foldersArr: FolderData[] = [{
    id :  "",
    loginId :  "",
    customerAmsidnr :  "",
    ownerFolderId :  "",
    folderName :  "",
    createTime :  "",
    createdAt :  "",
    subFolders : [],
    docs: [],
    isFavorite: 0,
    favoriteId: 0,
    isSelected:false,
    swipedLeft: false
  },
  {
    id :  "",
    loginId :  "",
    customerAmsidnr :  "",
    ownerFolderId :  "",
    folderName :  "",
    createTime :  "",
    createdAt :  "",
    subFolders : [],
    docs: [],
    isFavorite: 0,
    favoriteId: 0,
    isSelected:false,
    swipedLeft: false
  },
  {
    id :  "",
    loginId :  "",
    customerAmsidnr :  "",
    ownerFolderId :  "",
    folderName :  "",
    createTime :  "",
    createdAt :  "",
    subFolders : [],
    docs: [],
    isFavorite: 0,
    favoriteId: 0,
    isSelected:false,
    swipedLeft: false
  }
];

  folder:FolderData;
  contract:ContractData;

  folderSubsetArr: FolderData[] = [];

  showCard3:boolean = false;
  showCard2:boolean = false;
  showCard1:boolean = false;

  showFolderCard3:boolean = false;
  showFolderCard2:boolean = false;
  showFolderCard1:boolean = false;

  collapsed:boolean = true;
  collapsedFolders:boolean = true;

  sortContractTitleByAsc:boolean = true;
  ascendContractTitle:ContractData[] =[];
  descendContractTitle:ContractData[]= [];

  sortContractDateByAsc:boolean = true;
  ascendContractDate:ContractData[] =[];
  descendContractDate:ContractData[] =[];

  sortFolderTitleByAsc:boolean = true;
  ascendFolderTitle:FolderData[]=[];
  descendFolderTitle:FolderData[] =[];
 
 
  sortFolderDateByAsc:boolean = true;
  ascendFolderDate:FolderData[] =[];
  descendFolderDate:FolderData[] =[];

  //screen layout changes
  destroyed = new Subject<void>();
  

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

  @ViewChild('defaultContractCard', {static: false, read: ElementRef}) defaultContractCard: ElementRef<HTMLElement>;

  constructor(
    private router:Router,
    private route: ActivatedRoute, 
    private contractService: ContractsService, 
    private folderService: FoldersService,
    private matDialog: MatDialog,
    private translate: TranslateService,
    private snackbar:MatSnackBar,
    private breakpointObserver: BreakpointObserver,
    private loadingService:LoadingService
    ) {
      this.loadingService.emitIsLoading(true);
      this.isMobileView = false;
      this.isDesktopView = false;
     }

  ngOnInit() {
    this.allContractsArr = [{
      id: 0,
      details: {
        Amsidnr: "",
        BranchSekretaer: '',
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
    },
    {
      id: 0,
      details: {
        Amsidnr: "",
        BranchSekretaer: '',
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
    },
    {
      id: 0,
      details: {
        Amsidnr: "",
        BranchSekretaer: '',
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
    }];

    this._init();

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

  _init(){
    this.contractService.getContracts().subscribe({
      next: ()=>{
      
        this.allContractsArr = this.contractService.userContractsArr;

        this.templateContractArrLength = this.contractService.userContractsArr.length;

        if(this.templateContractArrLength == 1){
          this.collapsed = false;
        }

        this.contractCategory.length = 0;
        
        //sort all arr by BranchSekretaer
        this.allContractsArr.sort((a,b) =>a.details.BranchSekretaer.localeCompare(b.details.BranchSekretaer));
        this.contractService.userContractsArr = this.allContractsArr;

        if(this.contractService.userContractsArr.length>5){
          //console.table(this.allContractsArr);
          let category = "";

          for(let i=0; i<this.allContractsArr.length; i++){
            let branchSekretaer = this.allContractsArr[i].details.BranchSekretaer;

            if(category != branchSekretaer){
              category = branchSekretaer;
              this.contractCategory.push([]);
              if(this.contractCategory.length == 0){
                this.contractCategory[0].push(this.allContractsArr[i]);
              }else{
                this.contractCategory[this.contractCategory.length - 1].push(this.allContractsArr[i]);
              }
            } else {
              this.contractCategory[this.contractCategory.length - 1].push(this.allContractsArr[i]);
            }
          }

          //console.log(this.contractCategory);
        } else {

          this.contractCategory[0] = this.allContractsArr;
        }

      },
      complete:()=>{
        this.folderService.getFolders().subscribe({
          next: (resp)=>{

            this.foldersArr = this.folderService.userFolderArr;

            this.templateFolderArrLength = this.folderService.userFolderArr.length;

            for(let i=0;i<this.foldersArr.length;i++){
              this.foldersArr[i].swipedLeft = false;
            }

            this.folderSubsetArr = [];

            if(this.foldersArr.length>3){
              this.showFolderCard1 = true;
              this.showFolderCard2 = true;
              this.showFolderCard3 = true;

              for(let i=3; i<this.foldersArr.length; i++){
                this.folderSubsetArr.push(this.foldersArr[i]);
              }

            } else {
              this.foldersArr.length>0 ? this.showFolderCard3 = true: this.showFolderCard3 = false;
              this.foldersArr.length>1 ? this.showFolderCard2 = true: this.showFolderCard2 = false;
              this.foldersArr.length>2 ? this.showFolderCard1 = true: this.showFolderCard1 = false;
              let emptyFolder: FolderData = {
                id :  "",
                loginId :  "",
                customerAmsidnr :  "",
                ownerFolderId :  "",
                folderName :  "",
                createTime :  "",
                createdAt :  "",
                subFolders : [],
                docs: [],
                isFavorite: 0,
                favoriteId: 0,
                isSelected:false,
                swipedLeft: false
              }
              this.foldersArr.push(emptyFolder);
              this.foldersArr.push(emptyFolder);
              this.foldersArr.push(emptyFolder);
            }

          },
          complete:()=>{
            this.loadingService.emitIsLoading(false);
          }
        });
       
      }
      
    });

  }

  onCardClick(clickedContract){
    
    this.contractService.emitSelectedContract(clickedContract);
    this.router.navigate(
      ['dashboard/overview/contract-detail', 
        { 
          id: clickedContract.details.Amsidnr
        }
      ]);
    
  }

  onFolderCardClick(clickedFolder){

    this.folderService.emitSelectedFolder(clickedFolder);

    if(this.router.url.includes('overview')){

      if(this.isMobileView){
        this.router.navigate([
          "/dashboard/overview/folder-detail",
          { id: clickedFolder.id },
        ]);

      } else {
        this.router.navigate([
          '/dashboard/overview/', 
          { outlets: { 'desktop': ['folder-detail', { id: clickedFolder.id }] } }
        ]);
      }

    }
  }

  collapse(){
    
    if(this.templateContractArrLength > 1){
      this.contractService.resetAllObs();

    }
    
  }

  collapseFolders(){

    if(this.templateFolderArrLength > 1){

      if(!this.collapsedFolders){
      
        document.getElementById("folders").setAttribute("style","min-height:230px;height:230px;");
        document.getElementById("extra-folders").setAttribute("style","transition: opacity 0s;");
        setTimeout(()=>{this.collapsedFolders = true;},200);
      }

    }
  }

  onDefaultInsuranceCardClick(){

    if(this.collapsed===false){

      this.collapsed = false;
      this.defaultContractCard.nativeElement.click();
      
    } else {
  
      if(this.showCard3 && !this.showCard2 && !this.showCard1){
        //show detail page
        this.collapsed = false;
        this.defaultContractCard.nativeElement.click();
        
      } else if(this.showCard2 && !this.showCard1){
        //expand 2
        this.collapsed = false;
        document.getElementById("cards").setAttribute("style","min-height:380px;height:380px;");
        setTimeout(()=>{
          document.getElementById("extra-cards").setAttribute("style","transition: all 0.4s;opacity:1;");
        },10);
        
      } else {
        //expand all
        this.collapsed = false;
        document.getElementById("cards").setAttribute("style","min-height:570px;height:570px;");
        setTimeout(()=>{
          document.getElementById("extra-cards").setAttribute("style","transition: all 0.4s;opacity:1;");
        },10);
        
      }

    }

  }
  
  onDefaultFolderCardClick(){

    if(this.collapsedFolders===false){

      this.folderService.emitSelectedFolder(this.foldersArr[0]);

      if(this.router.url.includes('overview')){

        if(this.isMobileView){
          this.router.navigate([
            "/dashboard/overview/folder-detail",
            { id: this.foldersArr[0].id },
          ]);

        } else {
          this.router.navigate([
            '/dashboard/overview/', 
            { outlets: { 'desktop': ['folder-detail', { id: this.foldersArr[0].id }] } }
          ]);
        }

      }

    } else {

        
      if(this.showFolderCard3 && !this.showFolderCard2 && !this.showFolderCard1){
        //show detail page
        this.folderService.emitSelectedFolder(this.foldersArr[0]);

        if(this.router.url.includes('overview')){

          if(this.isMobileView){
            this.router.navigate([
              "/dashboard/overview/folder-detail",
              { id: this.foldersArr[0].id },
            ]);

          } else {
            this.router.navigate([
              '/dashboard/overview/', 
              { outlets: { 'desktop': ['folder-detail', { id: this.foldersArr[0].id }] } }
            ]);
          }

        }

      } else if(this.showFolderCard2 && !this.showFolderCard1){
        //expand 2
        this.collapsedFolders = false;
        document.getElementById("folders").setAttribute("style","min-height:380px;height:380px;");
        setTimeout(()=>{
          document.getElementById("extra-folders").setAttribute("style","transition: all 0.4s;opacity:1;");
        },10);
        
      } else {
        //expand all
        this.collapsedFolders = false;
        document.getElementById("folders").setAttribute("style","min-height:570px;height:570px;");
        setTimeout(()=>{
          document.getElementById("extra-folders").setAttribute("style","transition: all 0.4s;opacity:1;");
        },10);
      }

    }
  }
 
  addNewFolder(){
    const dialogConfig = new MatDialogConfig();
    
    let passdata:string = '{"parentFolderId": 0 }';
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = false;
    dialogConfig.id = 'newfolder-modal-component';
    //dialogConfig.height ='210px';
    dialogConfig.width = '350px';
  
    dialogConfig.panelClass ='bg-dialog-folder';
    dialogConfig.data = passdata;
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(NewFolderComponent, dialogConfig);
    
    this.matDialog.getDialogById('newfolder-modal-component').afterClosed().subscribe({
      next:()=>{

        //refresh folder list
        this._init();
      }
    });
  }
  
  onAddContract(){
    this.router.navigate(['dashboard/overview/new-contract']);
  }
  
  sortByContractTitle(){

    if(this.templateContractArrLength > 1){

      if(this.sortContractTitleByAsc){
        this.ascendContractTitle = this.allContractsArr.sort((a,b) =>a.details.name.localeCompare(b.details.name));
  
        this.allContractsArr =this.ascendContractTitle;
        if(this.allContractsArr.length>3){
          this.subsetArr = [];
          for(let i=3; i<this.allContractsArr.length; i++){
            this.subsetArr.push(this.allContractsArr[i]);
          }
        }
      this.sortContractTitleByAsc = !this.sortContractDateByAsc;
      }else
      {
        this.descendContractTitle = this.allContractsArr.sort((a,b) =>a.details.name.localeCompare(b.details.name)).reverse();
        this.allContractsArr = this.descendContractTitle;
        if(this.allContractsArr.length>3){
          this.subsetArr = [];
          for(let i=3; i<this.allContractsArr.length; i++){
            this.subsetArr.push(this.allContractsArr[i]);
          }
        }
        this.sortContractTitleByAsc = !this.sortContractTitleByAsc;
      }

    } else if(this.templateContractArrLength == 0){

      this.snackbar.open(this.translate.instant('overview.no_contracts_found'),
      this.translate.instant('snack_bar.action_button'),{
        panelClass:['snack_error'],
        duration: 8000,
      });

    }

  }

  sortByContractDate(){
    
    if(this.templateContractArrLength > 1){

      if (this.sortContractDateByAsc){
        this.allContractsArr.sort ((a,b)=>{
          try{
            let dateA = new Date(a.details.EndDate);
            let dateB = new Date(b.details.EndDate);
  
            if ((dateA instanceof Date && !isNaN(dateA.getTime()))&&(dateB instanceof Date && !isNaN(dateB.getTime()))) {
              //valid date object
              return dateA >= dateB ? 1 : -1; 
            } else {
            
            }
          }
          catch(e){
              
          }
        });
        this.subsetArr =[];
        if (this.allContractsArr.length>3){
          for (let i=3;i<this.allContractsArr.length;i++){
            this.subsetArr.push(this.allContractsArr[i]);
          }
        }
        this.sortContractDateByAsc = !this.sortContractDateByAsc;
      }else{
        this.allContractsArr.reverse();
        this.subsetArr =[];
        if (this.allContractsArr.length>3){
          for (let i=3;i<this.allContractsArr.length;i++){
            this.subsetArr.push(this.allContractsArr[i]);
          }
        }
        this.sortContractDateByAsc = !this.sortContractDateByAsc;
      }

    } else if(this.templateContractArrLength == 0){

      this.snackbar.open(this.translate.instant('overview.no_contracts_found'),
      this.translate.instant('snack_bar.action_button'),{
        panelClass:['snack_error'],
        duration: 8000,
      });

    }

  }

  sortByFolderTitle(){

    if(this.templateFolderArrLength == 0){

      this.snackbar.open(this.translate.instant('overview.no_folders_found'),
      this.translate.instant('snack_bar.action_button'),{
        panelClass:['snack_error'],
        duration: 8000,
      });

    } else if(this.templateFolderArrLength > 1) {

      if (this.sortFolderTitleByAsc){
        this.ascendFolderTitle = this.foldersArr.sort((a,b) =>a.folderName.localeCompare(b.folderName));
        this.folderSubsetArr = this.ascendFolderTitle;
        
        if(this.foldersArr.length>3){
        this.folderSubsetArr = [];
        for(let i=3; i<this.foldersArr.length; i++){
          this.folderSubsetArr.push(this.foldersArr[i]);
        }
      }
        this.sortFolderTitleByAsc =!this.sortFolderTitleByAsc;
      }else{
        this.descendFolderTitle = this.foldersArr.sort((a,b)=>a.folderName.localeCompare(b.folderName)).reverse();
        this.folderSubsetArr = this.descendFolderTitle;
        if(this.foldersArr.length>3){
        this.folderSubsetArr = [];
        for(let i=3; i<this.foldersArr.length; i++){
          this.folderSubsetArr.push(this.foldersArr[i]);
        }
      }
        this.sortFolderTitleByAsc = !this.sortFolderTitleByAsc;
      }

    }

   }

   sortByFolderDate(){

    if(this.templateFolderArrLength == 0){

      this.snackbar.open(this.translate.instant('overview.no_folders_found'),
      this.translate.instant('snack_bar.action_button'),{
        panelClass:['snack_error'],
        duration: 8000,
      });

    } else if(this.templateFolderArrLength > 1){

      if (this.sortFolderDateByAsc){
           this.foldersArr.sort((a,b)=>{
            try{
              let dateA = new Date(a.createdAt);
              let dateB = new Date(b.createdAt);
  
              if ((dateA instanceof Date && !isNaN(dateA.getTime()))&&(dateB instanceof Date && !isNaN(dateB.getTime()))) {
                //valid date object
                return dateA >= dateB ? 1 : -1; 
              } else {
               
              }
            }
            catch(e){
              
            }
           });
           this.folderSubsetArr = [];
              if(this.foldersArr.length>3){
                for(let i=3; i<this.foldersArr.length; i++){
                  this.folderSubsetArr.push(this.foldersArr[i]);
                }
              }
           this.sortFolderDateByAsc = !this.sortFolderDateByAsc;
      }else{
            this.foldersArr.reverse();
            this.folderSubsetArr = [];
            if(this.foldersArr.length>3){
              for(let i=3; i<this.foldersArr.length; i++){
                this.folderSubsetArr.push(this.foldersArr[i]);
              }
            }
            this.sortFolderDateByAsc = !this.sortFolderDateByAsc;
      }

    }

  }

  onSearchFoldersClicked(){
    if(this.templateFolderArrLength == 0){

      this.snackbar.open(this.translate.instant('overview.no_folders_found'),
      this.translate.instant('snack_bar.action_button'),{
        panelClass:['snack_error'],
        duration: 8000,
      });

    } else {
      if(this.isMobileView){
        this.router.navigate(['dashboard/search', {searchType:'folders'}]);
      } else {
        this.router.navigate(['dashboard/search', {searchType:'folders'}]);
      }
    }
  }

  onSearchContractsClicked(){
    if(this.templateContractArrLength == 0){

      this.snackbar.open(this.translate.instant('overview.no_contracts_found'),
      this.translate.instant('snack_bar.action_button'),{
        panelClass:['snack_error'],
        duration: 8000,
      });

    } else {
      if(this.isMobileView){
        this.router.navigate(['dashboard/search', {searchType:'contracts'}]);
      } else {
        this.router.navigate(['dashboard/search', {searchType:'contracts'}]);
      }
    }
  }

  onFolderSwipe(evt,folder:FolderData){
    const swipeDirection = Math.abs(evt.deltaX) > 40 ? (evt.deltaX > 0 ? 'right' : 'left'):'';

    switch(swipeDirection){
      case 'left':{
        if(!this.collapsedFolders){
          folder.swipedLeft = true;
       }
        break;
      }
      case 'right':{

        folder.swipedLeft = false;
        break;
      }
    }

  }

  renameFolderModal(folder:FolderData){
    const dialogConfig = new MatDialogConfig();
    // let passdata:string = '{"fileName": "'+this.file.name+'","fileUrl": "'+this.file.fileUrl+'"}';
    let passdata:string = '{"folderName": "'+folder.folderName+'","folderId": "'+folder.id+'"}';
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = false;
    dialogConfig.id = 'renamefolder-modal-component';
    //dialogConfig.height = '350px';
    dialogConfig.width = '350px';
    dialogConfig.data = passdata;

    dialogConfig.panelClass = 'bg-dialog-folder';
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(RenameFolderComponent, dialogConfig);
    
    this.matDialog.getDialogById('renamefolder-modal-component').afterClosed().subscribe({
      next:()=>{
        this.folderService.getFolderDetails(folder.id).subscribe({
          next:(resp:any) =>{
           

            //refresh folders list
            this._init();
           
            
          },
          complete:()=>{},
        });
      },
      error:(resp)=>{
      
      }
    });
  }

  addFolderDoc(folder:FolderData){
    const dialogConfig = new MatDialogConfig();
    this.folderService.emitSelectedFolder(folder);
    let passdata:string = '{ "folderName": "'+folder.folderName+'","folderId": "'+folder.id+'","document_type":"folder" }';
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = false;
    dialogConfig.id = 'add-document-modal-component';
    dialogConfig.width = '400px';
    dialogConfig.data = passdata;

    dialogConfig.panelClass = 'bg-dialog-folder';
    
    const modalDialog = this.matDialog.open(AddPageModalComponent, dialogConfig);

    this.matDialog.getDialogById('add-document-modal-component').afterClosed().subscribe({
      next:()=>{
       
        this.folderService.getFolderDetails(folder.id).subscribe({
          next:(resp:any) =>{
            
            //refresh contract list
            this._init();
          },
          complete:()=>{},
        });
      },
      error:(resp)=>{
        
      }
    });

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

}
