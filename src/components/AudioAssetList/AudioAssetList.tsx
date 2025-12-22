import './AudioAssetList.css'
import { useEffect, useState } from 'react'
import AudioAssetEntry from '../AudioAssetEntry/AudioAssetEntry'

function AssetList() {
    const [audioAssets, setAudioAssets] = useState<Array<AudioAsset>>([])
    
    async function fetchAssets() {
        const response: JSONString = await window.db.list_assets()
        const audio_assets: Array<AudioAsset> = JSON.parse(response)
        setAudioAssets(audio_assets)
    }

    useEffect(() => {
        fetchAssets()
    })


  return (
    <div>
      <div className="asset-list">
        {audioAssets.map((asset: AudioAsset) => (
          <div key={asset.uuid}>
            <AudioAssetEntry audioAsset={asset} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default AssetList