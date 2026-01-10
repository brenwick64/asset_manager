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

		const db: Database = getDatabase()
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
	ipcMain.handle('audio_assets:save_db', (event, data): Result<unknown> => {
		let insertCount: number = 0
		let rejectCount: number = 0
		try{
			const db: Database = getDatabase()
			if (!db) throw new Error('DB not initialized')
	
			const insertStmt = db.prepare(`
				INSERT INTO AUDIO_ASSETS(
					original_filename,
					content_type,
					file_extension,
					storage_uri
				)
				VALUES(
					@filename,
					@content_type,
					@file_extension,
					@storage_uri
				)
			`)
	
			const insertMany = db.transaction((assets: AudioAsset[]) => {
				for (const asset of assets) {
					const response = insertStmt.run(asset)					
					if(response) { insertCount += 1 } 
					else{ rejectCount += 1 }
				}
			})
			insertMany(data)
			return { payload: { inserted: insertCount, rejected: rejectCount }, error: null }
		}
		catch(err) {
			return { payload: null, error: err instanceof Error ? err : Error('Error') }
		}
	})

}
