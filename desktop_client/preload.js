const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  minimize: () => ipcRenderer.send("window-control", "minimize"),
  toggleMaximize: () => ipcRenderer.send("window-control", "toggle-maximize"),
  close: () => ipcRenderer.send("window-control", "close"),
  isMaximized: () => ipcRenderer.invoke("window:isMaximized"),
  onMaximizeState: (callback) => {
    const listener = (_event, state) => callback(state);
    ipcRenderer.on("window:maximize-state", listener);
    return () => ipcRenderer.removeListener("window:maximize-state", listener);
  },
});
