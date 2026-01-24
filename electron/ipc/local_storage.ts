import type { IpcMain } from "electron"
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

export const registerLocalStorage = (ipcMain: IpcMain) => {

    ipcMain.handle('local_storage:get_audio_tags', (event, data): string[] => {
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

    ipcMain.handle('local_storage:set_audio_tags', (event, data): Result<unknown> => {
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

    ipcMain.handle('local_storage:test', (event, data): string => {
        console.log(pathToFileURL(data).toString());
        return pathToFileURL(data).toString()
    })

}