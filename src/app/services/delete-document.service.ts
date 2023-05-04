import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { LoginService } from './login.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })

export class DeleteDocumentService {

  constructor(private http: HttpClient, private loginService: LoginService) {}

  deleteDocument(doc_systemId: string, doc_id: string) {

    //console.log(" From Delete Doc Service: Doc SystemID ->"+doc_systemId+" Doc Id: "+doc_id);

    let url = environment.baseUrl + '/api/v1/dms/'+doc_systemId+'/'+doc_id+'/remove/name';

    return this.http.delete(url,{
      headers: new HttpHeaders({
        'accept': 'application/json',
        'Content-Type': 'application/json',
      }),
    }).pipe(
      tap({
        next:()=>{

        },
        error:(error: any)=>{

          if(error instanceof HttpErrorResponse){
            //Invalid Token or Unauthorised request
            if(error.status == 401){
              this.loginService.emitAuthenticated(false);
            }
          }

        }
      })
    );
  }
}
