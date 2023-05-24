import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { Injectable } from '@angular/core';


@Pipe({
  name: 'formatDate'
})

export class FormatDatePipe implements PipeTransform {

  transform(date: string){

    if(date.includes('.')){
      
      if(date.includes(" ")){
        let formatedDate = date.split(" ");
        return formatedDate[0];
      }

      return date;
    } else {
      
      try{
        //format date 
        date = formatDate(date, "dd.MM.YYYY","en");
      } catch(error){
        //console.log("this ---> " + error.message);
        date = "";
      }
      return date;
    }
  }

}