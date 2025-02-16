import { contextBridge, ipcRenderer } from 'electron';
// const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  ping: () => {
    return ipcRenderer.invoke('ping')
      .then(response => response)
      .catch(error => {
        console.error('IPC Error:', error);
        throw error;
      });
  }
});