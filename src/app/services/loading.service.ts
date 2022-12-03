import { Observable,Observer } from 'rxjs';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loadingObs:Observable<boolean>;
  observer:Observer<boolean>;
  isLoading:boolean = false;

  constructor() { 
    this.loadingObs = new Observable ((observer:Observer<boolean>)=>{
      this.observer = observer;
      this.observer.next(this.isLoading);
    });
  }
  emitIsLoading(loading:boolean){
    this.observer.next(loading);
  }
}
