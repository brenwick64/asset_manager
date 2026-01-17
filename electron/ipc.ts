import fs from 'node:fs'
import path from 'node:path'
import type { Database } from 'better-sqlite3'
import { pathToFileURL } from 'node:url'
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
				LEFT JOIN audio_assets a ON a.filename = t.name
				WHERE a.filename IS NULL
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

	ipcMain.handle('audio_assets:insert', (event, data): Result<unknown> => {
		let insertCount: number = 0
		let rejectCount: number = 0
		try{
			const db: Database = getDatabase()
			if (!db) throw new Error('DB not initialized')
	
			const insertStmt = db.prepare(`
				INSERT INTO AUDIO_ASSETS(
					filename,
					content_type,
					file_extension,
					absolute_path,
					relative_path,
					tags
				)
				VALUES(
					@filename,
					@content_type,
					@file_extension,
					@absolute_path,
					@relative_path,
					@json_tags
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

	ipcMain.handle('file:get_audio_tags', (event, data): string[] => {
		const audioTagsPath: string = path.join(
			process.env.APP_ROOT!,
			'assets',
			'tags',
			'audio_tags.json'
		)
		
		if (!fs.existsSync(audioTagsPath)) return []
		const raw = fs.readFileSync(audioTagsPath, 'utf-8')
		const parsed = JSON.parse(raw)
		return Array.isArray(parsed.tags) ? parsed.tags : []
	})

	ipcMain.handle('file:set_audio_tags', (event, data): Result<unknown> => {
		const audioTagsPath: string = path.join(
			process.env.APP_ROOT!,
			'assets',
			'tags',
			'audio_tags.json'
		)

		// -- asset proper types --
		if (!Array.isArray(data)) {
			return { payload: null, error: new Error('Tags payload must be an array') }
		}
		if (!data.every((t): t is string => typeof t === 'string')) {
			return { payload: null, error: new Error('All tags must be strings') }
		}

		// Normalize + dedupe
		const tags: string[] = [...new Set(
		data
			.map((t: string) => t.trim())
			.filter(Boolean)
		)]

		try {
			fs.mkdirSync(path.dirname(audioTagsPath) ? path.dirname(audioTagsPath) : audioTagsPath.replace(/\/[^/]+$/, ''),{ recursive: true })
			fs.writeFileSync(audioTagsPath, JSON.stringify({ tags }, null, 2), 'utf-8')
			return { payload: "Ok", error: null }
		}
		catch(err) {
			return { payload: null, error: err instanceof Error ? err : new Error('Failed to write tags') }
		}
	})

	ipcMain.handle('file:test', (event, data): string => {
		console.log(pathToFileURL(data).toString());
		return pathToFileURL(data).toString()
	})
}
