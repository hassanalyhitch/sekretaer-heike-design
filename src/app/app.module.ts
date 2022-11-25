import { Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input'

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
import { FavItemComponent } from './dashboard/fav-item/fav-item.component';
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
import { NotificationsComponent } from './dashboard/notifications/notifications.component';
import { NotificationItemComponent } from './dashboard/notifications/notification-item/notification-item.component';
import { AddPageComponent } from './dashboard/home/add-page/add-page.component';
import { UploadFileComponent } from './dashboard/home/add-page/upload-file/upload-file.component';
import { ChatComponent } from './dashboard/chat/chat.component';
import { FolderDetailComponent } from './dashboard/folder-detail/folder-detail.component';
import { RenameModalComponent } from './dashboard/rename-modal/rename-modal.component';
import { NewFolderComponent } from './dashboard/new-folder/new-folder.component';
import { RenameContractComponent } from './dashboard/rename-contract/rename-contract.component';
import { FileSizePipe } from './pipes/filesize.pipe';
import { RenameFolderComponent } from './dashboard/rename-folder/rename-folder.component';
import { NewContractComponent } from './dashboard/overview/new-contract/new-contract.component';
import { NotificationModalComponent } from './dashboard/notifications/notification-modal/notification-modal.component';
import { SubFolderCardComponent } from './dashboard/sub-folder-card/sub-folder-card.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { HomeFabIconsComponent } from './dashboard/home-fab-icons/home-fab-icons.component';
import { SearchPageComponent } from './dashboard/search-page/search-page.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';

// particular imports for hammer
import * as Hammer from 'hammerjs';
import {HammerModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NotificationDetailComponent } from './dashboard/notifications/notification-detail/notification-detail.component';


// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any> {
    swipe: { direction: Hammer.DIRECTION_ALL },
  };
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
  { path: 'dashboard/overview/contract-detail', component:ContractDetailComponent },
  { path: 'dashboard/overview/folder-detail', component:FolderDetailComponent },
  { path: 'dashboard/home/notifications', component:NotificationsComponent },
  { path: 'dashboard/favourite/contract-detail', component:ContractDetailComponent },
  { path: 'dashboard/home/contract-detail/fileview', component: FileviewComponent},
  { path: 'dashboard/home/adddocument', component:AddPageComponent},
  { path: 'dashboard/home/chat', component:ChatComponent},  
  { path: 'dashboard/home/search', component:SearchPageComponent},  
  { path: 'dashboard/overview/new-contract',component:NewContractComponent},
  { path: 'privacy-policy',component:PrivacyPolicyComponent},
  { path: 'terms-and-conditions', component:TermsConditionsComponent},
  { path: 'forgot-password', component:ForgotPasswordComponent},


];
@NgModule({
  imports:      [
    ReactiveFormsModule, 
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTooltipModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    HammerModule,
    NgMultiSelectDropDownModule.forRoot(),
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
    SettingsComponent,
    NotificationsComponent,
    NotificationItemComponent,
    AddPageComponent,
    UploadFileComponent,
    ChatComponent,
    FolderDetailComponent,
    RenameModalComponent,
    NewFolderComponent,
    RenameContractComponent,
    FileSizePipe,
    RenameFolderComponent,
    NewContractComponent,
    NotificationModalComponent,
    SubFolderCardComponent,
    PrivacyPolicyComponent,
    HomeFabIconsComponent,
    SearchPageComponent,
    TermsConditionsComponent,
    ForgotPasswordComponent,
    NotificationDetailComponent
   ],
  bootstrap:    [ AppComponent ],
  providers: [
    {provide: APP_BASE_HREF, useValue: '/'},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true},
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig,
    }
  ]
})
export class AppModule { }
