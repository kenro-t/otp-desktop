import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { ipcMain, app, BrowserWindow } from 'electron';

// ESモジュール用のディレクトリパス取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.whenReady().then(() => {
  // IPCハンドラの登録
  ipcMain.handle('ping', () => 'pong');

  const browserWindow = new BrowserWindow({
    width: 800,
    height: 1200,
    webPreferences: {
      preload: join(__dirname, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false,  // 明示的に無効化
      // sandbox: true,  // セキュリティを高めるために sandbox オプションも使う
    }
  });

  browserWindow.loadFile('./dist/index.html');
});