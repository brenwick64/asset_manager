import type { IpcMain } from "electron"
import { app } from "electron"
import path from 'node:path'
import { mkdir, copyFile } from 'node:fs/promises'

type WriteAudioFilePayload = {
    saved: boolean
    absolutePath: string | null
}

export const registerFS = (ipcMain: IpcMain) => {
    ipcMain.handle('fs:write_audio_file', async (event, asset: NewAudioAsset): Promise<WriteAudioFilePayload> => {
        // Create base directory if it doesnt exist
        const baseDirectory: string = path.join(app.getPath('userData'), 'saved_assets', 'audio')
        await mkdir(baseDirectory, { recursive: true })

        // construct source and dest paths from data
        const fileNameWithExt: string = `${asset.filename}.${asset.file_extension}`
        const sourcePath: string = path.join(asset.absolute_path, asset.relative_path, fileNameWithExt)

        const destDir: string = path.join(baseDirectory, asset.relative_path)
        const destPath: string = path.join(destDir, fileNameWithExt)

        try {
            // create directory and copy file
            await mkdir(destDir, { recursive: true })
            await copyFile(sourcePath, destPath)
            return { saved: true, absolutePath: baseDirectory }
        }
        catch (err) {
            return { saved: false, absolutePath: null }
        }
    })
}