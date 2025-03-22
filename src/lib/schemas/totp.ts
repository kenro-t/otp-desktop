import { z } from 'zod'
import log from 'electron-log'

// Base32バリデーション（大文字小文字を無視、パディング付き対応）
const base32Regex = /^[A-Z2-7]+=*$/i

// OTPAuth URIスキーマ
const otpAuthSchema = z
  .object({
    type: z.literal('totp'), // typeがtotpか確認
    label: z.object({
      issuer: z.string().min(1), // ラベルのIssuer（空文字禁止）
      user: z.string().min(1) // ユーザー名（空文字禁止）
    }),
    secret: z.string({
      required_error: 'Secret is required'
    }).regex(base32Regex, {
      message: 'Invalid Base32 format'
    }),
    issuer: z.string().min(1).optional()
  })
  .refine(
    (data) => !data.issuer || data.label.issuer === data.issuer,
    'Issuer in query does not match label issuer'
  )

export function parseAndValidateOtpAuthUri(uri: string): z.infer<typeof otpAuthSchema> {
  try {
    const url = new URL(uri)

    // プロトコルチェック
    if (url.protocol !== 'otpauth:') throw new Error('Invalid protocol')
    if (url.hostname !== 'totp') throw new Error('Invalid type')

    // ラベル部の処理
    const decodedPath = decodeURIComponent(url.pathname.slice(1))
    const colonIndex = decodedPath.indexOf(':')
    
    if (colonIndex === -1) throw new Error('Invalid label format')
    
    const labelIssuer = decodedPath.slice(0, colonIndex)
    const user = decodedPath.slice(colonIndex + 1)

    // クエリパラメータ
    const secret = url.searchParams.get('secret')
    const issuer = url.searchParams.get('issuer')

    // オブジェクト構築
    const parsedData = {
      type: 'totp',
      label: { issuer: labelIssuer, user },
      secret,
      issuer: issuer ?? undefined // undefinedに統一
    }

    return otpAuthSchema.parse(parsedData)

  } catch (error) {
    if (error instanceof Error) {
      log.error(`OTPAuth URI Validation Failed: ${error.message}\n${error.stack}`)
      throw new Error(`OTPAuth URI Validation Failed: ${error.message}`); // Re-throw with original message
    }
    log.error(`Unknown error occurred: ${JSON.stringify(error)}`)
    throw new Error('OTPAuth URI Validation Failed: An unknown error occurred'); // Use a more specific error message
  }
}