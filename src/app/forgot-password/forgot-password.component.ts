import { HttpClient } from "@angular/common/http";
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  Input,
} from "@angular/core";

import { Location } from '@angular/common';

import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";

import { LoginData } from "../models/login.model";
import { LoginService } from "../services/login.service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  userInput = {};
  buttonDisabled = true;

  email: string = "";
  submitted: boolean = false;

  isFormSubmmited: boolean = false;

  selected_theme: string;
  app_logo_link_src: string;

  @ViewChild("loginForm", { static: true }) loginForm: NgForm;
  errorMessage: string = null;
  errorStack: string[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private loginService: LoginService,
    private _location: Location
  ) {
    this.app_logo_link_src = "../assets/sekretaer_pink_logo.svg"; //default logo 
    this.selected_theme = "";
  }

  ngOnInit(): void {

    this.selected_theme = localStorage.getItem('theme_selected');

      if(!this.selected_theme){
    
        this.app_logo_link_src = "../assets/sekretaer_pink_logo.svg";

      } else if(this.selected_theme == 'pink'){
        //use pink logo
        this.app_logo_link_src = "../assets/sekretaer_pink_logo.svg";
  
      } else if(this.selected_theme == 'blue'){
        //use blue logo
        this.app_logo_link_src = "../assets/sekretar_blue_logo.svg";
        
      }
    
  }

  validateUser(formData: LoginData) {

    // TODO: Reset Password Service

    // this.loginService.login(formData).subscribe({
    //   next: (resp) => {
    //     // if (resp.hasOwnProperty("token")) {
    //     //   this.authenticated.emit(true);
    //     //   this.lang.emit(this.loginService.lang);
    //     // }

    //     console.log("Forgot Password Response=> " + resp);

    //   },
    //   error: (e) => {
    //     console.log(e);
    //     if (e.hasOwnProperty("name") && e.hasOwnProperty("statusText")) {
    //       this.errorMessage = " " + e.name + " -> " + e.statusText;
    //       console.log("display this error => " + this.errorMessage);
    //     }

    //     if (e.error.hasOwnProperty("msg")) {
    //       this.errorMessage = e.error.msg;
    //       console.log("display this error => " + this.errorMessage);
    //     } else if (e.error.hasOwnProperty("message")) {
    //       this.errorMessage = e.error.message;
    //       console.log("display this error => " + this.errorMessage);
    //     }
    //     this.showSnackbar(this.errorMessage);
    //     this.submitted = false;
    //   },
    //   complete: () => {
    //     // console.info('complete')
    //   },
    // });
  }

  // showSnackbar(error: string) {
  //   this.errorStack.push(this.errorMessage);
  //   setInterval(() => {
  //     this.errorStack.pop();
  //   }, 8000);
  // }

  onSubmit(formData: LoginData) {
    
    // this.errorMessage = null;
    // this.validateUser(formData);

    this.isFormSubmmited = true;
    
  }

}
