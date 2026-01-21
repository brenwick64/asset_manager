import './NewAudioAssets.css'
import { useState, useEffect } from 'react'
import { MAX_ASSETS_PER_PAGE } from '../../../globals/constants'
import { usePaginateAssets } from '../../../hooks/usePaginateAssets'
import { saveAudioAsset } from '../../../modules/saveAudioAssets'
// Child Components
import TagsManager from './TagsManager/TagsManager'
import NewAudioAsset from './NewAudioAsset/NewAudioAsset'
import PaginationControls from './PaginationControls/PaginationControls'
import SaveAssetsBtn from './SaveAssetsBtn/SaveAssetsBtn'

type Props = {
    loading: boolean
    assets: AudioAsset[]
    setAssetsLoaded: React.Dispatch<React.SetStateAction<boolean>>
    resetScene: () => void
    setIsSaving: React.Dispatch<React.SetStateAction<boolean>>
}

// helper functions
function normalizeAssets(assets: AudioAsset[]): NewAudioAsset[] {
  return assets.map((a: AudioAsset): NewAudioAsset => ({
    ...a,
    is_checked: false,
    json_tags: "[]",
  }))
}

// main
function NewAudioAssets({ loading, assets, setAssetsLoaded, resetScene, setIsSaving }: Props) {
    const [newAssets, setNewAssets] = useState<NewAudioAsset[]>(normalizeAssets(assets))
    const [tags, setTags] = useState<string[]>([])
    const { paginationController } = usePaginateAssets(newAssets, MAX_ASSETS_PER_PAGE)    
    
    let assetsLoadedCount: number = 0

    useEffect(() => {
        const loadTags = async (): Promise<void> => {
            const result: string[] = await window.local_storage.get_audio_tags()            
            setTags(result)
        }

        loadTags()
        setNewAssets(normalizeAssets(assets))
    }, [assets])

    // Tag Functions
    const replaceTags = (): void => {
        const updatedAssets: NewAudioAsset[] = newAssets.map((asset: NewAudioAsset) => {
            if (!asset.is_checked) return asset
            return {
            ...asset,
            json_tags: JSON.stringify(tags),
            }
        })
        setNewAssets(updatedAssets)
    }

    const addNewTags = (): void => {
        const updatedAssets: NewAudioAsset[] = newAssets.map((asset: NewAudioAsset) => {
            if (!asset.is_checked) return asset
            const existingTags: string[] = JSON.parse(asset.json_tags)
            const newTags: string[] = existingTags
            // Add new tags
            tags.forEach((tag: string) => {
                if(!existingTags.includes(tag)){
                    newTags.push(tag)
                }
            })            
            return {
            ...asset,
            json_tags: JSON.stringify(newTags),
            }
        })
        setNewAssets(updatedAssets)
    }

    const resetTags = (): void => {
        const resetAssets: NewAudioAsset[] = newAssets.map((asset: NewAudioAsset) => {
            if (!asset.is_checked) return asset
            return {
                ...asset,
                json_tags: JSON.stringify([])
            }
        })
        setNewAssets(resetAssets)
    }

    // Event Handlers
    const onSaveAssets = async () => {
        setIsSaving(true)
        const checkedAssets: NewAudioAsset[] = newAssets.filter((a: NewAudioAsset) => { return a.is_checked })
        const uncheckedAssets: NewAudioAsset[] = newAssets.filter((a: NewAudioAsset) => { return !a.is_checked })

        if(checkedAssets){
            const { payload, error } = await saveAudioAsset(checkedAssets)
            console.log(payload);
              
            //TODO: error handling        
            setNewAssets(uncheckedAssets)
            paginationController.setPageNumber(1)
        }
        
        setIsSaving(false)
        if(uncheckedAssets.length <= 0){ resetScene(); return; }
    }


    const onCheckAll = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const isChecked: boolean = e.target.checked
        setNewAssets(prev => prev.map((a: NewAudioAsset) => ({ ...a, is_checked: isChecked })))
    }

    const onAssetChecked = (filename: string): void => {        
        setNewAssets(prev => prev.map((a: NewAudioAsset) => (a.filename === filename ? { ...a, is_checked: !a.is_checked }: a)))
    }

    const onAssetLoaded = (): void => {
        assetsLoadedCount += 1
        if(assetsLoadedCount >= newAssets.length){
            setAssetsLoaded(true)
        }
    }

    const onTagsUpdated = async (updatedTags: string[]): Promise<Result<unknown>> => {
        const result = await window.local_storage.set_audio_tags(updatedTags)
        return result
    }

    return (
        <div className={loading ? 'hidden' : 'scene'}>
            <div className='new-audio-assets-container'>
                <div className='audio-asset-header'>
                    <div className='audio-asset-header-left'>
                        <input type='checkbox' onChange={(e) => onCheckAll(e)}></input>
                        <p>File Name</p>
                    </div>
                    <div className='audio-asset-header-right'>Audio Player</div>
                </div>
                <div className='new-audio-assets'>
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
            </div>
            <div className='new-audio-assets-bottom'>
                <TagsManager tags={tags} setTags={setTags} onTagsUpdated={onTagsUpdated} replaceTags={replaceTags} addNewTags={addNewTags} resetTags={resetTags} />
                <SaveAssetsBtn assets={newAssets} onSaveAssets={onSaveAssets} />
                <PaginationControls controller={paginationController} />
            </div>
        </div>
    )
}

export default NewAudioAssets