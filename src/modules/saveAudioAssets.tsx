export const saveAudioAsset = async (audioAssets: NewAudioAsset[]): Promise<Result<unknown>> => {

    const saveDB = async (assets: NewAudioAsset[]): Promise<Result<unknown>> => {
        try {
            const result: Result<unknown> = await window.db.save_audio_assets(assets)
            return { payload: result, error: null }
        }
        catch(err) {
            return { payload: null, error: err instanceof Error ? err : Error('saveAudioAsset error: cannot save to DB') }
        }
    }

    const saveFS = async (assets: NewAudioAsset[]): Promise<Result<unknown>> => {
        try {
            const result: Result<unknown> = await window.fs.write_audio_files(assets)


        }
        catch(err) {

        }

        return { payload: null, error: null }
    }

    // main workflow
    // const dbResult: Result<unknown> = await saveDB(audioAssets)    
    const fsResult: Result<unknown> = await saveFS(audioAssets)

    await new Promise(resolve => setTimeout(resolve, 250)) // TODO: just to test loading screen logic


    return { payload: null, error: null }
}