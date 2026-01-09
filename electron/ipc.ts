import type { Database } from 'better-sqlite3'
import { ipcMain } from 'electron'
import { getDatabase } from './db'


export function registerIPC(): void {	

	ipcMain.handle('audio_assets:get_new', async (event, data): Promise<AudioAsset[]> => {

		const createTempTable = (db: Database): string => {
			const tempTableName: string = `temp_names_${Date.now()}_${Math.floor(Math.random() * 1e9)}` // Unique name to avoid collisions
			db.exec(`CREATE TABLE ${tempTableName} (
						name TEXT PRIMARY KEY
					);
			`)
			return tempTableName
		}

		const queryNewNames = (db: Database, nameList: string[], tempTableName: string): string[] => {
			const insert = db.prepare(`INSERT OR IGNORE INTO ${tempTableName} (name) VALUES (?)`)
			for (const name of nameList) { insert.run(name) }

			const rows = db.prepare(`
				SELECT t.name
				FROM ${tempTableName} t
				LEFT JOIN audio_assets a ON a.original_filename = t.name
				WHERE a.original_filename IS NULL
			`).all() as Array<{ name: string }>

			return rows.map(r => r.name)
		}

		const dropTempTable = (db: Database, tempTableName: string) => {
			db.exec(`DROP TABLE IF EXISTS ${tempTableName}`)
		}

		const db = getDatabase()
		if (!db) throw new Error('DB not initialized')

		const keyList: string[] = data.map((asset: AudioAsset) => asset.filename)
		const tempTableName: string = createTempTable(db)
		const newNames: string[] = queryNewNames(db, keyList, tempTableName)
		dropTempTable(db, tempTableName)

		
		return data.filter((asset: AudioAsset) => {
			return newNames.includes(asset.filename)
		})
	})

	// TODO
	ipcMain.handle('audio_assets:save', (event, data): Result<null> => {
		return { payload: null, error: null }
	})

}
