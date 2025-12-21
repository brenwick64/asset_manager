import './AudioAssetList.css'

import { useEffect, useState } from 'react'

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
        {audioAssets.map((asset) => (
          <div key={asset.uuid}>
            {asset.storage_uri}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AssetList