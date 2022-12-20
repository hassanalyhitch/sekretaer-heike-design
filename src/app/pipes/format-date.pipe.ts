import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { Injectable } from '@angular/core';


@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  transform(date: string){
      try{
        //format date 
        date = formatDate(date, "dd.MM.YYYY","en");
      } catch(error){
        console.log("this ---> " + error.message);
        date = "Invalid Date";
      }
    return date;
  }

}