import { FILE_CATEGORY_MAPPINGS } from "../globals/constants"


// Helper functions
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

const filterEntries = (fileEntries: FileSystemEntry[], fileCategory: FileCategory) => {

    const getEntryExtension = (fileName: string) => {
        const idx: number = fileName.lastIndexOf(".")
        return idx >= 0 ? fileName.slice(idx + 1).toLowerCase() : ""
    }

    const filteredEntries: FileSystemEntry[] = fileEntries.filter(entry => {
        const fileExtension: string = getEntryExtension(entry.name)
        return FILE_CATEGORY_MAPPINGS[fileCategory].includes(fileExtension)
    })

    return filteredEntries
}


// Public Utils
export const extractFiles = async (itemList: DataTransferItem[], FileCategory?: FileCategory): Promise<FileSystemEntry[]> => {
    const results: FileSystemEntry[] = []

    for (const item of itemList) {
        const entry = item.webkitGetAsEntry()
        if (!entry) continue
        results.push(...await unpackEntry(entry))
    }

    if (FileCategory){ return filterEntries(results, FileCategory) }
    else{ return results }
}