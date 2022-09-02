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
      el.style.animation = "fade-in 0.1s ease forwards";
      el.style.animationDelay= delay +"s";
      delay += 0.1;
    });

    setTimeout(()=>{

      this.scrollToBottom();
    },1000);
  }


  scrollToBottom(): void {
    try {
      // let scrollHeight = document.getElementById('scrollChat').scrollHeight;
      // document.getElementById('scrollChat').scrollTop = scrollHeight;
        this.scrollChat.nativeElement.scrollTop = this.scrollChat.nativeElement.scrollHeight;
    } catch(err) { 
      console.log(err)
    }                 
  }
}