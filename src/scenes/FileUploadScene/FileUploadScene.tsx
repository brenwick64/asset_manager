import './FileUploadScene.css'
import { useState } from 'react'
import { extractPath, extractFiles } from '../../utils/fileUploadUtils'
import Loader from '../../components/Loader/Loader'
import FileDrop from './FileDrop/FileDrop'
import NewAudioAssets from './NewAudioAssets/NewAudioAssets'

function FileUploadScene() {
  const [dragged, setDragged] = useState<boolean>(false)
  const [audioFilesDropped, setAudioFilesDropped] = useState<boolean>(false)
  const [assetsLoaded, setAssetsLoaded] = useState<boolean>(false)
  const [droppedAssets, setDroppedAssets] = useState<AudioAsset[]>([])
  
  const resetScene = () => {
    setDragged(false)
    setAudioFilesDropped(false)
    setAssetsLoaded(false)
    setDroppedAssets([])
  }

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

    if (event.dataTransfer.items.length === 0) return

    setAudioFilesDropped(true) // Start Loader

    // Process files
    const draggedItems: DataTransferItem[] = Array.from(event.dataTransfer.items)
    
    // Separate out Path and Audio Files
    const absolutePath: string | null = extractPath(event.dataTransfer.files)    

    //TODO: fix this to throw proper error
    if(!absolutePath){ return }

    const droppedAudioAssets: AudioAsset[] = await extractFiles(absolutePath, draggedItems, "audio")

    // TODO: Toast this
    if(droppedAudioAssets.length <= 0){ 
      setAudioFilesDropped(false)
      return
    }

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
  }

  // Rendering Logic
if(!audioFilesDropped) {
  return <FileDrop dragged={dragged} handleDragEnter={handleDragEnter} handleDragOver={handleDragOver} handleDragLeave={handleDragLeave} handleDrop={handleDrop} /> 
}

return (
  <>
    {!assetsLoaded && <Loader />}
    <NewAudioAssets assets={droppedAssets} assetsLoaded={assetsLoaded} setAssetsLoaded={setAssetsLoaded} resetScene={resetScene} />
  </>
)
}

export default FileUploadScene
