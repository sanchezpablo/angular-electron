import { Injectable } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../reducers/app.store';
import { TOGGLE_SIDEBAR } from '../reducers/app.actions';

@Injectable()
export class SidepanelService {
    @select() isSidebarOpened;
    @select() isLoggedIn;

    constructor(private ngRedux: NgRedux<IAppState>) { }

    toggleState() {
        this.ngRedux.dispatch({type: TOGGLE_SIDEBAR});
    }
}
