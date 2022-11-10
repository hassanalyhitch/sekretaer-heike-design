import { Component, OnInit } from '@angular/core';
import { ContractData } from '../../models/contract.model';
import { DocumentData } from '../../models/document.model';
import { FolderData } from '../../models/folder.model';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent implements OnInit {

  searchValue = "";
  color:string = "#E5007E";

  insuranceResArr: ContractData[] = [];
  folderResArr: FolderData[] = [];
  documentResArr: DocumentData[] = [];

  constructor() { }

  ngOnInit() {

  }
  
  filterSearch(searchValue:string){
    console.log(searchValue);
    if(searchValue != undefined && searchValue != ""){
    }
  }

}