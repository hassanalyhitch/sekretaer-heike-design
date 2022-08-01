import { Pipe, PipeTransform } from '@angular/core';
import { Injectable } from '@angular/core';

@Pipe({
  name: 'shortenText'
})
export class ShortenTextPipe implements PipeTransform {

  transform(longName: string){
    let shortName:string;
        if(longName.length > 27){
          shortName = longName.substring(0, 28)+"...";
        } else {
          shortName = longName;
        }
    return shortName;
  }

}