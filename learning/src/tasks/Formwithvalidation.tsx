import { useReducer } from "react";

// ============================================================
// PROJECT 5: Form with Validation
// Skills: useReducer, complex state, controlled components
// ============================================================

// ============================================================
// THE KEY CONCEPT BEFORE YOU START
// ============================================================
//
// useReducer is an alternative to useState for managing state
// that has multiple sub-values or complex update logic.
//
// Instead of calling setX, setY, setZ separately, you dispatch
// an "action" that describes WHAT happened, and a "reducer"
// function decides HOW state should change in response.
//
// Think of it like this:
//   useState:    "set the count to 5"
//   useReducer:  "the user clicked increment" → reducer figures out new count
//
// Syntax:
//   const [state, dispatch] = useReducer(reducer, initialState);
//   dispatch({ type: "INCREMENT" });
//
// The reducer is a pure function:
//   function reducer(state, action) {
//     switch (action.type) {
//       case "INCREMENT": return { ...state, count: state.count + 1 };
//       default: return state;
//     }
//   }
//
// The golden rule: NEVER mutate state directly in a reducer.
// Always return a new object using spread: { ...state, changes }

// ============================================================
// TYPES
// ============================================================

interface FormFields {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface FormState {
  fields: FormFields;
  errors: FormErrors;
  isSubmitted: boolean;
  isSuccess: boolean;
}

// ----------------------------------------------------------
// TODO 1: Define your action types
//
// You need two kinds of actions:
//
// A) FIELD_CHANGE — fired when any input changes
//    It needs to carry: which field changed, and the new value
//    { type: "FIELD_CHANGE"; field: keyof FormFields; value: string }
//
// B) SUBMIT — fired when the form is submitted
//    It needs to carry: the validation errors found (if any)
//    { type: "SUBMIT"; errors: FormErrors }
//
// C) RESET — fired when the user clicks Reset
//    No payload needed: { type: "RESET" }
//
// In TypeScript, model these as a discriminated union:
//   type FormAction =
//     | { type: "FIELD_CHANGE"; field: keyof FormFields; value: string }
//     | { type: "SUBMIT"; errors: FormErrors }
//     | { type: "RESET" };
// ----------------------------------------------------------
type FormAction = never; // replace with discriminated union

// ============================================================
// INITIAL STATE
// ============================================================
const initialState: FormState = {
  fields: { name: "", email: "", password: "", confirmPassword: "" },
  errors: {},
  isSubmitted: false,
  isSuccess: false,
};

// ============================================================
// REDUCER
// ============================================================

// ----------------------------------------------------------
// TODO 2: Write the reducer
//
// Handle three cases:
//
// FIELD_CHANGE:
//   - Update the specific field that changed
//   - Clear the error for that field (user is fixing it)
//   - Keep everything else the same
//   - Hint: nested spread looks like:
//       fields: { ...state.fields, [action.field]: action.value }
//       errors: { ...state.errors, [action.field]: undefined }
//
// SUBMIT:
//   - Set isSubmitted to true
//   - Set errors to action.errors
//   - Set isSuccess to true ONLY if there are no errors
//     Hint: Object.keys(action.errors).length === 0
//
// RESET:
//   - Return initialState
//
// Always return state unchanged for unknown actions (default case).
// ----------------------------------------------------------
function reducer(state: FormState, action: FormAction): FormState {
  // your code here
  return state;
}

// ============================================================
// VALIDATION
// ============================================================

// ----------------------------------------------------------
// TODO 3: Write the validate function
//
// Takes FormFields, returns FormErrors.
// An empty errors object {} means the form is valid.
//
// Rules:
//   name          → required (no empty strings)
//   email         → required + must contain "@"
//   password      → required + at least 8 characters
//   confirmPassword → must match password
//
// Example:
//   validate({ name: "", email: "bad", password: "short", confirmPassword: "x" })
//   → { name: "Required", email: "Invalid email", password: "Min 8 characters", confirmPassword: "Passwords do not match" }
// ----------------------------------------------------------
function validate(fields: FormFields): FormErrors {
  const errors: FormErrors = {};
  // your code here
  return errors;
}

// ============================================================
// COMPONENT
// ============================================================
export default function FormWithValidation() {
  // ----------------------------------------------------------
  // TODO 4: Wire up useReducer
  //
  // const [state, dispatch] = useReducer(reducer, initialState);
  //
  // Then destructure what you need from state:
  //   const { fields, errors, isSubmitted, isSuccess } = state;
  // ----------------------------------------------------------

  // ----------------------------------------------------------
  // TODO 5: handleChange
  //
  // Called by every input's onChange.
  // Should dispatch a FIELD_CHANGE action with the field name
  // and new value.
  //
  // Receives a React.ChangeEvent<HTMLInputElement>.
  // The field name comes from the input's `name` attribute —
  // access it via e.target.name as keyof FormFields.
  // ----------------------------------------------------------
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    // your code here
  }

  // ----------------------------------------------------------
  // TODO 6: handleSubmit
  //
  // Called when the form is submitted.
  // Should:
  //   1. Prevent default form submission (e.preventDefault())
  //   2. Run validate() on the current fields
  //   3. Dispatch a SUBMIT action with the errors
  // ----------------------------------------------------------
  function handleSubmit(e: React.SubmitEvent) {
    // your code here
    e.preventDefault()
    validate(fields)
  }

  // ----------------------------------------------------------
  // TODO 7: handleReset
  //
  // Dispatches the RESET action.
  // ----------------------------------------------------------
  function handleReset() {
    // your code here
  }

  // ----------------------------------------------------------
  // TODO 8: Wire up the JSX
  //
  // Render a form with four inputs: name, email, password, confirmPassword.
  // Each input should be a controlled component:
  //   value={fields.name}
  //   onChange={handleChange}
  //   name="name"   ← this is how handleChange knows which field changed
  //
  // Below each input, show its error message if one exists:
  //   {errors.name && <p style={styles.error}>{errors.name}</p>}
  //
  // After successful submission, show a success message instead of the form.
  //
  // THINK ABOUT: what is a "controlled component"?
  // The input's value is always driven by React state, not the DOM.
  // React is the single source of truth for the input's value.
  // ----------------------------------------------------------
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Sign Up</h1>

      {/* TODO: if isSuccess, show a success message and the Reset button */}
      {/* TODO: otherwise show the form */}

      <div>
        {/* Name field */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Name</label>
          <input
            style={styles.input}
            type="text"
            name="name"
            placeholder="Your name"
            // TODO: value and onChange
          />
          {/* TODO: error message */}
        </div>

        {/* Email field */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="you@example.com"
            // TODO: value and onChange
          />
          {/* TODO: error message */}
        </div>

        {/* Password field */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Min 8 characters"
            // TODO: value and onChange
          />
          {/* TODO: error message */}
        </div>

        {/* Confirm Password field */}
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Confirm Password</label>
          <input
            style={styles.input}
            type="password"
            name="confirmPassword"
            placeholder="Repeat your password"
            // TODO: value and onChange
          />
          {/* TODO: error message */}
        </div>

        {/* Submit button */}
        <button
          style={styles.submitButton}
          type="button"
          onClick={handleSubmit}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}

// ============================================================
// STYLES
// ============================================================
const styles: Record<string, React.CSSProperties> = {
  container: {
    fontFamily: "'Georgia', serif",
    maxWidth: 440,
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
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    display: "block",
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 6,
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    fontSize: 15,
    border: "2px solid #e5e5e5",
    borderRadius: 6,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  inputError: {
    borderColor: "#e53e3e",
  },
  error: {
    fontSize: 13,
    color: "#e53e3e",
    marginTop: 4,
  },
  submitButton: {
    width: "100%",
    padding: "12px",
    fontSize: 15,
    fontWeight: 700,
    background: "#1a1a1a",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    marginTop: 8,
    fontFamily: "inherit",
  },
  resetButton: {
    padding: "10px 24px",
    fontSize: 14,
    border: "2px solid #1a1a1a",
    background: "white",
    cursor: "pointer",
    borderRadius: 6,
    fontWeight: 600,
    fontFamily: "inherit",
  },
  successBox: {
    textAlign: "center",
    padding: "40px 0",
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 15,
    color: "#666",
    marginBottom: 24,
  },
};
