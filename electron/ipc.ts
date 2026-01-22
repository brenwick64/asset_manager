import { ipcMain } from 'electron'
// Local Imports
import {registerAudioAssets } from './ipc/audio_assets'
import { registerFS } from './ipc/fs'
import { registerLocalStorage } from './ipc/local_storage'

export function registerIPC(): void {
	registerAudioAssets(ipcMain)
	registerFS(ipcMain)
	registerLocalStorage(ipcMain)
}