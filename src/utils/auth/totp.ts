import * as crypto from "crypto";

export async function generateTOTP(base32Secret: string): Promise<string> {
  // 1. Base32デコード
  const secret: Uint8Array = base32Decode(base32Secret);

  // 2. タイムカウンター準備
  const counter: number = Math.floor(Date.now() / 30000);
  const counterBuffer: ArrayBuffer = new ArrayBuffer(8);
  new DataView(counterBuffer).setBigUint64(0, BigInt(counter), false);

  // 3. HMAC-SHA1計算
  const hmac: ArrayBuffer = await generateHMAC(secret, counterBuffer);

  // 4. 動的切り捨て
  const truncated: number = dynamicTruncation(hmac);

  // 5. 6桁コード生成
  return generateCode(truncated);
}

function generateCode(truncated: number): string {
  return (truncated % 1000000).toString().padStart(6, "0");
}

function dynamicTruncation(hash: ArrayBuffer): number {
  const view: DataView = new DataView(hash);
  const offset: number = view.getUint8(hash.byteLength - 1) & 0x0f;
  return view.getUint32(offset) & 0x7fffffff;
}

async function generateHMAC(secret: Uint8Array, counterBuffer: ArrayBuffer): Promise<ArrayBuffer> {
  const key: CryptoKey = await crypto.subtle.importKey(
    "raw",
    secret,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );
  return crypto.subtle.sign("HMAC", key, counterBuffer);
}

function base32Decode(base32: string): Uint8Array {
  const alphabet: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  base32 = base32.replace(/=+$/, "").toUpperCase();
  let bits: string = "";
  for (const char of base32) {
    const val: number = alphabet.indexOf(char);
    bits += val.toString(2).padStart(5, "0");
  }
  const bytes: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    bytes.push(parseInt(bits.substr(i, 8), 2));
  }
  return new Uint8Array(bytes);
}
