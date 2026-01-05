import './FileDrop.css'
import { useState } from 'react'

import NewAudioFiles from '../NewAudioFiles/NewAudioFiles'

function FileDrop() {

  const [dragged, setDragged] = useState(false)

  //TMP
  const [files, setFiles] = useState<File[]>([])

  // -- Event Handlers --
  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    setDragged(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    setDragged(false)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (event.dataTransfer.files.length === 0) return
    // Process files
    const filesArray: File[] = Array.from(event.dataTransfer.files)
    console.log(filesArray)
    setFiles(filesArray)
    setDragged(false)
  }


  return (
    <div 
      className={dragged ? 'file-drop file-drop-dragged' : 'file-drop'}
      onDragEnter={(e) => handleDragEnter(e)}
      onDragLeave={(e) => { handleDragLeave(e) }}
      onDragOver={(e) => handleDragOver(e)}
      onDrop={(e) => handleDrop(e)}
    >
      
      <NewAudioFiles files={files} />
    </div>
  )
}

export default FileDrop