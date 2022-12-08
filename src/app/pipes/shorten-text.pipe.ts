import { Pipe, PipeTransform } from '@angular/core';
import { Injectable } from '@angular/core';

@Pipe({
  name: 'shortenText'
})
export class ShortenTextPipe implements PipeTransform {

  transform(longName: string, length: number){
    
    let shortName:string;
    try{

      if(longName.length > length){
        shortName = longName.substring(0, length+1)+"...";
      } else {
        shortName = longName;
      }

    } catch(e){
      // console.log(e.message);
    }
    return shortName;
  }

}