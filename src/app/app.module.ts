import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

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
      { path: 'broker', component: BrokerComponent }
    ],
  }
];
@NgModule({
  imports:      [ 
    BrowserModule,
    FormsModule,
    HttpClientModule,
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
    BrokerComponent
   ],
  bootstrap:    [ AppComponent ],
  providers: [
    {provide: APP_BASE_HREF, useValue: '/'},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}
  ]
})
export class AppModule { }
