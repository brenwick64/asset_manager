import path from "node:path";
import { BrowserWindow, app, ipcMain, Menu } from "electron";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const __dirname$2 = path.dirname(fileURLToPath(import.meta.url));
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname$2, "preload.mjs"),
      contextIsolation: true
    }
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname$2, "dist", "index.html"));
  }
  return win;
}
const require$1 = createRequire(import.meta.url);
const Database = require$1("better-sqlite3");
let db = null;
function getDatabase() {
  if (!db) throw new Error("DB not initialized");
  return db;
}
function initDatabase() {
  const db_path = path.join(app.getPath("userData"), "asset_manager.db");
  db = new Database(db_path);
  console.info("Database initialized at", db_path);
}
function registerIPC() {
  ipcMain.handle("assets:list", () => {
    const rows = getDatabase().prepare("SELECT * FROM audio_assets").all();
    return JSON.stringify(rows);
  });
}
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname$1, "..");
app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  initDatabase();
  registerIPC();
  createWindow();
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
