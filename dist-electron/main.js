import { BrowserWindow, app, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const __dirname$2 = path.dirname(fileURLToPath(import.meta.url));
function create_window() {
  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname$2, "preload.mjs"),
      contextIsolation: true
    }
  });
  return win;
}
const require$1 = createRequire(import.meta.url);
const Database = require$1("better-sqlite3");
let db = null;
function get_db() {
  if (!db) throw new Error("DB not initialized");
  return db;
}
function init_db() {
  const db_path = path.join(app.getPath("userData"), "asset_manager.db");
  db = new Database(db_path);
  get_db().exec(`
		CREATE TABLE IF NOT EXISTS notes (
			id INTEGER PRIMARY KEY,
			text TEXT NOT NULL,
			created_at TEXT NOT NULL DEFAULT (datetime('now'))
		);
	`);
  console.info("Database initialized at", db_path);
}
function register_ipc() {
  ipcMain.handle("notes:list", () => {
    return get_db().prepare("SELECT * FROM notes ORDER BY id DESC").all();
  });
  ipcMain.handle("notes:add", (_event, text) => {
    return get_db().prepare("INSERT INTO notes (text) VALUES (?)").run(text);
  });
}
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname$1, "..");
app.whenReady().then(() => {
  init_db();
  register_ipc();
  create_window();
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  var _a, _b;
  if (((_b = (_a = BrowserWindow).getAllWindows) == null ? void 0 : _b.call(_a).length) === 0) {
    create_window();
  }
});
