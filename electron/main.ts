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
	const u = new URL(request.url)
	const LIB_ROOT = "C:\\Users\\brenw\\Desktop\\coins_audio"
    const rel = decodeURIComponent(`${u.hostname}${u.pathname}`).replace(/^\/+/, "")
    const full = path.join(LIB_ROOT, rel)

    // IMPORTANT: use Electron net.fetch, not global fetch	
	const seggs = await pathToFileURL(full).toString()
	console.log(seggs)
	
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
