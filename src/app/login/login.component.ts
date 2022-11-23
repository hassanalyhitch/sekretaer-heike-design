import { HttpClient } from "@angular/common/http";
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  Input,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { LoginData } from "../models/login.model";
import { LoginService } from "../services/login.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  userInput = {};
  buttonDisabled = true;

  username = "";
  password = "";
  submitted: boolean = false;
  @Output("auth") authenticated = new EventEmitter<boolean>();
  @Output() lang = new EventEmitter<string>();
  @ViewChild("loginForm", { static: true }) loginForm: NgForm;
  errorMessage: string = null;
  errorStack: string[] = [];

  @Input() privacy_policy: boolean = false;
  @Output() onShowPrivacyPolicy = new EventEmitter<boolean>();

  @Input() terms_and_conditions: boolean = false;
  @Output() onShowTermsAndConditions = new EventEmitter<boolean>();

  @Input() forgot_password: boolean = false;
  @Output() onShowForgotPassword = new EventEmitter<boolean>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit() {}

  validateUser(formData: LoginData) {
    this.loginService.login(formData).subscribe({
      next: (resp) => {
        if (resp.hasOwnProperty("token")) {
          this.authenticated.emit(true);
          this.lang.emit(this.loginService.lang);

          //reset route
          // this.router.navigateByUrl('/insurance');
        }
      },
      error: (e) => {
        console.log(e);
        if (e.hasOwnProperty("name") && e.hasOwnProperty("statusText")) {
          this.errorMessage = " " + e.name + " -> " + e.statusText;
          console.log("display this error => " + this.errorMessage);
        }

        if (e.error.hasOwnProperty("msg")) {
          this.errorMessage = e.error.msg;
          console.log("display this error => " + this.errorMessage);
        } else if (e.error.hasOwnProperty("message")) {
          this.errorMessage = e.error.message;
          console.log("display this error => " + this.errorMessage);
        }
        this.showSnackbar(this.errorMessage);
        this.submitted = false;
      },
      complete: () => {
        // console.info('complete')
      },
    });
  }

  showSnackbar(error: string) {
    this.errorStack.push(this.errorMessage);
    setInterval(() => {
      this.errorStack.pop();
    }, 8000);
  }

  onSubmit(formData: LoginData) {
    formData.loginType = "customer";
    this.submitted = true;
    this.errorMessage = null;
    this.validateUser(formData);
  }

  onPolicySelected() { 
    this.privacy_policy = true;
    this.onShowPrivacyPolicy.emit(this.privacy_policy); 
  }

  onTermsAndConditionSelected() { 
    this.terms_and_conditions = true;
    this.onShowTermsAndConditions.emit(this.terms_and_conditions); 
  }

  onForgotPasswordSelected(){
    this.forgot_password = true;
    this.onShowForgotPassword.emit(this.forgot_password);
  }
  
}
