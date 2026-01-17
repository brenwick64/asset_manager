export const saveAudioAsset = async (audioAssets: NewAudioAsset[], tags: string[]): Promise<Result<unknown>> => {
    // helper functions
    const addTags = (assets: NewAudioAsset[], tags: string[]): NewAudioAsset[] => {
        return assets.map((a: NewAudioAsset): NewAudioAsset => ({
        ...a,
        json_tags: JSON.stringify(tags),
        }))
    }

    // main functions
    const saveDB = async (assets: NewAudioAsset[], tags: string[]): Promise<Result<unknown>> => {
        try {
            const taggedAssets: NewAudioAsset[] = addTags(assets, tags)
            const result: Result<unknown> = await window.db.save_audio_assets(taggedAssets)
            return { payload: result, error: null }
        }
        catch(err) {
            return { payload: null, error: err instanceof Error ? err : Error('saveAudioAsset error: cannot save to DB') }
        }
    }

    const saveFS = async (): Promise<Result<unknown>> => {
        return { payload: null, error: null }
    }

    // main workflow
    const dbResult: Result<unknown> = await saveDB(audioAssets, tags)    

    await new Promise(resolve => setTimeout(resolve, 250)) // TODO: just to test loading screen logic


    return { payload: dbResult, error: null }
}