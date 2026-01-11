import path from "node:path";
import { BrowserWindow, app, ipcMain, protocol, net, Menu } from "electron";
import { fileURLToPath, pathToFileURL } from "node:url";
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
    return { error: null, payload: "Database initialized successfully at: " + dbPath };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    return { error, payload: null };
  }
}
function registerIPC() {
  ipcMain.handle("audio_assets:get_new", async (event, data) => {
    const createTempTable = (db22) => {
      const tempTableName2 = `temp_names_${Date.now()}_${Math.floor(Math.random() * 1e9)}`;
      db22.exec(`CREATE TABLE ${tempTableName2} (
						name TEXT PRIMARY KEY
					);
			`);
      return tempTableName2;
    };
    const queryNewNames = (db22, nameList, tempTableName2) => {
      const insert = db22.prepare(`INSERT OR IGNORE INTO ${tempTableName2} (name) VALUES (?)`);
      for (const name of nameList) {
        insert.run(name);
      }
      const rows = db22.prepare(`
				SELECT t.name
				FROM ${tempTableName2} t
				LEFT JOIN audio_assets a ON a.original_filename = t.name
				WHERE a.original_filename IS NULL
			`).all();
      return rows.map((r) => r.name);
    };
    const dropTempTable = (db22, tempTableName2) => {
      db22.exec(`DROP TABLE IF EXISTS ${tempTableName2}`);
    };
    const db2 = getDatabase();
    if (!db2) throw new Error("DB not initialized");
    const keyList = data.map((asset) => asset.filename);
    const tempTableName = createTempTable(db2);
    const newNames = queryNewNames(db2, keyList, tempTableName);
    dropTempTable(db2, tempTableName);
    return data.filter((asset) => {
      return newNames.includes(asset.filename);
    });
  });
  ipcMain.handle("audio_assets:save_db", (event, data) => {
    let insertCount = 0;
    let rejectCount = 0;
    try {
      const db2 = getDatabase();
      if (!db2) throw new Error("DB not initialized");
      const insertStmt = db2.prepare(`
				INSERT INTO AUDIO_ASSETS(
					original_filename,
					content_type,
					file_extension,
					storage_uri
				)
				VALUES(
					@filename,
					@content_type,
					@file_extension,
					@storage_uri
				)
			`);
      const insertMany = db2.transaction((assets) => {
        for (const asset of assets) {
          const response = insertStmt.run(asset);
          if (response) {
            insertCount += 1;
          } else {
            rejectCount += 1;
          }
        }
      });
      insertMany(data);
      return { payload: { inserted: insertCount, rejected: rejectCount }, error: null };
    } catch (err) {
      return { payload: null, error: err instanceof Error ? err : Error("Error") };
    }
  });
  ipcMain.handle("file:test", (event, data) => {
    console.log(pathToFileURL(data).toString());
    return pathToFileURL(data).toString();
  });
}
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname$1, "..");
protocol.registerSchemesAsPrivileged([
  // Create a custom protocol to allow for file exchange via network protocols (not disk) (outside of chromium runtime)
  { scheme: "asset", privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true } }
]);
app.whenReady().then(async () => {
  protocol.handle("asset", async (request) => {
    const u = new URL(request.url);
    const LIB_ROOT = "C:\\Users\\brenw\\Desktop\\coins_audio";
    const rel = decodeURIComponent(`${u.hostname}${u.pathname}`).replace(/^\/+/, "");
    const full = path.join(LIB_ROOT, rel);
    const seggs = await pathToFileURL(full).toString();
    console.log(seggs);
    return net.fetch(pathToFileURL(full).toString());
  });
  Menu.setApplicationMenu(null);
  const { payload, error } = await initDatabase();
  if (!error) {
    registerIPC();
    createWindow();
  }
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
