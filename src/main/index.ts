import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { getAccounts, registerAccount } from './ipc-handlers/totp'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    // width: 900,
    // height: 670,
    width: 1200,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false
    }
  })

  if (is.dev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // DOM が読み込まれたらアカウント情報を取得して監視する
  mainWindow.webContents.on('dom-ready', async () => {
    // 初回起動時
    const accounts = await getAccounts()
    mainWindow.webContents.send('accounts', accounts)

    // オブジェクト変更検知用Proxy
    const watchedAccounts = accounts.map((account) => {
      return new Proxy(account, {
        set(target, prop, value) {
          if (prop === 'token') {
            Reflect.set(target, prop, value)
            mainWindow.webContents.send('accounts', accounts)
            return true
          }
          return Reflect.set(target, prop, value)
        }
      })
    })

    // 500ms ごとにアカウント情報を取得して監視する
    const polling = () => {
      setTimeout(async () => {
        const pollingAccounts = await getAccounts()
        watchedAccounts.map((watchedAccount) => {
          watchedAccount.token = pollingAccounts.find(
            (pollingAccount) => pollingAccount.id === watchedAccount.id
          )?.token
        })
        polling()
      }, 500)
    }
    polling()
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

app.on('ready', async () => {
  await registerAccount()
})
