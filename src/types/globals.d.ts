declare global {
	interface Window {
		db: {
			list_assets: () => Promise<JSONString>
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
