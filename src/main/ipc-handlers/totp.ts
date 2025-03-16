import * as OTPAuth from 'otpauth'
import Store from 'electron-store'
import log from 'electron-log'

import { performanceToUnixTime } from '../../lib/utils/time'
import { SecureKeyStorage } from '../lib/SecureKeyStorage'

// Account はアカウント情報を表す型
export interface Account {
  id: string
  serviceName: string
  token?: string
}

interface TOTP extends OTPAuth.TOTP {
  id: string
  serviceName: string
}

export async function getAccounts(): Promise<Account[]> {
  // OTPAuthスキーマ
  const store = new Store<OTPAuthSchema>({
    schema: {
      services: {
        type: 'object',
        default: {}
      }
    }
  })

  const secureKeyStorage = new SecureKeyStorage()

  const TOTPAccounts: TOTP[] = Object.entries(store.get('services')).map(([key, value]) => {
    const secret = secureKeyStorage.getKey(key)
    if (!secret) {
      return
    }

    return Object.assign(
      new OTPAuth.TOTP({
        issuer: value.issuer,
        label: value.serviceName,
        algorithm: 'SHA1',
        digits: value.digits,
        period: value.period,
        secret: OTPAuth.Secret.fromBase32(secret)
      }),
      {
        id: key,
        serviceName: value.serviceName
      }
    )
  }) as TOTP[]

  const accounts = TOTPAccounts.map((totp) => ({
    id: totp.id,
    serviceName: totp.serviceName,
    token: totp.generate({ timestamp: performanceToUnixTime(performance) })
  }))

  return new Promise<Account[]>((resolve) => {
    resolve(accounts)
  })
}

interface OTPAuthData {
  serviceName: string
  issuer?: string
  method: 'totp' | 'hotp'
  algorithm?: 'SHA1' | 'SHA256' | 'SHA512'
  digits?: number
  period?: number
}

interface OTPAuthSchema {
  services: {
    [key: string]: OTPAuthData
  }
}

interface OTPAuthParsed extends OTPAuthData {
  secret: string
}

export async function registerAccount(uri: string): Promise<boolean> {
  // uriを解析してOTPAuthDataに変換
  const otpauth = parseOTPAuthURI(uri)
  if (!otpauth) {
    return new Promise<boolean>((resolve) => resolve(false))
  }

  const secureKeyStorage = new SecureKeyStorage()

  // 主キーとなるIDを生成
  const keyId = crypto.randomUUID()

  // 秘密鍵を保存
  try {
    if (!secureKeyStorage.saveKey(keyId, otpauth.secret)) {
      return new Promise<boolean>((resolve) => resolve(false))
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    }
    return new Promise<boolean>((resolve) => resolve(false))
  }

  // OTPAuthスキーマ
  const store = new Store<OTPAuthSchema>({
    schema: {
      services: {
        type: 'object',
        default: {}
      }
    }
  })

  // サービス情報を保存
  try {
    const services = store.get('services')
    services[keyId] = {
      serviceName: otpauth.serviceName,
      issuer: otpauth.issuer,
      method: otpauth.method,
      algorithm: otpauth.algorithm,
      digits: otpauth.digits,
      period: otpauth.period
    }
    store.set('services', services)
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    }
    return new Promise<boolean>((resolve) => resolve(false))
  }

  return new Promise<boolean>((resolve) => resolve(true))
}

export async function unregisterAccount(id: string): Promise<boolean> {
  // OTPAuthスキーマ
  const store = new Store<OTPAuthSchema>({
    schema: {
      services: {
        type: 'object',
        default: {}
      }
    }
  })

  const secureKeyStorage = new SecureKeyStorage()

  try {
    // 秘密鍵を削除
    secureKeyStorage.deleteKey(id)
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    }
    return new Promise<boolean>((resolve) => resolve(false))
  }

  try {
    store.delete(`services.${id}`)
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    }
    return new Promise<boolean>((resolve) => resolve(false))
  }

  return new Promise<boolean>((resolve) => resolve(true))
}

function parseOTPAuthURI(uri: string): OTPAuthParsed | null {
  try {
    const url = new URL(uri)

    // プロトコルとホスト名の検証
    if (url.protocol !== 'otpauth:') return null
    if (!['totp', 'hotp'].includes(url.hostname)) return null

    // パスパラメータの解析
    const serviceName = decodeURI(url.pathname).slice(1)
    if (!serviceName) return null
    const serviceNameRegex = /^[a-zA-Z0-9_-]+$/
    if (!serviceNameRegex.test(serviceName)) return null

    // クエリパラメータの解析
    const params = new URLSearchParams(url.search)
    const secret = params.get('secret')
    const issuer = params.get('issuer')
    const algorithm = params.get('algorithm') as OTPAuthParsed['algorithm']
    const digits = Number(params.get('digits')) || undefined
    const period = Number(params.get('period')) || undefined

    return {
      serviceName,
      secret: secret || '',
      issuer: issuer || undefined,
      method: url.hostname as OTPAuthParsed['method'],
      algorithm,
      digits,
      period
    }
  } catch (error) {
    if (error instanceof Error) {
      log.error(error.message)
    }
    return null
  }
}
