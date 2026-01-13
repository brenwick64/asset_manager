import './NewAudioAssets.css'
import { useState } from 'react'
import { MAX_ASSETS_PER_PAGE } from '../../../globals/constants'
import { usePaginateAssets } from '../../../hooks/usePaginateAssets'
import NewAudioAsset from './NewAudioAsset/NewAudioAsset'
import PaginationControls from './PaginationControls/PaginationControls'

type Props = {
    assets: AudioAsset[]
}

function NewAudioAssets({ assets }: Props) {
    const [checked, setChecked] = useState<boolean>(false)
    const { paginationData, paginationController } = usePaginateAssets(assets, MAX_ASSETS_PER_PAGE)

    return (
    <div className='scene'>
        <div className='new-audio-assets'>
            <div className='audio-asset-header'>
                <div className='audio-asset-header-left'>
                    <input type='checkbox' defaultChecked={checked}></input>
                    <p>File Name</p>
                </div>
                <div className='audio-asset-header-right'>Audio Player</div>
            </div>
            {paginationData.map((asset: AudioAsset) => {
                return <NewAudioAsset key={asset.filename} asset={asset} />
            })}
        </div>
        <PaginationControls controller={paginationController} />
    </div>
    )
}

export default NewAudioAssets