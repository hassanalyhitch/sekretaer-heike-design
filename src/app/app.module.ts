import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
// import ngx-translate and the http loader
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './interceptors/auth-interceptor.service';
import { RouterModule, Routes } from '@angular/router';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { BottomNavComponent } from './bottom-nav/bottom-nav.component';
import { HomeComponent } from './dashboard/home/home.component';
import { FavItemComponent } from './dashboard/home/fav-item/fav-item.component';
import { BrokerComponent } from './dashboard/broker/broker.component';
import { ContractDetailComponent } from './dashboard/contract-detail/contract-detail.component';
import { DocumentItemComponent } from './dashboard/document-item/document-item.component';
import { ShortenTextPipe } from './pipes/shorten-text.pipe';
import { CurrencyFormatPipe } from './pipes/currency-format.pipe';
import { FileviewComponent } from './dashboard/contract-detail/fileview/fileview.component';
import { OverviewComponent } from './dashboard/overview/overview.component';
import { FolderCardComponent } from './dashboard/folder-card/folder-card.component';
import { FavouriteComponent } from './dashboard/favourite/favourite.component';
import { SettingsComponent } from './dashboard/settings/settings.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

const appRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'overview', component: OverviewComponent },
      { path: 'broker', component: BrokerComponent },
      { path: 'favourite', component: FavouriteComponent },
      { path: 'settings', component: SettingsComponent }
    ],
  },
  { path: 'dashboard/home/contract-detail', component:ContractDetailComponent },
  { path:'dashboard/home/contract-detail/fileview', component: FileviewComponent}
];
@NgModule({
  imports:      [ 
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatTooltipModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterModule.forRoot(appRoutes),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }) ],
  declarations: [ 
    AppComponent,
    LoginComponent,
    SnackbarComponent,
    DashboardComponent,
    HomeComponent,
    BottomNavComponent,
    FavItemComponent,
    BrokerComponent,
    ContractDetailComponent,
    DocumentItemComponent,
    ShortenTextPipe,
    CurrencyFormatPipe,
    FileviewComponent,
    OverviewComponent,
    FolderCardComponent,
    FavouriteComponent,
    SettingsComponent
   ],
  bootstrap:    [ AppComponent ],
  providers: [
    {provide: APP_BASE_HREF, useValue: '/'},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}
  ]
})
export class AppModule { }
