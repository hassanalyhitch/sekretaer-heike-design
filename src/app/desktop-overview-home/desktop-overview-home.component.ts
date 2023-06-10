import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-desktop-overview-home',
  templateUrl: './desktop-overview-home.component.html',
  styleUrls: ['./desktop-overview-home.component.scss']
})
export class DesktopOverviewHomeComponent implements OnInit {

  item_select_content_img_link: string;
  selected_theme: string;

  constructor() { }

  ngOnInit(): void {

    this.selected_theme = localStorage.getItem('theme_selected');

    if(!this.selected_theme){

      this.item_select_content_img_link = "../assets/item-select-no-content-pink.svg";

    } else if(this.selected_theme == 'default'){

      this.item_select_content_img_link = "../assets/item-select-no-content-pink.svg";

    } else if(this.selected_theme == 'blue'){

      this.item_select_content_img_link = "../assets/item-select-no-content.svg";

    }

  }


}
