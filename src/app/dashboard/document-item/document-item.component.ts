import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { DownloadService } from '../../services/download-file.service';
import { DocumentData } from '../../models/document.model';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-document-item',
  templateUrl: './document-item.component.html',
  styleUrls: ['./document-item.component.css']
})

export class DocumentItemComponent implements OnInit {

  @Input() doc: DocumentData;

  @Input() from_location: string;

  broker_icon_link: string;
  selected_theme:   string;

  sharedWithBroker: boolean;
  enableSharedWithBrokerIcon: boolean;

  isDocument: boolean;
  isPDF: boolean;
  isJPEG: boolean;

  //screen layout changes
  destroyed = new Subject<void>();
  currentScreenSize: string;

  isMobileView: boolean;
  isDesktopView: boolean;

  // Create a map to display breakpoint names for layout changes.
  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);

  constructor(
    private snackbar: MatSnackBar,
    private translate: TranslateService,
    private downloadService: DownloadService,
    private router: Router,
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver
  ) { 

    this.broker_icon_link = "../assets/icon_broker_simple_default.svg"; // default broker icon
    this.selected_theme   = "";

    this.sharedWithBroker = false;
    this.enableSharedWithBrokerIcon = false;

    this.isDocument = false;
    this.isPDF = false;
    this.isJPEG = false;

    this.isMobileView = false;
    this.isDesktopView = false; 
  }

  ngOnInit() {

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

        this.currentScreenSize = this.displayNameMap.get(query) ?? 'Unknown';

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

    if(this.from_location == "contract_details"){
      this.enableSharedWithBrokerIcon = true;
    } else if(this.from_location == "folder"){
      this.enableSharedWithBrokerIcon = false;
    }

    //check file extension
    if(this.doc.extension == "pdf"){
      this.isPDF = true;
    } else if(this.doc.extension == "docx"){
      this.isDocument = true;
    } else if(this.doc.extension == "jpg"){
      this.isJPEG = true;
    } else {
      this.isDocument = true;
    }

    this.selected_theme = localStorage.getItem('theme_selected');

    if(this.doc.sharedWithBroker == 1 && !this.selected_theme){

      this.broker_icon_link = "../assets/icon_broker_simple_pink.svg";

    } else if(this.doc.sharedWithBroker == 1 && this.selected_theme == 'default'){

      this.broker_icon_link = "../assets/icon_broker_simple_pink.svg";

    } else if(this.doc.sharedWithBroker == 1 && this.selected_theme == 'blue'){

      this.broker_icon_link = "../assets/icon_broker_simple_blue.svg";

    } else {

      // default broker icon
      this.broker_icon_link = "../assets/icon_broker_simple_default.svg"; 
    }
    
  }

  onDocumentClick(doc: DocumentData){

    if(doc.extension == "jpg" || doc.extension == "jpeg" || doc.extension == "pdf" ){

      
      if(this.router.url.includes('home')){

        if(this.isMobileView){

          this.router.navigate([
            'dashboard/home/fileview', 
            { id: doc.docid , extension:doc.extension, url:doc.linkToDoc, docName:doc.name, sys:doc.systemId}],
            { skipLocationChange: false });

        } else {

          this.router.navigate([
            'dashboard/home/',
            { outlets: { 'desktop': ['fileview', { id: doc.docid , extension:doc.extension, url:doc.linkToDoc, docName:doc.name, sys:doc.systemId}] } }
          ]);

        }

      } else if(this.router.url.includes('overview')){

        if(this.isMobileView){

          this.router.navigate([
            'dashboard/overview/fileview', 
            { id: doc.docid , extension:doc.extension, url:doc.linkToDoc, docName:doc.name, sys:doc.systemId}],
            { skipLocationChange: false });

        } else {

          this.router.navigate([
            'dashboard/overview/',
            { outlets: { 'desktop': ['fileview', { id: doc.docid , extension:doc.extension, url:doc.linkToDoc, docName:doc.name, sys:doc.systemId}] } }
          ]);

        }

      } else if(this.router.url.includes('favourite')){

        this.router.navigate([
          'dashboard/favourite/fileview', 
          { id: doc.docid , extension:doc.extension, url:doc.linkToDoc, docName:doc.name, sys:doc.systemId}],
          { skipLocationChange: false });
      } 
        
    }
    else if(doc.extension == "zip"){
      this.snackbar.open(
        this.translate.instant('document_item.document_download_request'), 
        this.translate.instant('snack_bar.action_button'),{
        duration:5000,
        panelClass:['snack'],
      });
      
      this.downloadService.getBase64DownloadFile(doc.systemId, doc.docid).subscribe({
        next:(resp:any)=>{
          const link = document.createElement('a');
          link.setAttribute('target', '_blank');
  
          link.setAttribute('href', environment.baseUrl+resp.body.linkToDoc);
  
          link.setAttribute('download', resp.body.name+'.'+resp.body.extension);
          
          document.body.appendChild(link);
          link.click();
          link.remove();
          
        },
        error: (resp) => {
          
          this.snackbar.open(
            this.translate.instant('document_item.document_download_failed'),
            this.translate.instant('snack_bar.action_button'),{
            panelClass:['snack_error'],
            duration:1500,
          })
        }
      });
    }
  
   
  }

  onShareWithBroker(){
    this.sharedWithBroker =!this.sharedWithBroker;

    this.selected_theme = localStorage.getItem('theme_selected');

    if(this.sharedWithBroker && !this.selected_theme){

      this.broker_icon_link = "../assets/icon_broker_simple_pink.svg";

      // display snackbar message
      this.snackbar.open(
        this.translate.instant('document_item.shared_with_broker'),
        this.translate.instant('snack_bar.action_button'),{
          duration: 8000,
          panelClass:['snack_success'],
        }
      );

    } else if(this.sharedWithBroker && this.selected_theme == 'default'){

      this.broker_icon_link = "../assets/icon_broker_simple_pink.svg";

      // display snackbar message
      this.snackbar.open(
        this.translate.instant('document_item.shared_with_broker'),
        this.translate.instant('snack_bar.action_button'),{
          duration: 8000,
          panelClass:['snack_success'],
        }
      );

    } else if(this.sharedWithBroker && this.selected_theme == 'blue'){

      this.broker_icon_link = "../assets/icon_broker_simple_blue.svg";

      // display snackbar message
      this.snackbar.open(
        this.translate.instant('document_item.shared_with_broker'),
        this.translate.instant('snack_bar.action_button'),{
          duration: 8000,
          panelClass:['snack_success'],
        }
      );

    } else {

      // default broker icon
      this.broker_icon_link = "../assets/icon_broker_simple_default.svg";
      
      // display snackbar message
      this.snackbar.open(
        this.translate.instant('document_item.unshared_with_broker'),
        this.translate.instant('snack_bar.action_button'),{
          duration: 8000,
          panelClass:['snack_error'],
        }
      );
      
    }
    
  }

  ngOnDestroy(){
    this.destroyed.next();
    this.destroyed.complete();
  }

}