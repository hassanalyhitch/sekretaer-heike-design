import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginData } from '../models/login.model';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userInput = {};
  buttonDisabled = true;

  username = '';
  password = '';
  submitted: boolean = false;
  @Output('auth') authenticated = new EventEmitter<boolean>();
  @Output() lang = new EventEmitter<string>();
  @ViewChild('loginForm') loginForm: NgForm;
  errorMessage:string = null;
  errorStack:string [] = [];

  constructor(private http: HttpClient, private router: Router, private loginService: LoginService) { }

  ngOnInit() {
  }

  validateUser(formData: LoginData) {
      
    this.loginService.login(formData).subscribe({
      next: (resp) => {
        
        if(resp.hasOwnProperty("token")){
          this.authenticated.emit(true);

          //reset route
          // this.router.navigateByUrl('/insurance');
        }
      },
      error: (e) => {
        console.log(e);
        if(e.hasOwnProperty("name") && e.hasOwnProperty("statusText")){
          this.errorMessage = " "+e.name+" -> "+e.statusText;
          console.log( 'display this error => '+this.errorMessage);
        }

        if(e.error.hasOwnProperty('msg')){
          this.errorMessage = e.error.msg;
          console.log( 'display this error => '+this.errorMessage);
        } else if(e.error.hasOwnProperty('message')){
          this.errorMessage = e.error.msg;
          console.log( 'display this error => '+this.errorMessage);

        }
        this.errorStack.push(this.errorMessage);
        this.submitted = false;
      },
      complete: () => {
        // console.info('complete')
      }
    });
  }

  onSubmit(formData: LoginData) {
    formData.loginType = 'customer';
    this.submitted = true;
    this.errorMessage = null;
    this.validateUser(formData);
    this.loginForm.reset();
  }
}