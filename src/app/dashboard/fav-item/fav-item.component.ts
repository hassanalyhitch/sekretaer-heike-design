import { Component, Input, OnInit } from '@angular/core';
import { ContractData } from '../../../models/contract.model';

@Component({
  selector: 'app-fav-item',
  templateUrl: './fav-item.component.html',
  styleUrls: ['./fav-item.component.css']
})
export class FavItemComponent implements OnInit {

  @Input() contractItem: ContractData;
  constructor() { }

  ngOnInit() {
  }

}