import './NewAudioAsset.css'
import { useState, useEffect, useRef } from 'react'
import AudioControls from '../../../../components/AudioControls/AudioControls'

type Props = {
    asset: AudioAsset
    index: number
    visibleIndexes: number[]
    onAssetChecked: (filename: string) => void
}

function NewAudioAsset({ asset, index, visibleIndexes, onAssetChecked }: Props) {
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
    
  }, [asset.absolute_path, asset.relative_path, asset.is_checked])

  // TODO: make this more elegant
  if(!src){ return <div className={visibleIndexes.includes(index) ? '' : 'hidden'}>LOADING</div>}

  return (
    // <div className='new-audio-asset'>
    <div className={visibleIndexes.includes(index) ? 'new-audio-asset' : 'new-audio-asset hidden'}>
        <div className='new-audio-asset-left'>
          <input type='checkbox' checked={asset.is_checked} onChange={() => onAssetChecked(asset.filename)} />
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