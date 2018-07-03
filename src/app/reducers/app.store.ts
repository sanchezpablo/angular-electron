import { APPLICATION_THEME_DARK } from './app.actions';
import {
  TOGGLE_SIDEBAR,
  USER_LOGGED_IN,
  USER_LOGGED_OUT,
  LOGIN_SET_LAST_ERROR_MESSAGE,
  WINDOW_STATE_MAXIMIZE,
  WINDOW_STATE_MINIMIZE,
  WINDOW_STATE_RESTORE,
  APPLICATION_BONANZA_ONLY
} from './app.actions';

export interface IWindowState {
  xPos: number;
  yPos: number;
  width: number;
  height: number;
  isMaximized: boolean;
  isMinimized: boolean;
}

export interface IAppState {
  isLoggedIn: boolean;
  sidebarWidth: number;
  loginLastError: string;
  mainWindowState: IWindowState;
  applicationThemeDark: boolean;
  applicationBonanzaOnly: boolean;
}

export const INITIAL_STATE: IAppState = {
  sidebarWidth: 64,
  isLoggedIn: false,
  loginLastError: '',
  mainWindowState: {
    xPos: 0,
    yPos: 0,
    width: 1024,
    height: 768,
    isMaximized: false,
    isMinimized: false
  },
  applicationThemeDark: false,
  applicationBonanzaOnly: false
};

export function rootReducer(state: IAppState, action): IAppState {
  switch (action.type) {
    case TOGGLE_SIDEBAR:
      {
        state.sidebarWidth = state.sidebarWidth <= 64 ? 180 : 64;
        return Object.assign({}, state, {
          sidebarWidth: state.sidebarWidth
        });
      }
    case USER_LOGGED_IN:
      {
        state.isLoggedIn = true;
        return Object.assign({}, state, {
            isLoggedIn: state.isLoggedIn
        });
      }
    case USER_LOGGED_OUT:
      {
        state.isLoggedIn = false;
        return Object.assign({}, state, {
            isLoggedIn: state.isLoggedIn
        });
      }
    case LOGIN_SET_LAST_ERROR_MESSAGE:
      {
        state.loginLastError = action.payload.lastErrorMessage;
        return Object.assign({}, state, {
          loginLastError: state.loginLastError
        });
      }
    case WINDOW_STATE_MAXIMIZE:
      {
        state.mainWindowState.isMaximized = true;
        state.mainWindowState.isMinimized = false;
        return Object.assign({}, state, {
          mainWindowState: state.mainWindowState
        });
      }
    case WINDOW_STATE_MINIMIZE:
      {
        state.mainWindowState.isMaximized = false;
        state.mainWindowState.isMinimized = true;
        return Object.assign({}, state, {
          mainWindowState: state.mainWindowState
        });
      }
    case WINDOW_STATE_RESTORE:
      {
        state.mainWindowState.isMaximized = false;
        state.mainWindowState.isMinimized = false;
        return Object.assign({}, state, {
          mainWindowState: state.mainWindowState
        });
      }
    case APPLICATION_THEME_DARK:
      {
        state.applicationThemeDark = action.payload.selected;
        return Object.assign({}, state, {
          applicationThemeDark: state.applicationThemeDark
        });
      }
    case APPLICATION_BONANZA_ONLY:
      {
        state.applicationBonanzaOnly = action.payload.selected;
        return Object.assign({}, state, {
          applicationBonanzaOnly: state.applicationBonanzaOnly
        });
      }
  }
  return state;
}
