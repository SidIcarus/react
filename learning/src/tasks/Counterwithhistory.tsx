import { useState } from "react";

const ACTIONS = {
  INCREMENT: "increment",
  DECREMENT: "decrement",
  RESET: "reset",
} as const;

type ActionType = (typeof ACTIONS)[keyof typeof ACTIONS];

/**
 * PROJECT 1: Counter with History
 * Skills: useState, immutable array updates, derived state
 */
export default function CounterWithHistory() {
  /**
   * Setup state
   * - `count`   → the current number
   * - `history` → an array of action strings
   */
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState<[ActionType, number][]>([]);

  function handleAction(action: ActionType) {
    let newCount = count;
    switch (action) {
      case ACTIONS.INCREMENT:
        newCount += 1;
        break;
      case ACTIONS.DECREMENT:
        newCount -= 1;
        break;
      case ACTIONS.RESET:
        newCount = 0;
        break;
    }
    setCount(newCount);

    setHistory([...history, [action, count]]);
  }

  function handleUndo() {
    const newCount = history[history.length - 1][1];
    setCount(newCount);
    setHistory([...history.slice(0, history.length - 1)]);
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Counter with History</h1>

      {/* --- DISPLAY --- */}
      <div style={styles.countDisplay}>{count}</div>

      {/* --- BUTTONS --- */}
      <div style={styles.buttonRow}>
        <button
          type="button"
          style={styles.button}
          onClick={() => handleAction(ACTIONS.DECREMENT)}
        >
          -Decrement
        </button>

        <button
          type="button"
          style={{ ...styles.button, ...styles.resetButton }}
          onClick={() => handleAction(ACTIONS.RESET)}
        >
          Reset
        </button>

        <button
          type="button"
          style={styles.button}
          onClick={() => handleAction(ACTIONS.INCREMENT)}
        >
          + Increment
        </button>
      </div>

      {/* --- UNDO --- */}
      <button
        type="button"
        style={styles.undoButton}
        onClick={() => handleUndo()}
        disabled={history.length === 0}
      >
        ↩ Undo
      </button>

      {/* --- HISTORY LOG --- */}
      <div style={styles.historyBox}>
        <h2 style={styles.historyTitle}>History</h2>
        {/* TODO: if history is empty, show a <p> that says "No actions yet." */}
        {history.length === 0 ? <p>No Actions yet.</p> : ""}
        {/* TODO: map over history and render each entry.
            Use the array index as the key for now.
            Show newest entries at the top (hint: [...history].reverse()) */}
        <ul style={styles.historyList}>
          {[...history].reverse().map((h, idx) => (
            <li style={styles.historyItem} key={idx}>
              {h[0]}, {h[1]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Styles */
const styles: Record<string, React.CSSProperties> = {
  container: {
    fontFamily: "'Georgia', serif",
    maxWidth: 480,
    margin: "60px auto",
    padding: "0 24px",
    color: "#1a1a1a",
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 32,
    letterSpacing: "-0.5px",
  },
  countDisplay: {
    fontSize: 96,
    fontWeight: 800,
    textAlign: "center",
    lineHeight: 1,
    marginBottom: 32,
    color: "#111",
  },
  buttonRow: {
    display: "flex",
    gap: 12,
    justifyContent: "center",
    marginBottom: 16,
  },
  button: {
    padding: "10px 22px",
    fontSize: 15,
    border: "2px solid #1a1a1a",
    background: "white",
    cursor: "pointer",
    borderRadius: 6,
    fontWeight: 600,
    transition: "all 0.15s",
    color: "#666",
  },
  resetButton: {
    borderColor: "#999",
  },
  undoButton: {
    display: "block",
    margin: "0 auto 32px",
    padding: "8px 20px",
    fontSize: 14,
    border: "1px solid #ccc",
    background: "none",
    cursor: "pointer",
    borderRadius: 6,
    color: "#555",
  },
  historyBox: {
    border: "1px solid #e5e5e5",
    borderRadius: 8,
    padding: "16px 20px",
    background: "#fafafa",
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#888",
    marginBottom: 12,
  },
  historyList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  historyItem: {
    fontSize: 14,
    color: "#444",
    padding: "4px 8px",
    background: "white",
    border: "1px solid #eee",
    borderRadius: 4,
  },
};
