import { ipcMain } from 'electron'
import { get_db } from './db'

export function register_ipc(): void {
	ipcMain.handle('notes:list', () => {
		return get_db()
			.prepare('SELECT * FROM notes ORDER BY id DESC')
			.all()
	})

	ipcMain.handle('notes:add', (_event, text: string) => {
		return get_db()
			.prepare('INSERT INTO notes (text) VALUES (?)')
			.run(text)
	})
}
