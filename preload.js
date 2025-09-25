const { contextBridge, ipcRenderer } = require('electron');

/* Thanks to the preload.js we can use node modules in renderer for example: dialog */

contextBridge.exposeInMainWorld('electronAPI', {
    openFile: () => ipcRenderer.invoke('openFile'), // 
    readFile: (filePath) => ipcRenderer.invoke('readFile', filePath),
    manualSave: (data) => ipcRenderer.invoke('manualSave', data),
    autoSave: (filePath, data) => ipcRenderer.invoke("autoSave", { filePath, data })
});