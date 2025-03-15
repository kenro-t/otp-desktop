import { BrowserWindow } from 'electron'
import { Account } from './ipc-handlers/totp'

export function createWatchedAccounts(accounts: Account[], mainWindow: BrowserWindow): Account[] {
  return accounts.map((account) => {
    return new Proxy(account, {
      set(target, prop, value) {
        if (prop === 'token') {
          Reflect.set(target, prop, value)
          mainWindow.webContents.send('/accounts', accounts)
          return true
        }
        return Reflect.set(target, prop, value)
      }
    })
  })
}
