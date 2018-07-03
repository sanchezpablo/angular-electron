import {
  Component,
  OnInit
} from '@angular/core';
import {
  ElectronService
} from './providers/electron.service';
import {
  TranslateService
} from '@ngx-translate/core';
import {
  Title
} from '@angular/platform-browser';
import {
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import { APPLICATION_THEME_DARK, APPLICATION_BONANZA_ONLY } from './reducers/app.actions';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from './reducers/app.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // Sets initial value to true to show loading spinner on first load
  loading = true;

  appSettings: any;

  ngOnInit(): void { }
  constructor(private afAuth: AngularFireAuth,
    private router: Router,
    private appState: NgRedux<IAppState>,
    private electronService: ElectronService,
    private translate: TranslateService,
    private titleService: Title) {
      const authObserver = this.afAuth.authState.subscribe( user => {
        if (user) {
          authObserver.unsubscribe();
        } else {
          authObserver.unsubscribe();
        }
      });

    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });

    translate.setDefaultLang('en');
    translate.use('en');

    if (electronService.isElectron()) {
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }

    translate.get('APPLICATION_TITLE').subscribe((res: string) => {
      this.titleService.setTitle(res);
    });

    this.appSettings = this.electronService.getAppSettings();
    this.setGeneralSettings();
  }

  setGeneralSettings() {
    this.setTheme();
    this.setBonanzaOnly();
  }

  setTheme() {
    if (this.appSettings !== undefined) {
      const darkTheme = this.appSettings.get(`applicationThemeDark`);
      if (darkTheme === '1') {
        this.appState.dispatch({ type: APPLICATION_THEME_DARK, payload: { selected: true } });
        document.getElementById('themeTag').classList.add('dark-theme');
      } else {
        this.appState.dispatch({ type: APPLICATION_THEME_DARK, payload: { selected: false } });
        document.getElementById('themeTag').classList.remove('dark-theme');
      }
    }
  }

  setBonanzaOnly() {
    if (this.appSettings !== undefined) {
      const appBonanzaOnly = this.appSettings.get(`applicationBonanzaOnly`);
      this.appState.dispatch({ type: APPLICATION_BONANZA_ONLY, payload: { selected: appBonanzaOnly === '1' } });
    }
  }

  // Shows and hides the loading spinner during RouterEvent changes
  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.loading = true;
    }
    if (event instanceof NavigationEnd) {
      this.loading = false;
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.loading = false;
    }
    if (event instanceof NavigationError) {
      this.loading = false;
    }
  }
}
