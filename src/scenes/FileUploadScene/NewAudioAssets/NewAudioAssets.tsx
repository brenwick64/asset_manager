import './NewAudioAssets.css'
import { useState, useEffect } from 'react'
import { MAX_ASSETS_PER_PAGE } from '../../../globals/constants'
import { usePaginateAssets } from '../../../hooks/usePaginateAssets'
// Child Components
import TagsManager from './TagsManager/TagsManager'
import NewAudioAsset from './NewAudioAsset/NewAudioAsset'
import PaginationControls from './PaginationControls/PaginationControls'
import SaveAssetsBtn from './SaveAssetsBtn/SaveAssetsBtn'

type Props = {
    assets: AudioAsset[]
    assetsLoaded: boolean,
    setAssetsLoaded: React.Dispatch<React.SetStateAction<boolean>>
    resetScene: () => void
}

function normalizeAssets(assets: AudioAsset[]): NewAudioAsset[] {
  return assets.map((a: AudioAsset): NewAudioAsset => ({
    ...a,
    is_checked: false,
    tags: [],
  }))
}

function NewAudioAssets({ assets, assetsLoaded, setAssetsLoaded, resetScene }: Props) {
    //TODO: turn this into a saved cache
    const DEBUG_TAGS = ['duck', 'quack', 'bird', 'bird_call']

    const [newAssets, setNewAssets] = useState<NewAudioAsset[]>(normalizeAssets(assets))
    const { paginationController } = usePaginateAssets(newAssets, MAX_ASSETS_PER_PAGE)
    const [tags, setTags] = useState<string[]>(DEBUG_TAGS)
    
    let assetsLoadedCount: number = 0

    useEffect(() => {
        setNewAssets(normalizeAssets(assets))
    }, [assets])

    const onSaveAssets = (): void => {
        const unsavedAssets: NewAudioAsset[] = newAssets.filter(asset => {            
            return asset.is_checked === false
        })
        if(unsavedAssets.length <= 0) { resetScene() } // Reset scene after all files are saved
        else {
            setNewAssets(unsavedAssets)
            paginationController.setPageNumber(1)
        }
    }

    const onCheckAll = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const isChecked: boolean = e.target.checked
        setNewAssets(prev => prev.map((a: NewAudioAsset) => ({ ...a, is_checked: isChecked })))
    }

    // Audio Asset event handlers
    const onAssetChecked = (filename: string): void => {        
        setNewAssets(prev => prev.map((a: NewAudioAsset) => (a.filename === filename ? { ...a, is_checked: !a.is_checked }: a)))
    }

    const onAssetLoaded = (): void => {
        assetsLoadedCount += 1
        if(assetsLoadedCount >= newAssets.length){
            setAssetsLoaded(true)
        }
    }


    return (
        <div className={assetsLoaded ? 'scene' : 'hidden'}>
            <TagsManager tags={tags} setTags={setTags} />
            <div className='new-audio-assets'>
                <div className='audio-asset-header'>
                    <div className='audio-asset-header-left'>
                        <input type='checkbox' onChange={(e) => onCheckAll(e)}></input>
                        <p>File Name</p>
                    </div>
                    <div className='audio-asset-header-right'>Audio Player</div>
                </div>
                {newAssets.map((asset: NewAudioAsset, index: number) => {
                    return <NewAudioAsset 
                                key={asset.filename} 
                                asset={asset} 
                                index={index} 
                                visibleIndexes={paginationController.visibleIndexes} 
                                onAssetChecked={onAssetChecked} 
                                onAssetLoaded={onAssetLoaded}
                            />
                })}
            </div>
            <SaveAssetsBtn onSaveAssets={onSaveAssets} />
            <PaginationControls controller={paginationController} />
        </div>
    )
}

export default NewAudioAssets