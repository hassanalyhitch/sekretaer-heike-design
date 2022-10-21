import {Pipe,PipeTransform} from '@angular/core';

@Pipe({
    name:'fileSize'
})
export class FileSizePipe implements PipeTransform {
    transform(size:number,extension:string) {
        const fileSize =size/1024;
        const fileMegaSize = fileSize/1024;
        if (fileSize<=1024){
            return(fileSize.toFixed(2)+'Kb');
        }else{
            return (fileMegaSize.toFixed(2) +'Mb');
        }
       
        
    }
        
}
