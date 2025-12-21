import path from 'node:path'
import { app, Menu } from 'electron'
import { fileURLToPath } from 'node:url'

// Custom Modules
import { createWindow } from './window'
import { registerIPC } from './ipc'
import { initDatabase } from './db'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
process.env.APP_ROOT = path.join(__dirname, '..')

app.whenReady().then(() => {
	Menu.setApplicationMenu(null) // removes the menu bar (File, Edit, etc.)

	initDatabase()
	registerIPC()
	createWindow()	
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})
