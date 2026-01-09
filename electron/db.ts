import fs from 'fs/promises'
import { app } from 'electron'
import { createRequire } from 'node:module'
import path from 'node:path'

const require = createRequire(import.meta.url)
const Database = require('better-sqlite3') as typeof import('better-sqlite3')

export type Result<T> = {
	error: Error | null
	payload: T | null
}
type SqliteDb = import('better-sqlite3').Database

let db: SqliteDb | null = null

// Helper Functions
const getInitFiles = async (): Promise<string[]> => {
	const basePath: string = app.isPackaged ? process.resourcesPath : app.getAppPath()
	const fullPath: string = path.join(basePath, 'assets', 'sql', 'init')
	const files: string[] = await fs.readdir(fullPath)
	return files
}

const getFileData = async (filename: string): Promise<string> => {
	const basePath: string = app.isPackaged ? process.resourcesPath : app.getAppPath()
	const fullPath: string = path.join(basePath, 'assets', 'sql', 'init', filename)
	const fileData: string  = await fs.readFile(fullPath, 'utf-8')
	return fileData
}

const generateSQL = async (filenames: string[]): Promise<string> => {
	let sql: string = ""
	sql += 'BEGIN;\n'
	for(const filename of filenames) {
		const fileSQL: string = await getFileData(filename)
		sql += fileSQL
	}
	sql += '\nCOMMIT;'
	return sql
}

const getInitSQL = async (): Promise<string> => {
	const initFiles: string[] = await getInitFiles()
	const sql: string = await generateSQL(initFiles)
	return sql
}


// Public Methods
export function getDatabase(): SqliteDb {
	if (!db) throw new Error('DB not initialized')
	return db
}

export async function initDatabase(): Promise<Result<string>> {
	try {
		const dbPath: string = path.join(app.getPath('userData'), 'app.db')
		db = new Database(dbPath)

		const sql: string = await getInitSQL()
		db.exec(sql)

		return { error: null, payload: 'Database initialized successfully at: ' + dbPath }
	}
	catch (err) {
		const error: Error = err instanceof Error ? err : new Error(String(err))
		return { error: error, payload: null }
	}
}