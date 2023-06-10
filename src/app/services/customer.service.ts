import { CustomerData } from './../models/customer.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs';
import { LoginService } from './login.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })

export class CustomerService {

    customerData:CustomerData;

    constructor (private http:HttpClient, private loginService:LoginService){
      this.getCustomerData().subscribe({
        next:(resp)=>{
          
          if(Array.isArray(resp)){
            let customerData:CustomerData = {
                Amsidnr: resp[0].Amsidnr,
                Street: resp[0].Street,
                ModifyDate: resp[0].ModifyDate,
                Lastname: resp[0].Lastname,
                AgentNumber: resp[0].AgentNumber,
                Bank1: resp[0].Bank1,
                Bank2: resp[0].Bank2,
                Bic1: resp[0].Bic1,
                Bic2: resp[0].Bic2,
                Email: resp[0].Email,
                Birthdate: resp[0].Birthdate,
                Gender: resp[0].Gender,
                Iban1: resp[0].Iban1,
                Iban2: resp[0].Iban2,
                DisplayName: resp[0].DisplayName,
                City: resp[0].City,
                ZipCode: resp[0].ZipCode,
                Telefon1: resp[0].Telefon1,
                Telefon2: resp[0].Telefon2,
                Email1: resp[0].Email1,
                Email2: resp[0].Email2,
                ShowName: resp[0].ShowName,
                Firstname: resp[0].Firstname,
            }
            this.customerData = customerData;
        }

        }
      })
    }

    getCustomerData(){
        
        let url = environment.baseUrl + '/api/v1/customers';
        
        return this.http.get(url,{
           headers:new HttpHeaders({
            'accept': 'application/json',
            'Content-Type': 'application/json',
           }),
        }).pipe(
            tap({
                next:(resp)=>{
                    if(Array.isArray(resp)){
                        let customerData:CustomerData = {
                            Amsidnr: resp[0].Amsidnr,
                            Street: resp[0].Street,
                            ModifyDate: resp[0].ModifyDate,
                            Lastname: resp[0].Lastname,
                            AgentNumber: resp[0].AgentNumber,
                            Bank1: resp[0].Bank1,
                            Bank2: resp[0].Bank2,
                            Bic1: resp[0].Bic1,
                            Bic2: resp[0].Bic2,
                            Email: resp[0].Email,
                            Birthdate: resp[0].Birthdate,
                            Gender: resp[0].Gender,
                            Iban1: resp[0].Iban1,
                            Iban2: resp[0].Iban2,
                            DisplayName: resp[0].DisplayName,
                            City: resp[0].City,
                            ZipCode: resp[0].ZipCode,
                            Telefon1: resp[0].Telefon1,
                            Telefon2: resp[0].Telefon2,
                            Email1: resp[0].Email1,
                            Email2: resp[0].Email2,
                            ShowName: resp[0].ShowName,
                            Firstname: resp[0].Firstname,
                        }
                        this.customerData = customerData;
                    }
                },
                error:(error: any)=>{

                  if(error instanceof HttpErrorResponse){
                    //Invalid Token or Unauthorised request
                    if(error.status == 401){
                      this.loginService.resetAuthToken();
                    }
                  }
                  
                }
              })
        )

    }
}
