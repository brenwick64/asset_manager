import { FILE_CATEGORY_MAPPINGS } from "../globals/constants"


// Helper functions
export const normalizeAbsolutePath = (path: string): string => {
    const normalizedPath: string = path.replace(/\\/g, "/")
    // Remove the last directory, since its included in the relative path
    const lastSlashIndex: number = normalizedPath.lastIndexOf("/")
    return lastSlashIndex === -1 ? normalizedPath : normalizedPath.slice(0, lastSlashIndex)
}

const getFileName = (fileName: string) => {
    const lastDotIndex: number = fileName.lastIndexOf(".")
    return lastDotIndex === -1 ? fileName : fileName.slice(0, lastDotIndex)
}

const getFileExtension = (fileName: string) => {
        const idx: number = fileName.lastIndexOf(".")
        return idx >= 0 ? fileName.slice(idx + 1).toLowerCase() : ""
}

const getRelativePath = (path: string, filename: string): string => {
    const relPath: string = path.replace(filename, "")
    return  relPath
}

const readAllEntries = (dirEntry: FileSystemDirectoryEntry): Promise<FileSystemEntry[]> => {
    const reader: FileSystemDirectoryReader = dirEntry.createReader()
    const entries: FileSystemEntry[] = []

    return new Promise((resolve, reject) => {
        const readNext = () => {
            try {
                reader.readEntries(
                    (batch: FileSystemEntry[]) => {
                        if (batch.length === 0) {
                            resolve(entries)
                            return
                        }
                        entries.push(...batch)
                        readNext()
                    },
                    (err?: DOMException) => {
                        reject(err ?? new Error("Failed to read directory entries"))
                    }
                )
            } catch (e) {
                reject(e)
            }
        }
        readNext()
    })
}

const unpackEntry = async (entry: FileSystemEntry): Promise<FileSystemEntry[]> => {
    const results: FileSystemEntry[] = []

    if (entry.isFile) {
        results.push(entry)
    }

    if (entry.isDirectory) {
        const entries = await readAllEntries(entry as FileSystemDirectoryEntry)
        for (const child of entries) {
        results.push(...await unpackEntry(child)) // Recursive call
        }
    }
    return results
}

const filterEntries = (fileEntries: FileSystemEntry[], fileCategory: FileCategory): FileSystemEntry[] => {
    const filteredEntries: FileSystemEntry[] = fileEntries.filter(entry => {
        const fileExtension: string = getFileExtension(entry.name)
        return FILE_CATEGORY_MAPPINGS[fileCategory].includes(fileExtension)
    })

    return filteredEntries
}

const convertEntries = (absolutePath: string, fileEntries: FileSystemEntry[]): AudioAsset[] => {
    const audioAssets: AudioAsset[] = []
    for(const entry of fileEntries) {
        audioAssets.push({
            filename: getFileName(entry.name),
            file_extension: getFileExtension(entry.name),
            content_type: 'audio',
            absolute_path: normalizeAbsolutePath(absolutePath),
            relative_path: getRelativePath(entry.fullPath, entry.name)
        })
    }
    return audioAssets
}


// Public Utils
export const extractPath = (fileList: FileList): string | null => {
    if(fileList.length === 0) return null
    const absolutePath: string = fileList[0].path
    return absolutePath
}

export const extractFiles = async (absolutePath: string, itemList: DataTransferItem[], FileCategory?: FileCategory): Promise<AudioAsset[]> => {
    const results: FileSystemEntry[] = []

    for (const item of itemList) {
        const entry = item.webkitGetAsEntry()
        if (!entry) continue
        results.push(...await unpackEntry(entry))
    }

    if (FileCategory){ 
        const filteredEntries: FileSystemEntry[] = filterEntries(results, FileCategory) 
        const audioAssets: AudioAsset[] = convertEntries(absolutePath, filteredEntries)
        return audioAssets
    }
    else{ return [] }
}
