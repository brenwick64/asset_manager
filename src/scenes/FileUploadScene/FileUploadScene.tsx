import './FileUploadScene.css'
import { useState } from 'react'
import { BsUpload } from 'react-icons/bs'


function FileUploadScene() {
  const [dragged, setDragged] = useState<boolean>(false)

  const readAllEntries = (dirEntry: FileSystemDirectoryEntry): Promise<FileSystemEntry[]> => {
    const reader = dirEntry.createReader()
    const entries: FileSystemEntry[] = []

    return new Promise(resolve => {
      const readNext = () => {
        reader.readEntries(batch => {
          if (batch.length === 0) {
            resolve(entries)
            return
          }

          entries.push(...batch)
          readNext()
        })
      }
      readNext()
    })
  }


const unpackItem = async (entry: FileSystemEntry): Promise<string[]> => {
  if (entry.isFile) {
    return [entry.fullPath]
  }

  if (entry.isDirectory) {
    const entries = await readAllEntries(entry as FileSystemDirectoryEntry)

    const results: string[] = []
    for (const child of entries) {
      results.push(...await unpackItem(child))
    }
    return results
  }

  return [] // Dropout
}

const unpackItems = async (itemList: DataTransferItem[]): Promise<string[]> => {
  const results: string[] = []

  for (const item of itemList) {
    const entry = item.webkitGetAsEntry()
    if (!entry) continue
    results.push(...await unpackItem(entry))
  }

  return results
}


  ////####



  // -- Event Handlers --
  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (event.dataTransfer.items.length === 0) return
    setDragged(true)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()    
    if (event.dataTransfer.items.length === 0) return
    setDragged(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragged(false)
  }

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (event.dataTransfer.items.length === 0) return
    // Process files
    const draggedItems: DataTransferItem[] = Array.from(event.dataTransfer.items)


    const unpackedFiles: string[] = await unpackItems(draggedItems)
    console.log(unpackedFiles);
    
    

    setDragged(false)
  }


  return (
    <div 
      className={dragged ? 'scene file-upload-scene file-upload-scene-dragged' : 'scene file-upload-scene'}
      onDragEnter={(e) => handleDragEnter(e)}
      onDragLeave={(e) => { handleDragLeave(e) }}
      onDragOver={(e) => handleDragOver(e)}
      onDrop={(e) => handleDrop(e)}
    >
      <BsUpload className='upload-icon' size={64} />
    </div>
  )
}

export default FileUploadScene