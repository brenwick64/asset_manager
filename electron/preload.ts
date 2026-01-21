import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  }
})

contextBridge.exposeInMainWorld('db', {
  get_new_audio_assets: (data: FileSystemEntry[]) => ipcRenderer.invoke('audio_assets:get_new', data),
  save_audio_assets: (data: NewAudioAsset[]) => ipcRenderer.invoke('audio_assets:insert', data)
})

contextBridge.exposeInMainWorld('fs', {
  write_audio_files: (data: NewAudioAsset[]) => ipcRenderer.invoke('fs:write_audio_files', data)
})

contextBridge.exposeInMainWorld('asset_paths', {
  get_file_url: (absolute: string, relative: string) => ipcRenderer.invoke('file:test', absolute + relative)
})

contextBridge.exposeInMainWorld('local_storage', {
  get_audio_tags: () => ipcRenderer.invoke('file:get_audio_tags'),
  set_audio_tags: (tags: string[]) => ipcRenderer.invoke('file:set_audio_tags', tags)
})
