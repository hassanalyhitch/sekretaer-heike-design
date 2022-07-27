import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-contract-detail',
  templateUrl: './contract-detail.component.html',
  styleUrls: ['./contract-detail.component.css']
})
export class ContractDetailComponent implements OnInit {

  @Input() index:string;

  constructor(
  private route: ActivatedRoute,
  private router: Router ) { }

  ngOnInit() {
    this.index = this.route.snapshot.paramMap.get('id');
  }

}