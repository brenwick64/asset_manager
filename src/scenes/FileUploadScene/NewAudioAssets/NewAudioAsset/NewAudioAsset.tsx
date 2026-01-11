import './NewAudioAsset.css'
import { useState, useEffect, useRef } from 'react'
import AudioControls from '../../../../components/AudioControls/AudioControls'

type Props = {
    asset: AudioAsset
}

function NewAudioAsset({ asset }: Props) {
  const [src, setSrc] = useState<string>()

  useEffect(() => {

    const loadSrc = async () => {
      try {
        const fileURL: string = `asset:///${asset.absolute_path}${asset.relative_path}`
        console.log('fileURL in NewAudioAsset: ' + fileURL);
        
        // const fileSrc: string = await window.asset_paths.get_file_url(asset.absolute_path, asset.relative_path)
        setSrc(fileURL)
      }
      catch (err) {
        console.error("Failed to resolve audio path", err)
      }
    }
    loadSrc()    
    
  }, [asset.absolute_path, asset.relative_path])


  if(!src){ return <div>LOADING</div>}

  return (
        <div className='new-audio-asset'>
        {/* <audio controls src='asset:///Coins/Loops/Coin%20Counter%20Loop%2001.wav' /> */}
        <audio controls src={src} />
        {asset.filename}
        {/* <AudioControls /> */}
    </div>
  )
}

export default NewAudioAsset