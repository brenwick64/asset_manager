import { ipcMain } from 'electron'
import { getDatabase } from './db'

export function registerIPC(): void {	
	ipcMain.handle('assets:list', () => {
		const rows = getDatabase()
			.prepare('SELECT * FROM audio_assets')
			.all()
		return JSON.stringify(rows)
	})

	// ipcMain.handle('assets:add', (_event, text: string) => {
	// 	return getDatabase()
	// 		.prepare('INSERT INTO notes (text) VALUES (?)')
	// 		.run(text)
	// })
}
