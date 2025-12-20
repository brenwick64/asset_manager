import path from 'node:path'
import { BrowserWindow } from 'electron'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export function create_window(): BrowserWindow {
	const win = new BrowserWindow({
		webPreferences: {
			preload: path.join(__dirname, 'preload.mjs'),
			contextIsolation: true,
		},
	})
	return win
}