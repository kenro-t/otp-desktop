interface Performance {
  timeOrigin: number
  now(): number
}

// performanceToUnixTime は performanceオブジェクトをUnix時間に変換する関数
export function performanceToUnixTime(performance: Performance): number {
  const timeOrigin = performance.timeOrigin
  const now = performance.now()
  return timeOrigin + now
}
