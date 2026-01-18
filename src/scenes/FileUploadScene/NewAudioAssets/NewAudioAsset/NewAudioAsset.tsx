import './NewAudioAsset.css'
import { useState, useEffect, useRef } from 'react'
import AudioControls from '../../../../components/AudioControls/AudioControls'

type Props = {
    asset: NewAudioAsset
    index: number
    visibleIndexes: number[]
    onAssetChecked: (filename: string) => void
    onAssetLoaded: () => void
}

function NewAudioAsset({ asset, index, visibleIndexes, onAssetChecked, onAssetLoaded }: Props) {  
  const audioRef: React.MutableRefObject<HTMLAudioElement | null> = useRef(null)
  const [src, setSrc] = useState<string>()

  const extractCSSClasses = (): string => {
    const IS_VISIBLE: boolean = visibleIndexes.includes(index)
    const IS_FIRST_ROW: boolean = index === visibleIndexes[0]
    const cssString: string = `
      new-audio-asset ${IS_VISIBLE ? '' : 'hidden'} ${IS_FIRST_ROW ? 'new-audio-asset-first-row' : ''}
    `
    return cssString
  }

  const handleAudioLoaded = () => {
    onAssetLoaded()
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

  return (
    // <div className='new-audio-asset'>
    <div className={extractCSSClasses()}>
        <div className='new-audio-asset-left'>
          <input type='checkbox' checked={asset.is_checked} onChange={() => onAssetChecked(asset.filename)} />
          <audio ref={audioRef} src={src} onLoadedData={handleAudioLoaded} />
          {asset.filename}
        </div>
        <div className='new-audio-asset-center'>
          <div className='new-asset-tags'>
            {JSON.parse(asset.json_tags).map((tag: string) => {
              return <div className='new-tag' key={tag}>{tag}</div>
            })}
          </div>
        </div>
        <div className='new-audio-asset-right'>
          <AudioControls audioRef={audioRef} />
        </div>
      </div>
  )
}

export default NewAudioAsset