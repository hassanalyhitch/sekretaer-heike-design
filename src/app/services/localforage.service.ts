import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgForage } from 'ngforage';
import * as CryptoJS from 'crypto-js';  
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocalforageService {

  constructor(private ngf: NgForage) {
    
    let decrypted = CryptoJS.AES.decrypt(environment.salt_key,'').toString(CryptoJS.enc.Utf8);
    // console.log("Your decrypted key is " + decrypted);

    this.ngf.storeName = 'app';
  }

  get(key: string) {
    return this.ngf.getItem(key);
  }

  set(key: string, value: any) {
    return this.ngf.setItem(key, value);
  }

  remove(key: string) {
    return this.ngf.removeItem(key);
  }

  DELETE_ALL() {
    return this.ngf.clear();
  }

  listKeys() {
    return this.ngf.keys();
  }

}