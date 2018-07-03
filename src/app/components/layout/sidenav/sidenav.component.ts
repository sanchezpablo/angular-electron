import {
  Component,
  OnInit
} from '@angular/core';
import {
  select,
  NgRedux
} from '@angular-redux/store';
import {
  TranslateService
} from '@ngx-translate/core';
import {
  IAppState
} from '../../../reducers/app.store';

import { AuthenticationService } from '../../../providers/authentication.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})

export class SidenavComponent implements OnInit {
  @select() sidebarWidth;
  @select() isLoggedIn;

  constructor(private ngRedux: NgRedux<IAppState> , private translate: TranslateService, private authService: AuthenticationService) {
  }

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
  }
}
