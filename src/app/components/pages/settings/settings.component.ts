import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ElectronService } from '../../../providers/electron.service';
import { NgProgress } from '@ngx-progressbar/core';
import { IAppState } from '../../../reducers/app.store';
import { NgRedux } from '@angular-redux/store';
import { APPLICATION_THEME_DARK, APPLICATION_BONANZA_ONLY } from '../../../reducers/app.actions';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, AfterViewInit {
  isThemeDark: boolean;
  bonanzaOnly: boolean;
  helloWorldMessage: string;

  constructor(private appState: NgRedux<IAppState>,
    private electronService: ElectronService, private translate: TranslateService, private progress: NgProgress) {
      this.progress.start();
      this.isThemeDark = this.appState.getState().applicationThemeDark;
      this.bonanzaOnly = this.appState.getState().applicationBonanzaOnly;
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.progress.complete();
  }

  themeChanged() {
    if (!this.appState.getState().applicationThemeDark) {
      this.appState.dispatch({ type: APPLICATION_THEME_DARK, payload: { selected: true } });
      localStorage.setItem('application_theme_dark', '1');
      this.electronService.getAppSettings().set(`applicationThemeDark`, '1');
      document.getElementById('themeTag').classList.add('dark-theme');
    } else {
      this.appState.dispatch({ type: APPLICATION_THEME_DARK, payload: { selected: false } });
      localStorage.setItem('application_theme_dark', '0');
      this.electronService.getAppSettings().set(`applicationThemeDark`, '0');
      document.getElementById('themeTag').classList.remove('dark-theme');
    }
  }

  bonanzaOnlyChanged() {
    if (!this.appState.getState().applicationBonanzaOnly) {
      this.appState.dispatch({ type: APPLICATION_BONANZA_ONLY, payload: { selected: true } });
      localStorage.setItem('application_bonanza_only', '1');
      this.electronService.getAppSettings().set(`applicationBonanzaOnly`, '1');
    } else {
      this.appState.dispatch({ type: APPLICATION_BONANZA_ONLY, payload: { selected: false } });
      localStorage.setItem('application_bonanza_only', '0');
      this.electronService.getAppSettings().set(`applicationBonanzaOnly`, '0');
    }
  }

  closeSettings() {
    this.electronService.goToHome();
  }
}
