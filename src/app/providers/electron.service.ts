import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote, BrowserWindow } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';

import { Router } from '@angular/router';
import { select, NgRedux } from '@angular-redux/store';
import { IWindowState, IAppState } from '../reducers/app.store';
import { WINDOW_STATE_RESTORE, WINDOW_STATE_MAXIMIZE, WINDOW_STATE_MINIMIZE } from '../reducers/app.actions';

@Injectable()
export class ElectronService {
  mainWindowState: IWindowState;
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;
  currentWindow: BrowserWindow;
  appSettings: any;

  constructor(private appState: NgRedux<IAppState>, private router: Router) {
    // Conditional imports
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;
      this.currentWindow = this.remote.getCurrentWindow();
      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
      this.appSettings = this.remote.require('electron-settings');

      this.currentWindow.on('maximize', () => {
        this.appState.dispatch({ type: WINDOW_STATE_MAXIMIZE });
      });

      this.currentWindow.on('unmaximize', () => {
        this.appState.dispatch({ type: WINDOW_STATE_RESTORE });
      });

      this.currentWindow.on('minimize', () => {
        this.appState.dispatch({ type: WINDOW_STATE_MINIMIZE });
      });

      if (this.isElectron()) {
        const edge = require('electron-edge-js');

        const helloWorld = edge.func(function () {/*
          async (input) => {
              return ".NET Welcomes " + input.ToString();
          }
        */});

        console.log(helloWorld('pablo'));
      }
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  }

  getApplicationVersion() {
    if (this.isElectron()) {
      return this.remote.app.getVersion();
    } else {
      return '1.0.0';
    }
  }

  quitApplication() {
    this.remote.app.quit();
  }

  maximizeMainWindow() {
    if (this.isElectron()) {
       this.appState.dispatch({ type: WINDOW_STATE_MAXIMIZE });
      this.currentWindow.maximize();
    }
  }

  unmaximizeMainWindow() {
    if (this.isElectron()) {
      this.appState.dispatch({ type: WINDOW_STATE_RESTORE });
      this.currentWindow.unmaximize();
    }
  }

  minimizeMainWindow() {
    if (this.isElectron()) {
      this.appState.dispatch({ type: WINDOW_STATE_MINIMIZE });
      this.currentWindow.minimize();
    }
  }

  goToHome() {
    this.router.navigateByUrl('/');
  }

  getAppSettings() {
    return this.appSettings;
  }
}
