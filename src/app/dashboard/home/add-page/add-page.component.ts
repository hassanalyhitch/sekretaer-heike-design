import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.css']
})
export class AddPageComponent implements OnInit {
  name = 'Insurance';
  dataList: Array<any> = [];
  schedule: { branch: '' };

  constructor() { 
    this.dataList = [
      { code: 1, name: "Please select Category" },
      { code: 2, name: "life Insurance " },
      { code: 3, name: "motor vehicle Insurance" },
      { code: 4, name: "Property Insurance" },
      { code: 5, name: "Liability Insurance" },
      { code: 6, name: "Fire Insurance" }
    ]
  }

  ngOnInit(): void {
    
  }

}
