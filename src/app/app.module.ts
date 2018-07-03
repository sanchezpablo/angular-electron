import { NgRedux, NgReduxModule } from '@angular-redux/store';
import { IAppState, rootReducer, INITIAL_STATE } from './reducers/app.store';
import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ElectronService } from './providers/electron.service';
import { WebviewDirective } from './directives/webview.directive';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/pages/home/home.component';
import { HttpModule } from '@angular/http';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidenavComponent } from './components/layout/sidenav/sidenav.component';
import { SidepanelService } from './providers/sidepanel.service';
import { MainToolbarComponent } from './components/layout/maintoolbar/maintoolbar.component';
import { SettingsComponent } from './components/pages/settings/settings.component';
import { SigninComponent } from './components/pages/signin/signin.component';
import { FileDropModule } from 'ngx-file-drop';
import { LoaderService } from './components/shared/loader/loader.service';
import { LoaderComponent } from './components/shared/loader/loader.component';
import { NgProgressModule, NgProgress } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { FooterComponent } from './components/layout/footer/footer.component';
import { AngularFireModule } from 'angularfire2';
import { AuthGuardService } from './providers/auth-guard.service';
import { AuthenticationService } from './providers/authentication.service';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import 'hammerjs';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireAuth } from 'angularfire2/auth';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const firebaseCredentials = {
    apiKey: 'AIzaSyDq_yVQ1HPfA-yVeYGVF74Lz6bWMk-nCV4',
    authDomain: 'digital-accounting.firebaseapp.com',
    databaseURL: 'https://digital-accounting.firebaseio.com',
    projectId: 'digital-accounting',
    storageBucket: 'digital-accounting.appspot.com',
    messagingSenderId: '964491615888'
};

export function tokenGetter() {
  let token = '';
  try {
   token = localStorage.getItem('fb_token');
   return token;
  } catch (e) {
    return token;
  }
}

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    HomeComponent,
    SettingsComponent,
    SidenavComponent,
    LoaderComponent,
    FooterComponent,
    MainToolbarComponent,
    WebviewDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseCredentials),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    FileDropModule,
    HttpModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:4200'],
        blacklistedRoutes: ['localhost:4200/auth/']
      }
    }),
    NgProgressModule.forRoot({
      color: '#fafafa',
      min: 20,
      meteor: false,
      spinner: false
    }),
    NgProgressHttpModule,
    MaterialModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
    NgReduxModule,
    ReactiveFormsModule
  ],
  providers: [
    AngularFireAuth,
    NgProgress,
    JwtHelperService,
    AuthGuardService,
    AuthenticationService,
    ElectronService,
    LoaderService,
    SidepanelService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor (ngRedux: NgRedux<IAppState>) {
    ngRedux.configureStore(rootReducer, INITIAL_STATE);
  }
}
