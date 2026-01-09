import path from 'path'	
import { ipcMain, app } from 'electron'
import { getDatabase } from './db'
import fs from 'fs/promises'


export function registerIPC(): void {	

	// READ DB OPERATIONS
	ipcMain.handle('assets:list', () => {
		const rows = getDatabase()
			.prepare('SELECT * FROM audio_assets')
			.all()
		return JSON.stringify(rows)
	})


	// FILE OPERATIONS

	// ipcMain.handle('assets:add', (_event, text: string) => {
	// 	return getDatabase()
	// 		.prepare('INSERT INTO notes (text) VALUES (?)')
	// 		.run(text)
	// })
}
