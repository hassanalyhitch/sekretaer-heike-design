import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs';
@Injectable({ providedIn: 'root' })

export class CompanyService {
    constructor (private http:HttpClient){
    }
    getCompany(Branch2MasterId){
        
        let url = 'https://testapi.maxpool.de/api/v1/masterbranches/'+ Branch2MasterId +'/companies';
        
        return this.http.get(url,{
           headers:new HttpHeaders({
            'accept': 'application/json',
            'Content-Type': 'application/json',
           }),
        }).pipe(
            tap((resp) =>{
                console.log(resp);
            })
        )

    }
}
