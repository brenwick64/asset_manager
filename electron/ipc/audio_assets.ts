import type { IpcMain } from "electron"
import type { Database } from 'better-sqlite3'
import { getDatabase } from '../db'

export const registerAudioAssets = (ipcMain: IpcMain) => {
    
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
    
        ipcMain.handle('audio_assets:insert_single', (event, asset: NewAudioAsset): boolean => {
            const db: Database = getDatabase()
            if (!db) throw new Error('Server Error: DB not initialized')
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
    
            try {
                insertStmt.run(asset)
                return true
    
            } catch(err) {
                return false
            }
        })
}