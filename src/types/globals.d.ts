declare global {
	interface Window {
		asset_paths: {
			get_file_url: (absoluteRoot: string, relative: string) => Promise<string>
		},
		db: {
			get_new_audio_asset: (audioAssets: AudioAsset) => Promise<AudioAsset[]>
			save_audio_asset: (fileEntries: AudioAsset) => Promise<Result>
		},
		fs: {
			write_audio_file: (assets: NewAudioAsset) => Promise<Result>
		},
		local_storage: {
			get_audio_tags: () => Promise<string[]>
			set_audio_tags: (tags: string[]) => Promise<Result>
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
