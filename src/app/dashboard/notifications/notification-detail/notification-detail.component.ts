import { Component, OnInit } from '@angular/core';
import { NotificationData } from '../../../models/notification.model';
import { NotificationsService } from '../../../services/notification.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { DownloadService } from '../../../services/download-file.service';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoadingService } from '../../../../app/services/loading.service';

@Component({
  selector: 'app-notification-detail',
  templateUrl: './notification-detail.component.html',
  styleUrls: ['./notification-detail.component.css']
})
export class NotificationDetailComponent implements OnInit {

  notification:NotificationData;

  isMobileView: boolean;
  isDesktopView: boolean;
  
  //screen layout changes
  destroyed = new Subject<void>();
  
  // Create a map to display breakpoint names for layout changes.
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);

  constructor(private notificationService: NotificationsService,
    private snackbar:MatSnackBar,
    private translate: TranslateService,
    private downloadService: DownloadService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private loadingService: LoadingService,
  ) { 
    this.isMobileView = false;
    this.isDesktopView = false;
  }

  ngOnInit() {
    this.notification = this.notificationService.notification;

    //mark notification as read for non-read notifications
    if(this.notification.isRead == 0){
      this.markAsRead(this.notification.notificationId);
    }

    //-------------------screen changes-----------------
    this.breakpointObserver
    .observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ])
    .pipe(takeUntil(this.destroyed))
    .subscribe(result => {
      for (const query of Object.keys(result.breakpoints)) {
        if (result.breakpoints[query]) {


        if(this.displayNameMap.get(query) == 'XSmall'){

          this.isMobileView = true;
          this.isDesktopView = false;
    
        } else if(this.displayNameMap.get(query) == 'Small'){
    
          this.isMobileView = true;
          this.isDesktopView = false;
    
        } else if(this.displayNameMap.get(query) == 'Medium'){
    
          this.isMobileView = false;
          this.isDesktopView = true;
    
        } else if(this.displayNameMap.get(query) == 'Large'){
    
          this.isMobileView = false;
          this.isDesktopView = true;
          
        } else if(this.displayNameMap.get(query) == 'XLarge'){
    
          this.isMobileView = false;
          this.isDesktopView = true;
          
        }
    
        }
      }
    });

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

    this.loadingService.emitIsLoading(true);

    this.downloadService.getBase64DownloadFile(systemId, docid).subscribe({
      next:(resp:any)=>{
        
        if(resp.body.extension == "jpg" || resp.body.extension == "jpeg" || resp.body.extension == "pdf" ){
        
          if(this.isMobileView){
    
            this.router.navigate([
              'dashboard/overview/fileview', 
              { id: resp.body.docid , extension:resp.body.extension, url:resp.body.linkToDoc, docName:resp.body.name, sys:systemId}],
              { skipLocationChange: false });
    
          } else {
    
            this.router.navigate([
              'dashboard/overview/',
              { outlets: { 'desktop': ['fileview', { id: resp.body.docid , extension:resp.body.extension, url:resp.body.linkToDoc, docName:resp.body.name, sys:systemId}] } }
            ]);
    
          }
    
        }
        else if(resp.body.extension == "zip"){
    
          this.snackbar.open(
            this.translate.instant('document_item.document_download_request'), 
            this.translate.instant('snack_bar.action_button'),{
            duration:5000,
            panelClass:['snack'],
          });
          
          //download the file
          const link = document.createElement('a');
          link.setAttribute('target', '_blank');
          link.setAttribute('href', environment.baseUrl+resp.body.linkToDoc);
          link.setAttribute('download', resp.body.name+'.'+resp.body.extension);
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
      
      },
      error: (resp) => {
        //show file not found toast message
        if(resp.status == '404'){

          this.snackbar.open(
            this.translate.instant('notification-detail.file_not_found'),
            this.translate.instant('snack_bar.action_button'),{
            panelClass:['snack_error'],
            duration: 3500,
          });

        }
      }
    });

  }

  onContractOpen(assocId){

    if(this.isMobileView){

      this.router.navigate([
        'dashboard/overview/contract-detail', 
        { id: assocId }
      ]);

    } else {

      this.router.navigate([
        '/dashboard/overview/',
        { outlets: { 'desktop': ['contract-detail', { id: assocId }] } }
      ]);

    }
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

}