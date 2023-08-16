import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackNavigationService } from '../../services/back-navigation.service';
import * as webauthn from '@passwordless-id/webauthn'
import { environment } from '../../../environments/environment';
import * as CryptoJS from 'crypto-js';  
import { LocalforageService } from '../../services/localforage.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  bioSetting: boolean = false;
  
  constructor(private router:Router,
    private navigation: BackNavigationService,
    private localForage: LocalforageService,
    private settingService: SettingsService) {}
  
  ngOnInit():void {
    let bioVal = this.settingService.getBiometrics();
    if(bioVal == 'true'){
      this.bioSetting = true;
    } 
  }

  onPolicySelect(){ 
    this.router.navigate(['dashboard/settings/privacy-policy']); 
  }

  onTermsAndConditionSelected(){ 
    this.router.navigate(['dashboard/settings/terms-and-conditions']); 
  }

  onLogoutSelect(){
    this.navigation.logout();
  }
  
  onMyData(){
    this.router.navigate(['dashboard/settings/my-data']);
  }

  onChangePassword(){
    this.router.navigate(['dashboard/settings/change-password']);
  }

  onChangeAppTheme(){
    this.router.navigate(['dashboard/settings/change-theme']);
  }

  onChangeAppLanguage(){
    this.router.navigate(['dashboard/settings/change-language']);
  }

  onChangePushNotificationSettings(){
    this.router.navigate(['dashboard/settings/change-push-notifications']);
  }

  onBiometricsToggleChange(event: MatSlideToggleChange){
    
    if(event.checked){

      let registration: any;
      
      this.localForage.listKeys().then((keys)=> {
        // An array of all the key names.
        console.log(keys[0]);
  
        if(keys[0]){
          
          this.localForage.get(keys[0]).then((obj)=>{
            
          let username = CryptoJS.AES.decrypt(Object.keys(obj)[0], environment.salt_key).toString(CryptoJS.enc.Utf8);     
          
            webauthn.client.register(username, environment.challenge, {
              "authenticatorType": "auto",
              "userVerification": "required",
              "timeout": 60000,
              "attestation": false,
              "debug": false
            }).then((result)=>{
                registration = result;
                console.log(registration);
                const listOfAllowedOrigins = [
                  "http://localhost:4200",
                  "http://192.168.100.220:1555",
                  "https://angular-ivy-2kmzni.stackblitz.io",
                  "https://apptest.sekretaer-online.de",
                  "https://app.sekretaer-online.de"
                ];
                
                webauthn.server.verifyRegistration(registration, 
                  {
                    challenge: environment.challenge,
                    origin: (origin) => listOfAllowedOrigins.includes(origin)
                  }).then((res)=>{
                    res.authenticator.counter = 1;
                    let biometricRegistrationEnc = CryptoJS.AES.encrypt(JSON.stringify(res), environment.salt_key).toString();
  
                    this.localForage.set("_b", biometricRegistrationEnc);
  
                    this.settingService.setBiometrics('true');

                    console.log(res);
                    console.log(res.authenticator.counter);
        
                  });
              }
            );

          });
  
        }
  
      }).catch(function(err) {
        // This code runs if there were any errors
        console.log(err);
      });

    } else {

      this.settingService.setBiometrics('false');

    }

  }
}