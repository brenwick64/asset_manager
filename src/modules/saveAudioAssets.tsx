type FSPayload = {
    saved: NewAudioAsset[]
    failed: NewAudioAsset[]
}

type DBPayload = {
    inserted: number
    rejected: number
}

type SaveAudioAssetPayload = {
    fsResponse: Result<FSPayload>
    dbResponse: Result<DBPayload>
}


export const saveAudioAsset = async (audioAssets: NewAudioAsset[]): Promise<Result<unknown>> => {

    const saveDB = async (assets: NewAudioAsset[]): Promise<Result<DBPayload>> => {
        const result: Result<DBPayload> = await window.db.save_audio_assets(assets)  
        return result
    }

    const saveFS = async (assets: NewAudioAsset[]): Promise<Result<FSPayload>> => {
        const result: Result<FSPayload> = await window.fs.write_audio_files(assets)
        return result
    }

    // main workflow
    const dbResult: Result<DBPayload> = await saveDB(audioAssets)    
    const fsResult: Result<FSPayload> = await saveFS(audioAssets)


    await new Promise(resolve => setTimeout(resolve, 250)) // TODO: just to test loading screen logic

    const payload: SaveAudioAssetPayload = { fsResponse: fsResult, dbResponse: dbResult }
    return { payload: payload, error: null }
}