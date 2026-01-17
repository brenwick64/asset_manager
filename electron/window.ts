import path from 'node:path'
import { BrowserWindow } from 'electron'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']


export function createWindow(): BrowserWindow {
	const win = new BrowserWindow({
		width: 1400,
		height: 1400,
		webPreferences: {
			preload: path.join(__dirname, 'preload.mjs'),
			contextIsolation: true		
		}

	})

	if (VITE_DEV_SERVER_URL) {
		win.loadURL(VITE_DEV_SERVER_URL)
		win.webContents.openDevTools()
	} 
	else {
		win.loadFile(path.join(__dirname, 'dist', 'index.html'))
	}

	return win
}