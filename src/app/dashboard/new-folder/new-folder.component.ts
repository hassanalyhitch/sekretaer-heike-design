import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-folder',
  templateUrl: './new-folder.component.html',
  styleUrls: ['./new-folder.component.css']
})
export class NewFolderComponent implements OnInit {

 
  newFolderName: string= "";

  constructor(@Inject(MAT_DIALOG_DATA)public data:any) { 
    
  }

  ngOnInit() {
  }
  
  onSubmit(formData: any) {
  
  }
}