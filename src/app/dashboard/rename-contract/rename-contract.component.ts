import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RenameContractService } from '../../services/rename-contract.service';
import { Location } from '@angular/common';


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

  constructor(@Inject(MAT_DIALOG_DATA)public data:any, private renameService: RenameContractService,private _location: Location) { 

    this.dataObj = JSON.parse(this.data);
    this.documentName = this.dataObj.contractName;
    
  }

  ngOnInit() {
    // alert(this.data);
  }

  onSubmit(formData: any) {
    console.log(formData);
    this.renameService.rename(this.dataObj.contractId , formData).subscribe({
      complete:()=>{ 
        this._location.back();
      }
    });
  }

}