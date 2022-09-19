import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-rename-contract',
  templateUrl: './rename-contract.component.html',
  styleUrls: ['./rename-contract.component.css']
})
export class RenameContractComponent implements OnInit {

  dataObj:{
    contractName: string,
    contractId: string
  };
  documentName: string = "";
  newContractName: string= "";

  constructor(@Inject(MAT_DIALOG_DATA)public data:any) { 

    this.dataObj = JSON.parse(this.data);
    this.documentName = this.dataObj.contractName;
    

  }
  ngOnInit() {
    alert(this.data);
  }

  onSubmit(formData: any) {
  
  }
}