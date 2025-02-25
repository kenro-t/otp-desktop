import * as OTPAuth from 'otpauth'

import { performanceToUnixTime } from '../../shared/utils/time'

// Account はアカウント情報を表す型
interface Account {
  id: string
  serviceName: string
  token: string
}

interface TOTP extends OTPAuth.TOTP {
  id: string
  serviceName: string
}

export function getAccounts(): Promise<Account[]> {
  // Create a new TOTP object.
  let totp = new OTPAuth.TOTP({
    issuer: 'ACME',
    label: 'Alice',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: 'US3WHSG7X5KAPV27VANWKQHF3SH3HULL' // dummy secret
  })
  let token = totp.generate({ timestamp: performanceToUnixTime(performance) })

  const accounts = [{ id: '1', serviceName: 'GitHub Account', token: token }]

  return new Promise<Account[]>((resolve) => {
    resolve(accounts)
  })
}
