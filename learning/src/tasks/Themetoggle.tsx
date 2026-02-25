import { createContext, useContext, useEffect, useState } from "react";

// ============================================================
// PROJECT 3: Theme Toggle
// Skills: useContext, createContext, avoiding prop drilling
// ============================================================

// -- TYPES ----------------------------------------------------
type Theme = "light" | "dark";

type ThemeProviderContextState = {
  theme: Theme;
  toggleTheme: () => void;
};

// ============================================================
// CONTEXT
// ============================================================

// ----------------------------------------------------------
// TODO 1: Create the context
//
// Use createContext() to create a ThemeContext.
// You need to provide a default value that matches ThemeContextType.
//
// Syntax:
//   const MyContext = createContext<MyType>(defaultValue);
//
// For the default value, think about what makes sense:
// what theme should the app start on, and what should
// the toggle function do by default (hint: a no-op is fine)?
// ----------------------------------------------------------

const initialState: ThemeProviderContextState = {
  theme: "light",
  toggleTheme: () => null,
};

const ThemeProviderContext =
  createContext<ThemeProviderContextState>(initialState);

// ----------------------------------------------------------
// TODO 2: Create a custom hook — useTheme()
//
// Instead of importing and calling useContext(ThemeContext)
// everywhere, wrap it in a custom hook. This is the standard
// pattern in real codebases.
//
// It should:
//   1. Call useContext(ThemeContext)
//   2. Throw an error if the value is null/undefined
//      (meaning someone used the hook outside the provider)
//   3. Return the context value
//
// Syntax:
//   function useTheme() {
//     const context = useContext(ThemeContext);
//     if (!context) throw new Error("useTheme must be used within ThemeProvider");
//     return context;
//   }
//
// This error guard is a small thing that saves enormous
// debugging headaches in larger apps.
// ----------------------------------------------------------

function useTheme() {
  const context = useContext(ThemeProviderContext);

  if (!context) {
    throw new Error("useTheme must be used within a <ThemeProvider />");
  }

  return context;
}

// ----------------------------------------------------------
// TODO 3: Create the ThemeProvider component
//
// This component:
//   - Holds the `theme` state (useState)
//   - Defines a `toggleTheme` function that switches between
//     "light" and "dark"
//   - Wraps its children in ThemeContext.Provider
//   - Passes { theme, toggleTheme } as the context value
//
// It should accept a `children` prop.
// In TypeScript, type it as: { children: React.ReactNode }
//
// Syntax:
//   <ThemeContext.Provider value={{ theme, toggleTheme }}>
//     {children}
//   </ThemeContext.Provider>
// ----------------------------------------------------------

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
};

function ThemeProvider({
  children,
  defaultTheme = "light",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    toggleTheme: () => {
      setTheme((theme) => (theme === "light" ? "dark" : "light"));
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// ============================================================
// COMPONENTS
// ============================================================

// ----------------------------------------------------------
// TODO 4: ToggleButton component
//
// A small component that:
//   - Calls useTheme() to get toggleTheme
//   - Renders a button that calls toggleTheme on click
//   - Shows "Switch to Dark" or "Switch to Light" depending
//     on the current theme
//
// Notice: this component gets theme access WITHOUT receiving
// any props from its parent. That's the whole point of context.
// ----------------------------------------------------------
function ToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button type="button" onClick={() => toggleTheme()}>
      Switch to {theme === "light" ? "Dark" : "Light"}
    </button>
  );
}

// ----------------------------------------------------------
// TODO 5: ThemedCard component
//
// A card that reads the current theme from context and
// applies different styles based on it.
//
// Light theme: white background, dark text
// Dark theme: #1a1a1a background, white text
//
// It receives a `title` and `body` prop (both strings).
// It should NOT receive theme as a prop — get it from context.
//
// This demonstrates the core benefit: a deeply nested component
// can access theme without it being passed down through every parent.
// ----------------------------------------------------------
function ThemedCard({ title, body }: { title: string; body: string }) {
  const { theme } = useTheme();

  return (
    <div style={{ ...styles.card, ...getThemeStyles(theme) }}>
      <p style={styles.cardTitle}>{title}</p>
      <p style={styles.cardBody}>{body}</p>
    </div>
  );
}

// ----------------------------------------------------------
// TODO 6: Wire it all together in App
//
// Wrap everything in ThemeProvider so all children can
// access the context. Render a ToggleButton and at least
// two ThemedCards with different content.
//
// Try nesting a ThemedCard inside another component that
// doesn't receive theme as a prop — just to feel how
// context removes the need for prop drilling.
// ----------------------------------------------------------
function App() {
  return (
    <ThemeProvider>
      <div style={styles.appContainer}>
        {/* TODO: wrap with ThemeProvider */}
        <h1 style={styles.title}>Theme Toggle</h1>
        <ToggleButton />
        <ThemedCard
          title="Clean Code"
          body="A book about writing readable, maintable software"
        ></ThemedCard>
        <ThemedCard
          title="Second Title"
          body="Second body content"
        ></ThemedCard>

        {/* TODO: render some ThemedCards */}
      </div>
    </ThemeProvider>
  );
}

export default App;

// ============================================================
// STYLES HELPER
// ============================================================
// A helper to get theme-aware styles. You can use this in your
// components or write your own inline style logic — up to you.
function getThemeStyles(theme: Theme): React.CSSProperties {
  return {
    backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
    color: theme === "dark" ? "#f5f5f5" : "#1a1a1a",
    transition: "background-color 0.3s ease, color 0.3s ease",
  };
}

// ============================================================
// STYLES
// ============================================================
const styles: Record<string, React.CSSProperties> = {
  appContainer: {
    minHeight: "100vh",
    padding: "60px 24px",
    maxWidth: 600,
    margin: "0 auto",
    transition: "background-color 0.3s ease",
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 32,
    letterSpacing: "-0.5px",
  },
  card: {
    padding: "20px 24px",
    borderRadius: 8,
    border: "1px solid #e5e5e5",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 8,
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 1.6,
  },
  button: {
    padding: "10px 22px",
    fontSize: 15,
    border: "2px solid currentColor",
    background: "none",
    cursor: "pointer",
    borderRadius: 6,
    fontWeight: 600,
    marginBottom: 32,
    color: "inherit",
  },
};
