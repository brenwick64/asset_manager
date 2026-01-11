import './NewAudioAssets.css'
import NewAudioAsset from './NewAudioAsset/NewAudioAsset'

type Props = {
    assets: AudioAsset[]
}

function NewAudioAssets({ assets }: Props) {
  return (
    <div className='scene'>
        <div className='new-audio-assets'>
            {assets.map((asset: AudioAsset) => {
                return <NewAudioAsset key={asset.filename} asset={asset} />
            })}
        </div>
    </div>
  )
}

export default NewAudioAssets