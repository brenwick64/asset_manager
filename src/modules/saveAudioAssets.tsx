type SaveAudioAssetPayload = {
    savedAssets: NewAudioAsset[]
    rejectedAssets: NewAudioAsset[]
}

export const saveAudioAsset = async (audioAssets: NewAudioAsset[]): Promise<Result<SaveAudioAssetPayload>> => {
    const savedAssets: NewAudioAsset[] = []
    const rejectedAssets: NewAudioAsset[] = []

    try{
        for(const asset of audioAssets) {
            const fsSaved: boolean = await window.fs.write_audio_file(asset) 
            
            if(!fsSaved){
                rejectedAssets.push(asset)
                continue
            }
    
            const dbSaved: boolean = await window.db.save_audio_asset(asset)
            if(!dbSaved) {
                rejectedAssets.push(asset)
                continue
            }
    
            savedAssets.push(asset)
        }

        await new Promise(resolve => setTimeout(resolve, 250)) // TODO: just to test loading screen logic
        return { payload: { savedAssets: savedAssets, rejectedAssets: rejectedAssets }, error: null }
    }
    catch(err) {
        return { payload: null, error: err instanceof Error ? err : Error("Server Error: saveAudioAsset") }
    }
}
