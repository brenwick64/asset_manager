import './FileUploadScene.css'
import { useState } from 'react'
import { BsUpload } from 'react-icons/bs'
import { extractFiles } from '../../utils/fileUploadUtils'


function FileUploadScene() {
  const [dragged, setDragged] = useState<boolean>(false)
  
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
    const unpackedFiles: FileSystemEntry[] = await extractFiles(draggedItems, "audio")

    console.log(unpackedFiles)
    
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