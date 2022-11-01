import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationData } from '../../../models/notification.model';

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.css']
})
export class NotificationModalComponent implements OnInit {

  notification: NotificationData;

  constructor(@Inject(MAT_DIALOG_DATA)public data:any,private dialogRef: MatDialogRef<NotificationModalComponent>) { 

  }

  ngOnInit() {
    this.notification = JSON.parse(this.data);

  }
  
  onCloseModal(){

  }
}