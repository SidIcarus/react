// src/hooks/useTimerDisplay.ts

import { useEffect, useState } from "react";

export function useTimerDisplay(startedAt: number | null): number {
  const [elapsed, setElapsed] = useState(() =>
    startedAt ? Date.now() - startedAt : 0
  );

  useEffect(() => {
    if (!startedAt) {
      setElapsed(0);
      return;
    }

    // Set initial value
    setElapsed(Date.now() - startedAt);

    // Update every second
    const interval = setInterval(() => {
      setElapsed(Date.now() - startedAt);
    }, 1000);

    // Cleanup on unmount or when startedAt changes
    return () => clearInterval(interval);
  }, [startedAt]);

  return elapsed;
}
