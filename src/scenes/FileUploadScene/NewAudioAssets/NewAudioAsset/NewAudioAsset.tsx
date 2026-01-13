import './NewAudioAsset.css'
import { useState, useEffect, useRef } from 'react'
import AudioControls from '../../../../components/AudioControls/AudioControls'

type Props = {
    asset: AudioAsset
}

function NewAudioAsset({ asset }: Props) {
  const audioRef: React.MutableRefObject<HTMLAudioElement | null> = useRef(null)
  const [src, setSrc] = useState<string>()
  const [audioLoaded, setAudioLoaded] = useState<boolean>(false)

  const handleAudioLoaded = () => {
    setAudioLoaded(true)
  }

  useEffect(() => {
    const loadSrc = async () => {
      try {
        const fileURL: string = `asset:///asset?rel=${asset.relative_path}&abs=${asset.absolute_path}`        
        setSrc(fileURL)
      }
      catch (err) {
        console.error("Failed to resolve audio path:", err)
      }
    }

    loadSrc()    
    
  }, [asset.absolute_path, asset.relative_path])

  // TODO: make this more elegant
  if(!src){ return <div>LOADING</div>}

  return (
      <div className='new-audio-asset'>
        <div className='new-audio-asset-left'>
          <input type='checkbox' />
          <audio ref={audioRef} src={src} onLoadedData={handleAudioLoaded} />
          {asset.filename}
        </div>
        <div className='new-audio-asset-right'>
          <AudioControls audioRef={audioRef} audioLoaded={audioLoaded} />
        </div>
      </div>
  )
}

export default NewAudioAsset