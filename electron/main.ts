import path from 'node:path'
import { app, Menu, protocol, net } from 'electron'
import { fileURLToPath, pathToFileURL } from 'node:url'

// Custom Modules
import { createWindow } from './window'
import { registerIPC } from './ipc'
import { initDatabase } from './db'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
process.env.APP_ROOT = path.join(__dirname, '..')

protocol.registerSchemesAsPrivileged([
	// Create a custom protocol to allow for file exchange via network protocols (not disk) (outside of chromium runtime)
  { scheme: "asset", privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true } }
])

app.whenReady().then( async () => {

  // This tells Electron to reroute all asset:// calls to this process handler
  protocol.handle("asset", async (request) => {	
	const url: URL = new URL(request.url)
	// Extract root URL
	const abs: string | null = url.searchParams.get("abs")
	const rel: string | null = url.searchParams.get("rel")
	if (!abs || !rel) return new Response("Missing either abs or rel params in URL", { status: 400 })
	// Construct full file URL
	const full: string = path.join(abs, rel)

    // IMPORTANT: use Electron net.fetch, not global fetch	
    return net.fetch(pathToFileURL(full).toString())
  })

    // Main Flow
	Menu.setApplicationMenu(null) // removes the menu bar (File, Edit, etc.)
	const { payload, error } = await initDatabase()
	if(!error) {
		registerIPC()
		createWindow()
	}
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})
