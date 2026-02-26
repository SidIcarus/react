import { useRef, useState } from "react";

// ============================================================
// PROJECT 4: Stopwatch
// Skills: useRef, the difference between refs and state,
//         interval management, imperative values
// ============================================================

// ============================================================
// THE KEY CONCEPT BEFORE YOU START
// ============================================================
//
// useRef stores a value that:
//   1. Persists across renders (like state)
//   2. Does NOT trigger a re-render when changed (unlike state)
//
// This makes it perfect for things like interval IDs, timer
// handles, or any value you need to "remember" but that
// shouldn't cause the UI to update when it changes.
//
// Syntax:
//   const myRef = useRef<number | null>(null);
//   myRef.current = 123;   // write
//   console.log(myRef.current); // read
//
// The value lives at `.current` — always.
//
// Common mistake: storing the interval ID in useState instead.
// Try it both ways and notice the difference — with useState,
// clearing the interval becomes unreliable because the state
// update is async and you may read a stale value.

// ============================================================
// TYPES
// ============================================================
type StopwatchStatus = "idle" | "running" | "paused";

// ============================================================
// HELPERS
// ============================================================

// Formats milliseconds into "MM:SS.mm" display format.
// You don't need to modify this.
function formatTime(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const centiseconds = Math.floor((ms % 1000) / 10);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
}

// ============================================================
// COMPONENT
// ============================================================
export default function Stopwatch() {
  // ----------------------------------------------------------
  // TODO 1: Set up state and refs
  //
  // State (triggers re-render, drives the UI):
  //   - `elapsed`  → total milliseconds elapsed (number, start at 0)
  //   - `status`   → current stopwatch status (StopwatchStatus)
  //
  // Ref (persists across renders, no re-render on change):
  //   - `intervalRef` → holds the interval ID returned by setInterval
  //                     so we can clear it later
  //   - `startTimeRef` → holds the timestamp when the interval started
  //                      so we can calculate elapsed time accurately
  //
  // Why two refs? Because Date.now() - startTime gives more
  // accurate elapsed time than incrementing a counter by a fixed
  // amount each tick (setInterval is not perfectly precise).
  //
  // Hint: useRef<number | null>(null) for both refs
  // ----------------------------------------------------------
  const [elapsed, setElapsed] = useState(0);
  const [status, setStatus] = useState<StopwatchStatus>("idle");
  const [laps, setLaps] = useState<number[]>([]);

  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // ----------------------------------------------------------
  // TODO 2: handleStart()
  //
  // Called when the user clicks Start (from idle or paused).
  //
  // It should:
  //   1. Record the current time, accounting for already-elapsed time:
  //        startTimeRef.current = Date.now() - elapsed;
  //      (This ensures pausing and resuming works correctly)
  //   2. Start an interval that fires every 10ms and updates elapsed:
  //        intervalRef.current = setInterval(() => {
  //          setElapsed(Date.now() - startTimeRef.current!);
  //        }, 10);
  //   3. Set status to "running"
  //
  // The reason we subtract elapsed from Date.now() in step 1:
  // If you paused at 5000ms, and then resume, you want the clock
  // to continue from 5000ms — not jump back to 0.
  // ----------------------------------------------------------
  function handleStart() {
    // your code here

    startTimeRef.current = Date.now() - elapsed;

    intervalRef.current = setInterval(() => {
      setElapsed(Date.now() - startTimeRef.current!);
    }, 10);

    setStatus("running");
  }

  // ----------------------------------------------------------
  // TODO 3: handlePause()
  //
  // Called when the user clicks Pause.
  //
  // It should:
  //   1. Clear the interval using the stored intervalRef.current
  //   2. Set status to "paused"
  //
  // Notice: we do NOT reset elapsed here. The current elapsed
  // value stays so handleStart can resume from the same point.
  // ----------------------------------------------------------
  function handlePause() {
    // your code here
    clearInterval(intervalRef.current!);

    setStatus("paused");
  }

  // ----------------------------------------------------------
  // TODO 4: handleReset()
  //
  // Called when the user clicks Reset.
  //
  // It should:
  //   1. Clear the interval
  //   2. Reset elapsed to 0
  //   3. Set status back to "idle"
  //   4. Clear both refs (set .current back to null)
  // ----------------------------------------------------------
  function handleReset() {
    // your code here
    clearInterval(intervalRef.current!);
    setElapsed(0);
    setStatus("idle");
    intervalRef.current = null;
    startTimeRef.current = null;
    setLaps([]);
  }

  // ----------------------------------------------------------
  // TODO 5: Wire up the JSX
  //
  // The display should show formatTime(elapsed).
  //
  // Buttons:
  //   - "Start"  → visible when status is "idle" or "paused"
  //   - "Pause"  → visible when status is "running"
  //   - "Reset"  → always visible, but disabled when status is "idle"
  //
  // Show the current status as a small label below the timer
  // so you can see the state machine working.
  //
  // BONUS: Add a lap feature.
  //   - A "Lap" button appears while running
  //   - Each lap records the current elapsed time
  //   - Display the lap list below the controls
  //   - Laps are cleared on reset
  //   - Hint: you'll need a `laps` state array (useState<number[]>)
  // ----------------------------------------------------------
  function handleLap() {
    setLaps([...laps, elapsed]);
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Stopwatch</h1>

      {/* --- TIMER DISPLAY --- */}
      <div style={styles.timerDisplay}>
        {/* TODO: show formatTime(elapsed) */}
        {formatTime(elapsed)}
      </div>

      {/* --- STATUS LABEL --- */}
      <p style={styles.statusLabel}>{status /* TODO: show current status */}</p>

      {/* --- CONTROLS --- */}
      <div style={styles.controls}>
        {/* TODO: Start button — show when idle or paused */}
        {(status === "idle" || status === "paused") && (
          <button type="button" onClick={() => handleStart()}>
            Start
          </button>
        )}
        {/* TODO: Pause button — show when running */}
        {status === "running" && (
          <button type="button" onClick={() => handlePause()}>
            Pause
          </button>
        )}
        {/* TODO: Reset button — always shown, disabled when idle */}
        <button
          type="button"
          disabled={status === "idle"}
          onClick={() => handleReset()}
          style={
            status === "idle"
              ? { ...styles.button, ...styles.resetButton }
              : styles.button
          }
        >
          Reset
        </button>

        {status === "running" && (
          <button
            type="button"
            onClick={() => handleLap()}
            style={styles.lapButton}
          >
            Lap
          </button>
        )}
        {/* BONUS: Lap button — show when running */}
      </div>
      <ul style={styles.lapList}>
        {laps.map((lap, idx) => (
          <li key={lap + idx} style={styles.lapItem}>
            <span>Lap {idx + 1}</span>
            <span>{formatTime(lap)}</span>
          </li>
        ))}
      </ul>
      {/* BONUS: Lap list */}
      {/* TODO: map over laps and show each one with its index and formatTime */}
    </div>
  );
}

// ============================================================
// STYLES
// ============================================================
const styles: Record<string, React.CSSProperties> = {
  container: {
    fontFamily: "'Georgia', serif",
    maxWidth: 400,
    margin: "60px auto",
    padding: "0 24px",
    color: "#1a1a1a",
    textAlign: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 32,
    letterSpacing: "-0.5px",
  },
  timerDisplay: {
    fontSize: 72,
    fontWeight: 800,
    letterSpacing: "-2px",
    marginBottom: 8,
    fontVariantNumeric: "tabular-nums",
  },
  statusLabel: {
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#888",
    marginBottom: 32,
  },
  controls: {
    display: "flex",
    gap: 12,
    justifyContent: "center",
    marginBottom: 32,
  },
  button: {
    padding: "10px 24px",
    fontSize: 15,
    border: "2px solid #1a1a1a",
    background: "white",
    cursor: "pointer",
    borderRadius: 6,
    fontWeight: 600,
  },
  resetButton: {
    borderColor: "#ccc",
    color: "#888",
  },
  lapButton: {
    borderColor: "#888",
    color: "#555",
  },
  lapList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    textAlign: "left",
  },
  lapItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 12px",
    border: "1px solid #e5e5e5",
    borderRadius: 6,
    fontSize: 14,
    color: "#444",
  },
};
