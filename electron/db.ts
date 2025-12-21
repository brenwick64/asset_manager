import { app } from 'electron'
import { createRequire } from 'node:module'
import path from 'node:path'

const require = createRequire(import.meta.url)
const Database = require('better-sqlite3') as typeof import('better-sqlite3')

type SqliteDb = import('better-sqlite3').Database
let db: SqliteDb | null = null

export function getDatabase(): SqliteDb {
	if (!db) throw new Error('DB not initialized')
	return db
}

export function initDatabase(): void {
	const db_path: string = path.join(app.getPath('userData'), 'asset_manager.db')
	db = new Database(db_path)

	//TODO: Create tables if they don't exist

	// get_db().exec(`
	// 	CREATE TABLE IF NOT EXISTS notes (
	// 		id INTEGER PRIMARY KEY,
	// 		text TEXT NOT NULL,
	// 		created_at TEXT NOT NULL DEFAULT (datetime('now'))
	// 	);
	// `)

    console.info('Database initialized at', db_path)
}
