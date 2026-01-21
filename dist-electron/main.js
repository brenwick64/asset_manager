import path from "node:path";
import { BrowserWindow, app, ipcMain, protocol, net, Menu } from "electron";
import { fileURLToPath, pathToFileURL } from "node:url";
import fs$1 from "node:fs";
import { mkdir, copyFile } from "node:fs/promises";
import fs from "fs/promises";
import { createRequire } from "node:module";
const __dirname$2 = path.dirname(fileURLToPath(import.meta.url));
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
function createWindow() {
  const win = new BrowserWindow({
    width: 1600,
    height: 1500,
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
				LEFT JOIN audio_assets a ON a.filename = t.name
				WHERE a.filename IS NULL
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
  ipcMain.handle("audio_assets:insert_single", (event, asset) => {
    const db2 = getDatabase();
    if (!db2) throw new Error("Server Error: DB not initialized");
    const insertStmt = db2.prepare(`
			INSERT INTO AUDIO_ASSETS(
				filename,
				content_type,
				file_extension,
				absolute_path,
				relative_path,
				tags
			)
			VALUES(
				@filename,
				@content_type,
				@file_extension,
				@absolute_path,
				@relative_path,
				@json_tags
			)
		`);
    try {
      insertStmt.run(asset);
      return true;
    } catch (err) {
      return false;
    }
  });
  ipcMain.handle("file:get_audio_tags", (event, data) => {
    const audioTagsPath = path.join(
      process.env.APP_ROOT,
      "assets",
      "tags",
      "audio_tags.json"
    );
    if (!fs$1.existsSync(audioTagsPath)) return [];
    const raw = fs$1.readFileSync(audioTagsPath, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.tags) ? parsed.tags : [];
  });
  ipcMain.handle("file:set_audio_tags", (event, data) => {
    const audioTagsPath = path.join(
      process.env.APP_ROOT,
      "assets",
      "tags",
      "audio_tags.json"
    );
    if (!Array.isArray(data)) {
      return { payload: null, error: new Error("Tags payload must be an array") };
    }
    if (!data.every((t) => typeof t === "string")) {
      return { payload: null, error: new Error("All tags must be strings") };
    }
    const tags = [...new Set(
      data.map((t) => t.trim()).filter(Boolean)
    )];
    try {
      fs$1.mkdirSync(path.dirname(audioTagsPath) ? path.dirname(audioTagsPath) : audioTagsPath.replace(/\/[^/]+$/, ""), { recursive: true });
      fs$1.writeFileSync(audioTagsPath, JSON.stringify({ tags }, null, 2), "utf-8");
      return { payload: "Ok", error: null };
    } catch (err) {
      return { payload: null, error: err instanceof Error ? err : new Error("Failed to write tags") };
    }
  });
  ipcMain.handle("file:test", (event, data) => {
    console.log(pathToFileURL(data).toString());
    return pathToFileURL(data).toString();
  });
  ipcMain.handle("fs:write_audio_file", async (event, asset) => {
    const baseDirectory = path.join(app.getPath("userData"), "saved_assets", "audio");
    await mkdir(baseDirectory, { recursive: true });
    const fileNameWithExt = `${asset.filename}.${asset.file_extension}`;
    const sourcePath = path.join(asset.absolute_path, asset.relative_path, fileNameWithExt);
    const destDir = path.join(baseDirectory, asset.relative_path);
    const destPath = path.join(destDir, fileNameWithExt);
    try {
      await mkdir(destDir, { recursive: true });
      await copyFile(sourcePath, destPath);
      return true;
    } catch (err) {
      return false;
    }
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
    const url = new URL(request.url);
    const abs = url.searchParams.get("abs");
    const rel = url.searchParams.get("rel");
    const filename = url.searchParams.get("filename");
    const extension = url.searchParams.get("extension");
    if (!abs || !rel) return new Response("Missing either abs or rel params in URL", { status: 400 });
    const full = path.join(abs, rel, `${filename}.${extension}`);
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
