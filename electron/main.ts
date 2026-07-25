import { app, BrowserWindow, ipcMain, Menu, dialog } from 'electron';
import path from 'path';
import { DatabaseService } from '../src/services/DatabaseService';
import isDev from 'electron-is-dev';

let mainWindow: BrowserWindow | null = null;
let overlayWindow: BrowserWindow | null = null;
let dbService: DatabaseService;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 800,
    minWidth: 600,
    minHeight: 400,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, '../assets/icon.png'),
  });

  const startUrl = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

const createOverlayWindow = () => {
  if (overlayWindow) {
    overlayWindow.show();
    return;
  }

  overlayWindow = new BrowserWindow({
    width: 400,
    height: 200,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  overlayWindow.setShape({
    rects: [
      {
        x: 0,
        y: 0,
        width: 400,
        height: 200,
      },
    ],
  });

  const startUrl = isDev
    ? 'http://localhost:5173/overlay'
    : `file://${path.join(__dirname, '../dist/overlay.html')}`;

  overlayWindow.loadURL(startUrl);

  overlayWindow.on('closed', () => {
    overlayWindow = null;
  });
};

app.on('ready', () => {
  try {
    dbService = new DatabaseService();
    createWindow();
    createMenu();
  } catch (error) {
    console.error('Failed to initialize app:', error);
    dialog.showErrorBox('Error', 'Failed to initialize application');
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    dbService?.close();
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC Handlers
ipcMain.handle('get-settings', async () => {
  try {
    return dbService.getSettings();
  } catch (error) {
    console.error('Failed to get settings:', error);
    return null;
  }
});

ipcMain.handle('save-settings', async (_event, settings) => {
  try {
    dbService.saveSettings(settings);
    return true;
  } catch (error) {
    console.error('Failed to save settings:', error);
    return false;
  }
});

ipcMain.handle('toggle-overlay', async () => {
  createOverlayWindow();
});

ipcMain.handle('close-overlay', async () => {
  if (overlayWindow) {
    overlayWindow.close();
    overlayWindow = null;
  }
});

const createMenu = () => {
  const template: any[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => app.quit(),
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
};
