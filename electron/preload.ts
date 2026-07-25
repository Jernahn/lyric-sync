import { contextBridge, ipcRenderer } from 'electron';

const api = {
  ipcRenderer: {
    invoke: (...args: any[]) => ipcRenderer.invoke(...args),
    on: (...args: any[]) => ipcRenderer.on(...args),
    once: (...args: any[]) => ipcRenderer.once(...args),
    off: (...args: any[]) => ipcRenderer.off(...args),
  },
};

contextBridge.exposeInMainWorld('electron', api);

declare global {
  interface Window {
    electron: typeof api;
  }
}
