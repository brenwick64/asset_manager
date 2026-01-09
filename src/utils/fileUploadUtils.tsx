import { FILE_CATEGORY_MAPPINGS } from "../globals/constants"


// Helper functions
const getFileExtension = (fileName: string) => {
        const idx: number = fileName.lastIndexOf(".")
        return idx >= 0 ? fileName.slice(idx + 1).toLowerCase() : ""
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

const convertEntries = (fileEntries: FileSystemEntry[]): AudioAsset[] => {
    const audioAssets: AudioAsset[] = []
    for(const entry of fileEntries) {
        audioAssets.push({
            filename: entry.name,
            file_extension: getFileExtension(entry.name),
            content_type: 'audio',
            storage_uri: entry.fullPath
        })
    }
    return audioAssets
}


// Public Utils
export const extractFiles = async (itemList: DataTransferItem[], FileCategory?: FileCategory): Promise<AudioAsset[]> => {
    const results: FileSystemEntry[] = []

    for (const item of itemList) {
        const entry = item.webkitGetAsEntry()
        if (!entry) continue
        results.push(...await unpackEntry(entry))
    }

    if (FileCategory){ 
        const filteredEntries: FileSystemEntry[] = filterEntries(results, FileCategory) 
        const audioAssets: AudioAsset[] = convertEntries(filteredEntries)
        return audioAssets
    }
    else{ return [] }
}