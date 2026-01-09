declare global {
	interface Window {
		db: {
			get_new_audio_assets: (audioAssets: AudioAsset[]) => Promise<AudioAsset[]>
			save_audio_assets: (fileEntries: JSONString) => Promise<Result>
		}
	}
}

declare global {
	type JSONString = string & { readonly __json: unique symbol }
	type Result<T> = { payload: T | null, error: Error | null }
}

// Filetype Typing
declare global {
	type FileCategory = "audio" | "image"
}

export {}
