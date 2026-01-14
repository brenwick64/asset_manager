import './FileUploadScene.css'
import { useState } from 'react'
import { extractPath, extractFiles } from '../../utils/fileUploadUtils'
import Loader from '../../components/Loader/Loader'
import FileDrop from './FileDrop/FileDrop'
import NewAudioAssets from './NewAudioAssets/NewAudioAssets'

function FileUploadScene() {
  const [loading, setLoading] = useState<boolean>(false)
  const [dragged, setDragged] = useState<boolean>(false)
  const [droppedAssets, setDroppedAssets] = useState<AudioAsset[]>()
  
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
    
    setDragged(false)
    setLoading(true)
    if (event.dataTransfer.items.length === 0) return
    // Process files
    const draggedItems: DataTransferItem[] = Array.from(event.dataTransfer.items)
    
    // Separate out Path and Audio Files
    const absolutePath: string | null = extractPath(event.dataTransfer.files)    

    //TODO: fix this to throw proper error
    if(!absolutePath){ return }

    const droppedAudioAssets: AudioAsset[] = await extractFiles(absolutePath, draggedItems, "audio")

    console.log("absPath: " + absolutePath)

    if (absolutePath && droppedAudioAssets.length > 0){ //TODO: Guard clauses for split error handling
      console.log(droppedAudioAssets.length + " audio files dropped")
      // Separate out duplicate files
      const newAssetsList: AudioAsset[] = await window.db.get_new_audio_assets(droppedAudioAssets)
      console.log(newAssetsList.length + " new records")
      setDroppedAssets(newAssetsList)
      console.log("assets dropped:")
      console.log(newAssetsList)
      
    }
    else {
      //TODO: Toast notification?
    }
    setLoading(false)
  }

  // Rendering Logic
  if(loading){ 
    return <Loader />
  } 
  else if(droppedAssets && droppedAssets.length > 0){ 
    return <NewAudioAssets assets={droppedAssets} />
  } 
  else {
    return <FileDrop dragged={dragged} handleDragEnter={handleDragEnter} handleDragOver={handleDragOver} handleDragLeave={handleDragLeave} handleDrop={handleDrop} /> 
  }
}

export default FileUploadScene
