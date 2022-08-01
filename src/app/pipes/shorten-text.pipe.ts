import { Pipe, PipeTransform } from '@angular/core';
import { Injectable } from '@angular/core';

@Pipe({
  name: 'shortenText'
})
export class ShortenTextPipe implements PipeTransform {

  transform(longName: string){
    let shortName:string;
    try{

      if(longName.length > 17){
        shortName = longName.substring(0, 18)+"...";
      } else {
        shortName = longName;
      }

    } catch(e){
      console.log(e.message);
    }
    return shortName;
  }

}