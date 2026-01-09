declare global {
	interface Window {
		db: {
			list_assets: () => Promise<JSONString>
		},
		api: {
			save_file: (data: string) => void
		}
	}
}

declare global {
	type JSONString = string & { readonly __json: unique symbol }
}

// Filetype Typing
declare global {
	type FileCategory = "audio" | "image"
}

export {}
