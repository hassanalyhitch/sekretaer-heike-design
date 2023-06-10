import { FormatDatePipe } from './pipes/format-date.pipe';
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
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatSelectModule} from '@angular/material/select';
import { MatInputModule} from '@angular/material/input';
import { MatDatepickerModule }from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule} from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MomentDateModule } from '@angular/material-moment-adapter';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { TranslateHttpLoader} from '@ngx-translate/http-loader';
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
import { HammerModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NotificationDetailComponent } from './dashboard/notifications/notification-detail/notification-detail.component';
import { ForgotPasswordEmailSentComponent } from './forgot-password-email-sent/forgot-password-email-sent.component';
import { LoadingComponent } from './loading/loading.component';
import { BackButtonDirective } from './directives/backbutton.directive';
import { MatSnackBarModule} from '@angular/material/snack-bar';
import { MyDataComponent } from './dashboard/settings/my-data/my-data.component';
import { ChangePasswordComponent } from './dashboard/settings/change-password/change-password.component';
import { AddPageModalComponent } from './dashboard/add-page-modal/add-page-modal.component';
import { ChangeLanguageComponent } from './change-language/change-language.component';
import { ChangeThemeComponent } from './change-theme/change-theme.component';
import { NewPasswordComponent } from './dashboard/settings/change-password/new-password/new-password.component';
import { ResetSuccessfulComponent } from './dashboard/settings/change-password/reset-successful/reset-successful.component';
import { ChangePushNotificationsComponent } from './change-push-notifications/change-push-notifications.component';
import { EditSmallPictureComponent } from './dashboard/edit-small-picture/edit-small-picture.component';
import { AuthGuardGuard } from './auth-guard.guard';
import { LoggedInGuard } from './logged-in.guard';
import { ContractCategoryComponent } from './dashboard/overview/contract-category/contract-category.component';
import { FileviewComponent } from './dashboard/contract-detail/fileview/fileview.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DesktopNavComponent } from './desktop-nav/desktop-nav.component';
import { DesktopFabsComponent } from './desktop-fabs/desktop-fabs.component';
import { HomeServicesComponent } from './home-services/home-services.component';
import { DesktopOverviewHomeComponent } from './desktop-overview-home/desktop-overview-home.component';


// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any> {
    swipe: { direction: Hammer.DIRECTION_HORIZONTAL },
  };
}

const appRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    canActivate: [AuthGuardGuard],
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      
      { 
        path: 'home',
        canActivate: [AuthGuardGuard],
        canActivateChild: [AuthGuardGuard],
        component: HomeComponent,
        children: [
          { 
            path: '', 
            outlet: 'desktop', 
            component: HomeServicesComponent 
          },
          { 
            path: 'contract-detail', 
            outlet: 'desktop', 
            component:ContractDetailComponent 
          },
          { 
            path: 'folder-detail', 
            outlet: 'desktop', 
            component: FolderDetailComponent 
          },
          { 
            path: 'fileview',
            outlet: 'desktop',
            component: FileviewComponent
          }
          
        ] 
      },

      { 
        path: 'overview',
        canActivate: [AuthGuardGuard],
        canActivateChild: [AuthGuardGuard], 
        component: OverviewComponent,
        children: [
          {
            path: '',
            outlet: 'desktop',
            component: DesktopOverviewHomeComponent
          },
          { 
            path: 'contract-detail', 
            outlet: 'desktop', 
            component: ContractDetailComponent,
          },
          { 
            path: 'folder-detail', 
            outlet: 'desktop', 
            component: FolderDetailComponent 
          },
          { 
            path: 'fileview',
            outlet: 'desktop',
            component: FileviewComponent
          }
        ] 
      },

      { path: 'broker',canActivate: [AuthGuardGuard], component: BrokerComponent },
      { path: 'settings',canActivate: [AuthGuardGuard], component: SettingsComponent },

      { path: 'overview/contract-detail',canActivate: [AuthGuardGuard], component:ContractDetailComponent },
      { path: 'overview/fileview',canActivate: [AuthGuardGuard], component:FileviewComponent},
      { path: 'overview/folder-detail',canActivate: [AuthGuardGuard], component:FolderDetailComponent },
      
      { path: 'home/notifications',canActivate: [AuthGuardGuard], component:NotificationsComponent },
      { path: 'home/notifications/notification-detail',canActivate: [AuthGuardGuard], component:NotificationDetailComponent },
      { path: 'home/adddocument',canActivate: [AuthGuardGuard], component:AddPageComponent },
      { path: 'home/chat',canActivate: [AuthGuardGuard], component:ChatComponent },  
      //{ path: 'home/search',canActivate: [AuthGuardGuard], component:SearchPageComponent },
      { path: 'search',canActivate: [AuthGuardGuard], component:SearchPageComponent },
      { path: 'home/contract-detail',canActivate: [AuthGuardGuard], component:ContractDetailComponent },
      { path: 'home/contract-detail/fileview',canActivate: [AuthGuardGuard], component:FileviewComponent},
      { path: 'home/fileview',canActivate: [AuthGuardGuard], component:FileviewComponent},
      { path: 'home/folder-detail',canActivate: [AuthGuardGuard], component:FolderDetailComponent },
      
      { path: 'favourite',canActivate: [AuthGuardGuard], component: FavouriteComponent },
      { path: 'favourite/contract-detail',canActivate: [AuthGuardGuard], component:ContractDetailComponent },
      { path: 'favourite/folder-detail',canActivate: [AuthGuardGuard], component:FolderDetailComponent },
      { path: 'favourite/fileview',canActivate: [AuthGuardGuard], component:FileviewComponent},
        
      { path: 'overview/new-contract',canActivate: [AuthGuardGuard],component:NewContractComponent },
      { path: 'settings/my-data',canActivate: [AuthGuardGuard],component:MyDataComponent },
      { path: 'settings/change-password',canActivate: [AuthGuardGuard], canDeactivate: [AuthGuardGuard], component:ChangePasswordComponent},
      { path: 'settings/new-password', canActivate: [AuthGuardGuard], canDeactivate: [AuthGuardGuard], component:NewPasswordComponent},
      { path: 'settings/password-reset-successful',canActivate: [AuthGuardGuard],component:ResetSuccessfulComponent},
      { path: 'settings/privacy-policy',canActivate: [AuthGuardGuard], component:PrivacyPolicyComponent },
      { path: 'settings/terms-and-conditions',canActivate: [AuthGuardGuard], component:TermsConditionsComponent },
      { path: 'settings/change-theme',canActivate: [AuthGuardGuard], component:ChangeThemeComponent },
      { path: 'settings/change-language',canActivate: [AuthGuardGuard], component:ChangeLanguageComponent },
      { path: 'settings/change-push-notifications',canActivate: [AuthGuardGuard], component:ChangePushNotificationsComponent },
    ],
  },
  { path: 'login', component:LoginComponent, canActivate: [LoggedInGuard]},
  { path: 'privacy-policy',component:PrivacyPolicyComponent },
  { path: 'terms-and-conditions', component:TermsConditionsComponent },
  { path: 'forgot-password', component:ForgotPasswordComponent },
  { path: 'forgot-password-email-sent', component:ForgotPasswordEmailSentComponent },
  { 
    path: 'new-password',component:NewPasswordComponent,
    pathMatch: 'prefix',
    children: [{
      path: '**', component: NewPasswordComponent
    }]
  },
  { path: '**', redirectTo: 'dashboard' }

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
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    MomentDateModule,
    MatChipsModule,
    HammerModule,
    PdfViewerModule,
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
    NotificationDetailComponent,
    ForgotPasswordEmailSentComponent,
    LoadingComponent,
    BackButtonDirective,
    FormatDatePipe,
    MyDataComponent,
    ChangePasswordComponent,
    AddPageModalComponent,
    ChangeLanguageComponent,
    ChangeThemeComponent,
    NewPasswordComponent,
    ResetSuccessfulComponent,
    ChangePushNotificationsComponent,
    EditSmallPictureComponent,
    ContractCategoryComponent,
    FileviewComponent,
    DesktopNavComponent,
    DesktopFabsComponent,
    HomeServicesComponent,
    DesktopOverviewHomeComponent
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
