import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from '../../../providers/electron.service';
import { SidepanelService } from '../../../providers/sidepanel.service';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState, IWindowState } from '../../../reducers/app.store';

@Component({
  selector: 'app-maintoolbar',
  templateUrl: './maintoolbar.component.html',
  styleUrls: ['./maintoolbar.component.css']
})
export class MainToolbarComponent implements OnInit, AfterViewInit {
  @select() mainWindowState;

  constructor(private router: Router,
    private appState: NgRedux<IAppState>,
    private electronService: ElectronService,
    private sidepanelService: SidepanelService) {
  }

  ngOnInit() {}

  ngAfterViewInit() {
  }

  quitApplication() {
    this.electronService.quitApplication();
  }

  maximizeWindow() {
    this.electronService.maximizeMainWindow();
  }

  unmaximizeWindow() {
    this.electronService.unmaximizeMainWindow();
  }

  minimizeWindow() {
    this.electronService.minimizeMainWindow();
  }

  toggleSidebar() {
    this.sidepanelService.toggleState();
  }
}
