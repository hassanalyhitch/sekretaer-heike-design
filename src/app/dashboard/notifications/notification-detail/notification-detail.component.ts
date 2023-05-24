import { Component, OnInit } from '@angular/core';
import { NotificationData } from '../../../models/notification.model';
import { NotificationsService } from '../../../services/notification.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { DownloadService } from '../../../services/download-file.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-detail',
  templateUrl: './notification-detail.component.html',
  styleUrls: ['./notification-detail.component.css']
})
export class NotificationDetailComponent implements OnInit {

  notification:NotificationData;

  constructor(private notificationService: NotificationsService,
    private snackbar:MatSnackBar,
    private translate: TranslateService,
    private downloadService: DownloadService,
    private router: Router
  ) { }

  ngOnInit() {
    this.notification = this.notificationService.notification;

    // console.log(this.notification);
    this.markAsRead(this.notification.notificationId);

  }

  markAsRead(notificationId){
    this.notificationService.markAsRead(notificationId).subscribe({
      next:()=>{

      },
      error:()=>{

      },
      complete:()=>{

      }
    });
  }

  onDocumentClick(systemId,docid){

    //console.log('tap !');

    this.snackbar.open(
      this.translate.instant('notification-detail.document_download_request'), 
      this.translate.instant('snack_bar.action_button'),{
      duration:5000,
      panelClass:['snack'],
    });
    

    this.downloadService.getBase64DownloadFile(systemId, docid).subscribe({
      next:(resp:any)=>{
        const link = document.createElement('a');
        link.setAttribute('target', '_blank');

        link.setAttribute('href', resp.url.split("/api")[0]+resp.body.linkToDoc);

        link.setAttribute('download', resp.body.name+'.'+resp.body.extension);
        
        document.body.appendChild(link);
        link.click();
        link.remove();
        
      },
      error: (resp) => {
        //console.log(resp);
        this.snackbar.open(
          this.translate.instant('notification-detail.document_download_failed'),
          this.translate.instant('snack_bar.action_button'),{
          panelClass:['snack_error'],
          duration:1500,
        })
      }
    });
  }

  onContractOpen(assocId){
    this.router.navigate([
      "dashboard/home/contract-detail",
      { id: assocId },
    ]);
  }

}