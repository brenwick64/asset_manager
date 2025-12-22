import './AudioAssetEntry.css'

function AudioAssetEntry({ audioAsset } : { audioAsset: AudioAsset }) {
  return (
    <div className="audio-asset-entry">
      <div className="audio-asset-entry__name">{audioAsset.content_type}</div>
      <div className="audio-asset-entry__storage-uri">{audioAsset.storage_uri}</div>
    </div>
  )
}

export default AudioAssetEntry