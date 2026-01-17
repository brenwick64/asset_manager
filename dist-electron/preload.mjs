"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
});
electron.contextBridge.exposeInMainWorld("db", {
  get_new_audio_assets: (data) => electron.ipcRenderer.invoke("audio_assets:get_new", data),
  save_audio_assets: (data) => electron.ipcRenderer.invoke("audio_assets:insert", data)
});
electron.contextBridge.exposeInMainWorld("asset_paths", {
  get_file_url: (absolute, relative) => electron.ipcRenderer.invoke("file:test", absolute + relative)
});
electron.contextBridge.exposeInMainWorld("local_storage", {
  get_audio_tags: () => electron.ipcRenderer.invoke("file:get_audio_tags"),
  set_audio_tags: (tags) => electron.ipcRenderer.invoke("file:set_audio_tags", tags)
});
