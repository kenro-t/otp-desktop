import { safeStorage } from 'electron'
import Store from 'electron-store'
import log from 'electron-log'

// ストアのスキーマ定義
interface SecureStoreSchema {
  encryptedKeys: {
    [key: string]: string
  }
}

export class SecureKeyStorage {
  private store: Store<SecureStoreSchema>

  constructor() {
    this.store = new Store<SecureStoreSchema>({
      schema: {
        encryptedKeys: {
          type: 'object',
          default: {}
        }
      }
    })
  }

  // 秘密鍵を暗号化して保存
  saveKey(keyId: string, secretKey: string): boolean {
    try {
      if (!safeStorage.isEncryptionAvailable()) {
        log.error('Encryption is not available')
        throw new Error('Encryption is not available')
      }

      // OSのセキュアストレージを使用して暗号化
      const encryptedBuffer = safeStorage.encryptString(secretKey)

      // Base64エンコードして保存
      const base64Encoded = encryptedBuffer.toString('base64')

      // 既存のキーを取得し、新しいキーを追加
      const encryptedKeys = this.store.get('encryptedKeys')
      encryptedKeys[keyId] = base64Encoded
      this.store.set('encryptedKeys', encryptedKeys)

      return true
    } catch (error) {
      log.error('鍵の保存に失敗しました:', error)
      return false
    }
  }

  // 秘密鍵を取得して復号
  getKey(keyId: string): string | null {
    try {
      const encryptedKeys = this.store.get('encryptedKeys')
      const base64Encoded = encryptedKeys[keyId]

      if (!base64Encoded) {
        return null
      }

      // Base64からバッファに戻す
      const encryptedBuffer = Buffer.from(base64Encoded, 'base64')

      // 復号
      return safeStorage.decryptString(encryptedBuffer)
    } catch (error) {
      log.error('鍵の取得に失敗しました:', error)
      return null
    }
  }

  // 秘密鍵を削除
  deleteKey(keyId: string): boolean {
    try {
      const encryptedKeys = this.store.get('encryptedKeys')
      if (keyId in encryptedKeys) {
        delete encryptedKeys[keyId]
        this.store.set('encryptedKeys', encryptedKeys)
        return true
      }
      return false
    } catch (error) {
      log.error('鍵の削除に失敗しました:', error)
      return false
    }
  }

  // 保存されているすべてのキーIDを取得
  getAllKeyIds(): string[] {
    try {
      const encryptedKeys = this.store.get('encryptedKeys')
      return Object.keys(encryptedKeys)
    } catch (error) {
      log.error('キーIDの取得に失敗しました:', error)
      return []
    }
  }
}
