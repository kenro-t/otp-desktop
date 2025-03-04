import { useState, useEffect } from 'react'

import { performanceToUnixTime } from '../../../lib/utils/time'

export const useTimer = () => {
  const [now, setNow] = useState(performanceToUnixTime(performance))
  const [timeKey, setTimeKey] = useState(0)

  useEffect(() => {
    let animationFrameId: number
    let lastUpdate = performanceToUnixTime(performance)

    const updateTime = () => {
      const currentTime = performanceToUnixTime(performance)
      const elapsed = currentTime - lastUpdate

      if (elapsed >= 100) {
        setNow(currentTime)
        lastUpdate = currentTime

        if (Math.floor(currentTime / 1000) % 30 === 0) {
          setTimeKey((prev) => prev + 1)
        }
      }

      animationFrameId = requestAnimationFrame(updateTime)
    }

    animationFrameId = requestAnimationFrame(updateTime)
    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  return {
    timeKey,
    getRemainingTime: () => {
      const currentTime = now / 1000
      return 30 - (currentTime % 30)
    }
  }
}