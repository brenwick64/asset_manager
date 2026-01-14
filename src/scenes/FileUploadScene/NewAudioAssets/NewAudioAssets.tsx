import './NewAudioAssets.css'
import { useState, useEffect } from 'react'
import { MAX_ASSETS_PER_PAGE } from '../../../globals/constants'
import { usePaginateAssets } from '../../../hooks/usePaginateAssets'
// Child Components
import NewAudioAsset from './NewAudioAsset/NewAudioAsset'
import PaginationControls from './PaginationControls/PaginationControls'
import SaveAssetsBtn from './SaveAssetsBtn/SaveAssetsBtn'

type Props = {
    assets: AudioAsset[]
}

function normalizeAssets(assets: AudioAsset[]): AudioAsset[] {
  return assets.map(a => ({
    ...a,
    is_checked: false,
  }))
}

function NewAudioAssets({ assets }: Props) {
    const [tags, setTags] = useState<string[]>([])
    const [newAssets, setNewAssets] = useState<AudioAsset[]>(assets)
    const { paginationController } = usePaginateAssets(newAssets, MAX_ASSETS_PER_PAGE)
    //TODO: Maybe mutate AudioAsset's data model to NewAudioAsset with additional fields

    // keep assets in sync if parent provides new assets
    useEffect(() => {
        setNewAssets(normalizeAssets(assets))
    }, [assets])

    const onSaveAssets = (): void => {
        const unsavedAssets: AudioAsset[] = newAssets.filter(asset => {            
            return asset.is_checked === false
        })
        setNewAssets(unsavedAssets)
        paginationController.setPageNumber(1)
    }

    const onCheckAll = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const isChecked: boolean = e.target.checked
        setNewAssets(prev => prev.map((a: AudioAsset) => ({ ...a, is_checked: isChecked })))
    }

    const onAssetChecked = (filename: string): void => {        
        setNewAssets(prev => prev.map((a: AudioAsset) => (a.filename === filename ? { ...a, is_checked: !a.is_checked }: a)))
    }


    return (
    <div className='scene'>
        <div className='new-audio-assets'>
            <div className='audio-asset-header'>
                <div className='audio-asset-header-left'>
                    <input type='checkbox' onChange={(e) => onCheckAll(e)}></input>
                    <p>File Name</p>
                </div>
                <div className='audio-asset-header-right'>Audio Player</div>
            </div>
            {newAssets.map((asset: AudioAsset, index: number) => {
                return <NewAudioAsset 
                            key={asset.filename} 
                            asset={asset} 
                            index={index} 
                            visibleIndexes={paginationController.visibleIndexes} 
                            onAssetChecked={onAssetChecked} 
                        />
            })}
        </div>
        <SaveAssetsBtn onSaveAssets={onSaveAssets} />
        <PaginationControls controller={paginationController} />
    </div>
    )
}

export default NewAudioAssets