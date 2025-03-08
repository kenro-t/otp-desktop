import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { getAccounts, registerAccount, unregisterAccount, Account } from './ipc-handlers/totp'
import { createWatchedAccounts } from './utils'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 670,
    // width: 1200,
    // height: 670,
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

  // DOM が読み込まれたらアカウント情報を取得して監視する
  let accounts: Account[] = []
  let watchedAccounts: Account[] = []
  mainWindow.webContents.on('dom-ready', async () => {
    // 初回起動時
    accounts = await getAccounts()
    mainWindow.webContents.send('/accounts', accounts)

    // オブジェクト変更検知用Proxy
    watchedAccounts = createWatchedAccounts(accounts, mainWindow)

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

  // アカウントの登録
  ipcMain.handle('/account/register', async (_, uri: string) => {
    // 登録処理
    if (!(await registerAccount(uri))) {
      throw new Error('アカウントの登録に失敗しました')
    }

    // レンダラーのアカウント一覧表示を更新
    accounts = await getAccounts()
    mainWindow.webContents.send('/accounts', accounts)

    // メインの監視対象を更新
    watchedAccounts = createWatchedAccounts(accounts, mainWindow)

    return true
  })

  // アカウントの削除
  ipcMain.handle('/account/unregister', async (_, id: string) => {
    // 削除処理
    if (!(await unregisterAccount(id))) {
      throw new Error('アカウントの削除に失敗しました')
    }

    // 削除後、レンダラーのアカウント一覧を更新する
    accounts = await getAccounts()
    mainWindow.webContents.send('/accounts', accounts)

    return true
  })

  // アラート表示
  ipcMain.handle('/show-alert', (_, ...messages) => {
    dialog.showErrorBox('error', messages.join('\n'))
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  mainWindow.on('close', () => {
    ipcMain.removeHandler('/account/register')
    ipcMain.removeHandler('/account/unregister')
    ipcMain.removeHandler('/show-alert')
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
