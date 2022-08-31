import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const text = document.querySelectorAll(".text");
    let delay = 0;
    text.forEach((el:any)=>{
      el.style.animation = "fade-in 0.4s ease forwards";
      el.style.animationDelay= delay +"s";
      delay += 0.25;
    });
  }

}