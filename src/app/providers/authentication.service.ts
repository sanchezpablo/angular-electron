import {
  Injectable
} from '@angular/core';

import {
  AngularFireAuth
} from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import {
  Observable
} from 'rxjs/Observable';
import {
  NgRedux
} from '@angular-redux/store';
import {
  IAppState
} from '../reducers/app.store';
import {
  USER_LOGGED_IN,
  USER_LOGGED_OUT,
  LOGIN_SET_LAST_ERROR_MESSAGE
} from '../reducers/app.actions';
import {
  Router
} from '@angular/router';
import {
  JwtHelperService
} from '@auth0/angular-jwt';

@Injectable()
export class AuthenticationService {
  user: Observable<firebase.User>;

  constructor(public jwtHelper: JwtHelperService,
    private firebaseAuth: AngularFireAuth,
    private ngRedux: NgRedux<IAppState>,
    private router: Router) {
    this.user = firebaseAuth.authState;
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('fb_token');
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(token);
  }

  signup(email: string, password: string) {
    const that = this;
    this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        if (firebase.auth().currentUser !== undefined) {
            firebase.auth().currentUser.getIdToken( /* forceRefresh */ true).then(function (idToken) {
                that.goToHomePage(idToken);
            }).catch(function (error) {
                that.goToSigninPage();
            });
        } else {
            that.goToSigninPage();
        }
      })
      .catch(err => {
        this.goToSigninPage();
      });
  }

  login(email: string, password: string) {
    const that = this;
    this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        if (firebase.auth().currentUser !== undefined) {
            firebase.auth().currentUser.getIdToken( /* forceRefresh */ true).then(function (idToken) {
                that.goToHomePage(idToken);
            }).catch(function (error) {
                that.ngRedux.dispatch({type: LOGIN_SET_LAST_ERROR_MESSAGE, payload: {lastErrorMessage: error } });
                that.goToSigninPage();
            });
        } else {
            that.goToSigninPage();
        }
      })
      .catch(err => {
        that.ngRedux.dispatch({type: LOGIN_SET_LAST_ERROR_MESSAGE, payload: {lastErrorMessage: err.message } });
        this.goToSigninPage();
      });
  }

  logout() {
    this.firebaseAuth.auth.signOut();
    this.goToSigninPage();
  }

  private goToSigninPage() {
    this.ngRedux.dispatch({
        type: USER_LOGGED_OUT
      });
      localStorage.setItem('fb_token', '');
      this.router.navigate(['signin']);
  }

  private goToHomePage(idToken: string) {
    localStorage.setItem('fb_token', idToken);
    this.ngRedux.dispatch({type: LOGIN_SET_LAST_ERROR_MESSAGE, payload: {lastErrorMessage: '' } });
    this.ngRedux.dispatch({
      type: USER_LOGGED_IN
    });
    this.router.navigate(['home']);
  }
}
