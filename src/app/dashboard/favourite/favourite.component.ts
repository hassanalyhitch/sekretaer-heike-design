import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ContractData } from '../../models/contract.model';
import { FolderData } from '../../models/folder.model';
import { ContractsService } from '../../services/contracts.service';
import { FoldersService } from '../../services/folder.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.css']
})
export class FavouriteComponent implements OnInit, OnChanges {

  favContractArr:ContractData[] = [];
  allContractsArr:ContractData[] = [];
  
  favFoldersArr: FolderData[] = [];
  allFoldersArr: FolderData[] = [];

  constructor(private router:Router, private contractService: ContractsService, 
    private folderService: FoldersService,private loadingService:LoadingService) {
      
    this.loadingService.emitIsLoading(true);
     }


  ngOnChanges(changes: SimpleChanges): void {
    
  }

  ngOnInit() {
    this.contractService.getContracts().subscribe({
      next: ()=>{
        this.allContractsArr = this.contractService.userContractsArr;
        this.allContractsArr.forEach((contract)=>{
          
          if(contract.details.isFav === 1 || contract.details.isFav === '1' ){
            this.favContractArr.push(contract);
          }
          
        });
        console.log(this.favContractArr.length);
      },
      complete:()=>{
        
        
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
            this.loadingService.emitIsLoading(false);
          }
        });
      }
    });
    
  }

  onFavContractClick(favItem){
    let clickedContract: ContractData = this.favContractArr[favItem];
    // console.log(clickedContract);
    this.contractService.emitSelectedFolder(clickedContract);
    this.router.navigate(['dashboard/favourite/contract-detail', { id: clickedContract.details.Amsidnr }]);
  }

  onFolderCardClick(clickedFolder){

    this.folderService.emitSelectedFolder(clickedFolder);
    this.router.navigate(['dashboard/overview/folder-detail', { id: clickedFolder.id }]);
  }

  favArrHasNoContent(){
    return (this.favContractArr.length < 1 && this.favFoldersArr.length < 1 ) ? true : false ;
  }

}