import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @ViewChild('scrollChat', { static: true }) private scrollChat: ElementRef;

  constructor() { }

  ngOnInit() {
    const text = document.querySelectorAll(".text");
    let delay = 0;
    text.forEach((el:any)=>{
      el.style.animation = "fade-in 0.4s ease forwards";
      el.style.animationDelay= delay +"s";
      delay += 0.25;
    });
    this.scrollToBottom();
  }


  scrollToBottom(): void {
    try {
        document.getElementById('scrollChat').scrollTop = document.getElementById('scrollChat').scrollHeight;
        // this.scrollChat.nativeElement.scrollTop = this.scrollChat.nativeElement.scrollHeight;
    } catch(err) { 
      console.log(err)
    }                 
  }
}