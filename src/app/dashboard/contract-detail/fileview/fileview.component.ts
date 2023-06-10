import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { PDFProgressData } from 'ng2-pdf-viewer';
import { environment } from '../../../../environments/environment';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { DownloadService } from '../../../services/download-file.service';

@Component({
  selector: 'app-fileview',
  templateUrl: './fileview.component.html',
  styleUrls: ['./fileview.component.scss']
})
export class FileviewComponent implements OnInit {

 safeUrl: SafeResourceUrl ;
 linkToDoc:string;
 previewLoaded:boolean = false;
 fileurl:string = '';
 extension:string = '';
 systemId:string = '';
 docId:string = '';
 fileName:string = '';
 zoom: number = 1;

 zoomLevel = 1;
 @ViewChild('zoomContainer') zoomContainer: ElementRef;


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
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private sanitizer:DomSanitizer,
    private _location:Location,
    private snackbar:MatSnackBar,
    private translate:TranslateService,
    private downloadService:DownloadService) {

    this.docId = this.route.snapshot.paramMap.get('id');
    this.systemId = this.route.snapshot.paramMap.get('sys');
    this.extension = this.route.snapshot.paramMap.get('extension');
    this.linkToDoc = this.route.snapshot.paramMap.get('url'); 
    this.fileName = this.route.snapshot.paramMap.get ('docName');

    this.isMobileView = false;
    this.isDesktopView = false;
   }

  ngOnInit() {

    this.downloadService.getBase64DownloadFile(this.systemId,this.docId).subscribe({
      next:(resp: any) =>{
        this.fileurl = environment.baseUrl+resp.body.linkToDoc;
      }
    });

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

  }

  onBackNavClick(){
    this._location.back();
  }

  onProgress(progressData: PDFProgressData){
    if(progressData.loaded == progressData.total){

      this.previewLoaded = true;
    }
  }

  onFileLoaded($event){
    this.previewLoaded = true;
  }

  onDocumentDownload(){
    this.snackbar.open(
      this.translate.instant('document_item.document_download_request'), 
      this.translate.instant('snack_bar.action_button'),{
      duration:5000,
      panelClass:['snack'],
    });

    this.downloadService.getBase64DownloadFile(this.systemId, this.docId).subscribe({
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

  plusZoom() {
    this.zoom++;
  }

  minusZoom() {
    if(this.zoom > 1 ) {
    this.zoom--;
    }
  }

  zoomIn(): void {
    this.zoomLevel += 0.1; 
    this.updateTransform();
  }

  zoomOut(): void {

    if (this.zoomLevel > 1){
      this.zoomLevel -= 0.1;
    } 
    this.updateTransform();
  }

  updateTransform(): void {
    const container = this.zoomContainer.nativeElement;
    const img = container.querySelector('img');
    img.style.transform = `scale(${this.zoomLevel})`;
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

}
