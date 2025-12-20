import { app, BrowserWindow } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Custom Modules
import { create_window } from './window'
import { register_ipc } from './ipc'
import { init_db } from './db'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
process.env.APP_ROOT = path.join(__dirname, '..')

app.whenReady().then(() => {
	init_db()
	register_ipc()
	create_window()
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (BrowserWindow.getAllWindows?.().length === 0) {
		create_window()
	}
})
