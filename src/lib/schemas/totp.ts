import { z } from 'zod'

// Base32バリデーション用の正規表現（パディングなし）
const base32Regex = /^[A-Z2-7]+$/

// OTPAuth URIのパース済みオブジェクト用スキーマ
const otpAuthSchema = z
  .object({
    type: z.literal('totp'), // typeがtotpか確認
    label: z.object({
      issuer: z.string().min(1), // ラベルのIssuer（空文字禁止）
      user: z.string().min(1) // ユーザー名（空文字禁止）
    }),
    secret: z.string().regex(base32Regex, {
      message: 'Invalid Base32 format for secret'
    }),
    issuer: z.string().min(1) // クエリのIssuer（空文字禁止）
  })
  .refine(
    (data) => data.label.issuer === data.issuer,
    'Issuer in query does not match label issuer'
  )

export function parseAndValidateOtpAuthUri(uri: string): z.infer<typeof otpAuthSchema> | void {
  try {
    const url = new URL(uri)

    // プロトコルとタイプのチェック
    if (url.protocol !== 'otpauth:') throw new Error('Invalid protocol')
    if (url.hostname !== 'totp') throw new Error('Invalid type')

    // ラベルのデコードと分割
    const decodedPath = decodeURIComponent(url.pathname.slice(1))
    const [labelIssuer, ...userParts] = decodedPath.split(':')
    const user = userParts.join(':')

    // クエリパラメータの抽出
    const secret = url.searchParams.get('secret')
    const issuer = url.searchParams.get('issuer')

    // オブジェクトの生成
    const parsedData = {
      type: 'totp',
      label: { issuer: labelIssuer, user },
      secret,
      issuer
    }

    // Zodでバリデーション
    return otpAuthSchema.parse(parsedData)
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Invalid OTPAuth URI: ${error.message}`)
    }
  }
}
