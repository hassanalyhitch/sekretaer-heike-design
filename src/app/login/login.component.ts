import { Component, OnInit, Output, EventEmitter } from '@angular/core';

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
  errorMessage = null;

  constructor() { }

  ngOnInit() {
  }

}