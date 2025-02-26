import * as OTPAuth from 'otpauth'

import { performanceToUnixTime } from '../../shared/utils/time'

// Account はアカウント情報を表す型
interface Account {
  id: string
  serviceName: string
  token?: string
}

interface TOTP extends OTPAuth.TOTP {
  id: string
  serviceName: string
}

export async function getAccounts(): Promise<Account[]> {
  // TOTPアカウントのリストMock
  const TOTPAccounts: TOTP[] = [
    Object.assign(
      new OTPAuth.TOTP({
        issuer: 'ACME',
        label: 'Alice',
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32('US3WHSG7X5KAPV27VANWKQHF3SH3HULL') // dummy secret
      }),
      {
        id: '1',
        serviceName: 'GitHub Account'
      }
    ),
    Object.assign(
      new OTPAuth.TOTP({
        issuer: 'ACME',
        label: 'Alice',
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32('US3WHSG7X5KAPV27VANWKQHF3SH3HULD') // dummy secret
      }),
      {
        id: '2',
        serviceName: 'Google Account'
      }
    )
  ]

  const accounts = TOTPAccounts.map((totp) => {
    return {
      id: totp.id,
      serviceName: totp.serviceName,
      token: totp.generate({ timestamp: performanceToUnixTime(performance) })
    }
  })

  return new Promise<Account[]>((resolve) => {
    resolve(accounts)
  })
}
