import { app, BrowserWindow, screen, Menu } from 'electron';
import * as path from 'path';
import * as url from 'url';

let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

const isWindows = process.platform === 'win32';
const appConfig = require('electron-settings');

function setMainMenu() {
  const template = [{
    label: isWindows ? 'Digital Accounting' : app.getName(),
    submenu: [{
      label: isWindows ? 'Exit' : `Quit ${app.getName()}`,
      accelerator: isWindows ? 'Alt+F4' : 'CmdOrCtrl+Q',
      click() {
        app.quit();
      }
    }]
  }];


  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function windowStateKeeper(windowName) {
  let window, windowState;
   function setBounds() {
    // Restore from appConfig
    if (appConfig.has(`windowState.${windowName}`)) {
      windowState = appConfig.get(`windowState.${windowName}`);
      return;
    }
    // Default
    windowState = {
      x: undefined,
      y: undefined,
      width: 1000,
      height: 800,
    };
  }
  function saveState() {
    if (!windowState.isMaximized) {
      windowState = window.getBounds();
    }
    windowState.isMaximized = window.isMaximized();
    appConfig.set(`windowState.${windowName}`, windowState);
  }

  // tslint:disable-next-line:no-shadowed-variable
  function track(win) {
    window = win;
    ['resize', 'move', 'close'].forEach(event => {
      win.on(event, saveState);
    });
  }
  setBounds();
  return({
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
    isMaximized: windowState.isMaximized,
    track,
  });
}

function createWindow() {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().bounds;

  // Create the menu
  setMainMenu();

  const WINDOW_WIDTH = 700;
  const WINDOW_HEIGHT = 600;

  const xPos = Math.ceil(size.x + ((size.width - WINDOW_WIDTH) / 2));
  const yPos = Math.ceil(size.y + ((size.height - WINDOW_HEIGHT) / 2));

  // Create the browser window.
  win = new BrowserWindow({
    x: xPos,
    y: yPos,
    webPreferences: { experimentalFeatures: true },
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    minWidth: WINDOW_WIDTH,
    minHeight: WINDOW_HEIGHT,
    autoHideMenuBar: false,
    frame: false,
    thickFrame: false,
    hasShadow: true
  });

  if (serve) {
    require('electron-reload')(__dirname, {
     electron: require(`${__dirname}/node_modules/electron`)});
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  win.webContents.openDevTools();

  // Get window state
  const mainWindowStateKeeper = windowStateKeeper('main');

  // Track window state
  mainWindowStateKeeper.track(win);

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

// Open handlers should be added on the first tick.
// These fire if the app is already running and the user
// drags files or URLs onto the dock icon, or if they set
// the app as a handler for a file type and then open a file
app.on('open-file', function(event, filePath) {
  event.preventDefault();
  console.log(filePath);
});

} catch (e) {
  console.log(e.getMessage());
  // Catch Error
  // throw e;
}
