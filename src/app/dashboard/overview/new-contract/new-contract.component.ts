import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { NewContractClass } from '../../../models/new-contract.model';


@Component({
  selector: 'app-new-contract',
  templateUrl: './new-contract.component.html',
  styleUrls: ['./new-contract.component.css']
})

export class NewContractComponent implements OnInit {
begin:'';
end:'';
Amount:'';
risk:'';
payment:'';
contractNumber:'';

  branches:NewContractClass[] =[
    new NewContractClass("Branch1", "21/09/2008"),
    new NewContractClass("Branch2",  "15/01/2016"),
    new NewContractClass("Branch3","4/09/2009"),
    new NewContractClass("Branch4" ,"5/9/2008"),
  ];
 branchSelected:string;
 name='company';
  showcontract:string;
  BrokerForm:FormGroup;
  optionSelected:boolean=true;
  constructor() { }
 
  ngOnInit(): void {
    console.log(this.optionSelected);
  }

  showContracts(){
    this.showcontract=this.branchSelected;
  }

  onSubmit(formData:any){
    console.log('------------------------------');
    console.log(formData);
  }

  onOptionSelected(option:boolean){
    this.optionSelected = option;

    console.log(this.optionSelected);
  }

}
