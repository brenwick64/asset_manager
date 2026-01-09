import path from "node:path";
import { BrowserWindow, app, ipcMain, Menu } from "electron";
import { fileURLToPath } from "node:url";
import fs from "fs/promises";
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
const getInitFiles = async () => {
  const basePath = app.isPackaged ? process.resourcesPath : app.getAppPath();
  const fullPath = path.join(basePath, "assets", "sql", "init");
  const files = await fs.readdir(fullPath);
  return files;
};
const getFileData = async (filename) => {
  const basePath = app.isPackaged ? process.resourcesPath : app.getAppPath();
  const fullPath = path.join(basePath, "assets", "sql", "init", filename);
  const fileData = await fs.readFile(fullPath, "utf-8");
  return fileData;
};
const generateSQL = async (filenames) => {
  let sql = "";
  sql += "BEGIN;\n";
  for (const filename of filenames) {
    const fileSQL = await getFileData(filename);
    sql += fileSQL;
  }
  sql += "\nCOMMIT;";
  return sql;
};
const getInitSQL = async () => {
  const initFiles = await getInitFiles();
  const sql = await generateSQL(initFiles);
  return sql;
};
function getDatabase() {
  if (!db) throw new Error("DB not initialized");
  return db;
}
async function initDatabase() {
  try {
    const dbPath = path.join(app.getPath("userData"), "app.db");
    db = new Database(dbPath);
    const sql = await getInitSQL();
    db.exec(sql);
    return { error: null, payload: "OK" };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    return { error, payload: null };
  }
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
