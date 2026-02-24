import { useCallback, useEffect, useState } from "react";

// ============================================================
// PROJECT 2: Live Search Filter
// Skills: useEffect, useCallback, debouncing, cleanup functions
// ============================================================

// -- TYPES ----------------------------------------------------
interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
}

// -- FAKE DATA ------------------------------------------------
// Pretend this is an API response. Do not modify.
const ALL_BOOKS: Book[] = [
  {
    id: 1,
    title: "The Pragmatic Programmer",
    author: "David Thomas",
    genre: "Technology",
  },
  { id: 2, title: "Clean Code", author: "Robert Martin", genre: "Technology" },
  { id: 3, title: "Dune", author: "Frank Herbert", genre: "Sci-Fi" },
  { id: 4, title: "Neuromancer", author: "William Gibson", genre: "Sci-Fi" },
  { id: 5, title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy" },
  {
    id: 6,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    genre: "Non-Fiction",
  },
  {
    id: 7,
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Non-Fiction",
  },
  {
    id: 8,
    title: "The Name of the Wind",
    author: "Patrick Rothfuss",
    genre: "Fantasy",
  },
  { id: 9, title: "Foundation", author: "Isaac Asimov", genre: "Sci-Fi" },
  {
    id: 10,
    title: "You Don't Know JS",
    author: "Kyle Simpson",
    genre: "Technology",
  },
];

// -- FAKE API CALL --------------------------------------------
// This simulates a real async search with network delay.
// Do not modify. Call it like: fetchBooks("dune") → Promise<Book[]>
function fetchBooks(query: string): Promise<Book[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lower = query.toLowerCase();
      const results = ALL_BOOKS.filter(
        (b) =>
          b.title.toLowerCase().includes(lower) ||
          b.author.toLowerCase().includes(lower) ||
          b.genre.toLowerCase().includes(lower),
      );
      resolve(results);
    }, 400); // simulated 400ms network delay
  });
}

// ============================================================
// COMPONENT
// ============================================================
export default function LiveSearch() {
  // ----------------------------------------------------------
  // TODO 1: Set up state
  //
  // You need three pieces of state:
  //   - `query`    → the current text in the search input (string)
  //   - `results`  → the array of books returned from search (Book[])
  //   - `isLoading` → whether a search is in progress (boolean)
  //
  // Think about sensible initial values for each.
  // ----------------------------------------------------------
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Book[]>(ALL_BOOKS);
  const [isLoading, setIsLoading] = useState(false);

  // ----------------------------------------------------------
  // TODO 2: useEffect to trigger search when query changes
  //
  // Every time `query` changes, you want to call fetchBooks().
  // But there are two problems to solve:
  //
  // PROBLEM A — Skip empty queries:
  //   If query is empty, don't call fetchBooks at all.
  //   Instead, set results back to ALL_BOOKS and isLoading to false.
  //
  // PROBLEM B — Cleanup (the key learning here):
  //   The user might type fast: "d" → "du" → "dun" → "dune"
  //   Each keystroke fires a new fetch. If the "d" response
  //   arrives AFTER the "dune" response, it will overwrite
  //   the correct results with stale ones. This is a race condition.
  //
  //   Fix it with a cleanup flag:
  //
  //   useEffect(() => {
  //     let cancelled = false;
  //
  //     fetchBooks(query).then(data => {
  //       if (!cancelled) setResults(data);  // only update if still relevant
  //     });
  //
  //     return () => { cancelled = true; };  // ← this runs before the NEXT effect
  //   }, [query]);
  //
  // Set isLoading to true before fetching, and false after.
  // ----------------------------------------------------------

  useEffect(() => {
    if (!query) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults(ALL_BOOKS);
      setIsLoading(false);
      return;
    }
  }, [query]);

  useEffect(() => {
    if (!query) return;

    // cleanup flag
    let cancelled = false;
    const timer = setTimeout(() => {
      async function fetchData() {
        setIsLoading(true);
        const newResults = await fetchBooks(query);
        // only update if still relevant
        if (!cancelled) {
          setResults(newResults);
          // needs to be inside so it only sets false on a cancelled effect
          setIsLoading(false);
        }
      }

      fetchData();
    }, 300);

    // ← this runs before the NEXT effect
    return () => {
      cancelled = true;
      clearTimeout(timer); // cancel if query changes again
    };
  }, [query]);

  // ----------------------------------------------------------
  // TODO 3: Debounce the search (the real-world skill)
  //
  // Right now your effect fires on every single keystroke.
  // With a real API that would be expensive. Debouncing means:
  // "wait until the user stops typing for Xms, THEN search."
  //
  // Implement this using useEffect + setTimeout:
  //
  //   useEffect(() => {
  //     const timer = setTimeout(() => {
  //       // do the search here
  //     }, 300);
  //
  //     return () => clearTimeout(timer);  // cancel if query changes again
  //   }, [query]);
  //
  // CHALLENGE: Combine TODO 2 and TODO 3 into a single useEffect.
  // The cleanup function needs to both cancel the timeout AND
  // set the cancelled flag. Think about how to nest them.
  // ----------------------------------------------------------

  // ----------------------------------------------------------
  // TODO 4: useCallback for the input handler
  //
  // Create a `handleQueryChange` function using useCallback that:
  //   - Receives a React.ChangeEvent<HTMLInputElement>
  //   - Updates the `query` state with the input's value
  //
  // Syntax:
  //   const myFn = useCallback((arg) => { ... }, [deps]);
  //
  // Question to think about: what should the dependency array be?
  // (Hint: does this function close over any state or props?)
  // ----------------------------------------------------------

  // useCallback memoizes a function so it isn't recreated on
  // every render. The dependency array works the same as useEffect.
  const handleQueryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setQuery(value);
    },
    [],
  );

  // ----------------------------------------------------------
  // TODO 5: Wire up the JSX
  // ----------------------------------------------------------
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Book Search</h1>
      {/* --- SEARCH INPUT --- */}
      <div style={styles.inputWrapper}>
        <input
          style={styles.input}
          type="text"
          placeholder="Search by title, author, or genre..."
          value={query}
          onChange={(e) => handleQueryChange(e)}
        />
        {/* TODO: show a loading indicator when isLoading is true.
            Something simple like a <span> with "Searching..." works. */}
        {isLoading ? <span>Searching...</span> : ""}
      </div>
      {/* --- RESULT COUNT --- */}
      {/* TODO: show "X results" below the input when query is not empty */}
      {query && <p style={styles.resultCount}>{results.length} results</p>}
      {/* --- RESULTS LIST --- */}
      <ul style={styles.list}>
        {/* TODO: map over results and render a <li> for each book.
            Show the title, author, and genre.
            Use book.id as the key — this is better than index
            because the list order can change between searches. */}
        {results.map((book) => (
          <li key={book.id}>
            {book.title}, {book.author}, {book.genre}
          </li>
        ))}
      </ul>
      {/* TODO: if results is empty AND query is not empty AND isLoading is false,
          show a "No results found" message instead of an empty list */}
      {results.length === 0 && query && !isLoading ? "No results found" : ""}
    </div>
  );
}

// ============================================================
// STYLES
// ============================================================
const styles: Record<string, React.CSSProperties> = {
  container: {
    fontFamily: "'Georgia', serif",
    maxWidth: 560,
    margin: "60px auto",
    padding: "0 24px",
    color: "#1a1a1a",
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 24,
    letterSpacing: "-0.5px",
  },
  inputWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    fontSize: 16,
    border: "2px solid #1a1a1a",
    borderRadius: 6,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  loadingText: {
    fontSize: 13,
    color: "#888",
    marginBottom: 12,
    fontStyle: "italic",
  },
  resultCount: {
    fontSize: 13,
    color: "#888",
    marginBottom: 16,
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  listItem: {
    padding: "14px 16px",
    border: "1px solid #e5e5e5",
    borderRadius: 6,
    background: "#fafafa",
  },
  bookTitle: {
    fontWeight: 700,
    fontSize: 15,
    marginBottom: 2,
  },
  bookMeta: {
    fontSize: 13,
    color: "#666",
  },
  emptyState: {
    textAlign: "center",
    color: "#999",
    fontSize: 15,
    marginTop: 40,
  },
};
