import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
export class FileviewComponent implements OnInit, AfterViewInit {

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
 imgWidth:string = '';
 img:any;
 setInitImgWidth:boolean = false;

 //screen layout changes
 destroyed = new Subject<void>();
 currentScreenSize: string;

 isMobileView: boolean;
 isDesktopView: boolean;

 fileNotFound: boolean = false;

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
        this.downloadService.getDownloadFile(this.systemId,this.docId).subscribe({
          error:(err)=>{
            console.log(err);
            if(err.status == 404){
              this.fileNotFound = true;
              this.previewLoaded = true;
            }
          }
        });
      },
      error:(err:any)=>{
        console.log(err);
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
    if(this.imgWidth != '' && this.imgWidth != undefined){
      if(!this.setInitImgWidth){
        this.imgWidth = this.img.getBoundingClientRect().width;
        this.setInitImgWidth = true;
      }
        let newWidth = parseInt(this.imgWidth) * this.zoomLevel;
        this.img.style.width = `${newWidth}px`;
        // console.log(newWidth, this.zoomLevel);
    }
    
  }
  
  ngAfterViewInit(){
    if(this.zoomContainer){
      const container = this.zoomContainer.nativeElement;
      let containerWidth = parseInt(container.clientWidth);
      this.img = container.querySelector('img');
      
      this.img.addEventListener('load', ()=>{
        let naturalImgWidth = parseInt(this.img.clientWidth);
        if(naturalImgWidth > containerWidth){
          this.img.style.width = "100%";
        }
        this.imgWidth = this.img.getBoundingClientRect().width;
        // console.log(this.imgWidth);
      });

    }
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

}
