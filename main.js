const { app, BrowserWindow } = require('electron');
const path = require('path');
const dotenv = require('dotenv');
const { registerFileDialogHandler } = require('./myIpcs.js');
dotenv.config(); 
console.log(process.env.VITE_DEV_SERVER_URL);

console.log("__filename", __filename);
console.log("__dirname", __dirname);

registerFileDialogHandler(); // import of ipcMain function

async function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1200,
    minHeight: 800,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    contextIsolation: true,
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    // dev mode: load vite server
    await win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    // production: load built index.html
    await win.loadFile(path.join(__dirname, '../renderer/dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})