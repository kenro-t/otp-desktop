import { useState, useEffect } from "react";

export const useTimer = (interval = 1000) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return { now, getRemainingTime: () => 30 - Math.floor((now / 1000) % 30) };
};
