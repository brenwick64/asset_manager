declare global {
	interface Window {
		asset_paths: {
			get_file_url: (absoluteRoot: string, relative: string) => Promise<string>
		},
		db: {
			get_new_audio_assets: (audioAssets: AudioAsset[]) => Promise<AudioAsset[]>
			save_audio_assets: (fileEntries: AudioAsset[]) => Promise<Result>
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
