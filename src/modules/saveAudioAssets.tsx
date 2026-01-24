import { normalizeAbsolutePath } from "../utils/fileUploadUtils"

type SaveAudioAssetPayload = {
    savedAssets: NewAudioAsset[]
    rejectedAssets: NewAudioAsset[]
}

type WriteAudioFilePayload = {
    saved: boolean
    absolutePath: string
}

export const saveAudioAsset = async (audioAssets: NewAudioAsset[]): Promise<Result<SaveAudioAssetPayload>> => {
    const savedAssets: NewAudioAsset[] = []
    const rejectedAssets: NewAudioAsset[] = []

    try{
        for(const asset of audioAssets) {
            // Save asset to disk
            const fsPayload: WriteAudioFilePayload = await window.fs.write_audio_file(asset) 
            if(!fsPayload.saved){
                rejectedAssets.push(asset)
                continue
            }

             // Update absolute path with new location
            asset.absolute_path = normalizeAbsolutePath(fsPayload.absolutePath)

            // Save asset to DB
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
