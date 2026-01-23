# React Skill Builder Project: TaskFlow — A Personal Task Management App
This project is designed to systematically exercise React fundamentals through advanced patterns, building on my AngularJS background while cementing modern React thinking.

---

# Project Overview
TaskFlow is a personal productivity app where users can create projects, manage tasks with priorities and due dates, track time spent, and view analytics. It's complex enough to touch most React concepts but scoped enough to complete in 2-3 weeks of focused work.

## Core Requirements
1. Authentication & User State

- Implement a mock authentication flow (no real backend needed—use localStorage + context)
- Login/logout functionality with protected routes
- Persist auth state across browser refreshes
- Display user info in a header/navbar

What this exercises: Context API, state persistence, conditional rendering, route protection patterns

2. Project Management

- Create, edit, delete projects
- Each project has: name, description, color/icon, creation date
- List view with sorting (alphabetical, date created, task count)
- Project detail view showing associated tasks

What this exercises: CRUD operations, lifting state, component composition, sorting/filtering logic

3. Task Management

- Create tasks within projects
- Task properties: title, description, priority (low/medium/high/urgent), due date, status (todo/in-progress/done), estimated time, actual time logged
- Drag-and-drop reordering within a project
- Bulk actions (mark multiple as done, delete selected)
- Task detail modal/drawer for editing

What this exercises: Complex forms, controlled components, modals/portals, drag-and-drop (good opportunity for a library like dnd-kit), optimistic updates

4. Time Tracking

- Start/stop timer on any task
- Manual time entry
- Display running timer in header (persists across navigation)
- Time history log per task

What this exercises: useRef for timer intervals, global state management, useEffect cleanup (you've already been working on this), time formatting utilities

5. Dashboard & Analytics

- Overview cards: total tasks, completed this week, overdue count, time logged today
- Chart showing tasks completed per day (last 7 days)
- Chart showing time distribution by project
- Filterable by date range

What this exercises: Data transformation, charting libraries (Recharts works well), derived state, memoization with useMemo

6. Settings & Preferences

- Theme toggle (dark/light) — you've already tackled this with SSR considerations
- Default task priority
- Notification preferences (just store preferences, no real notifications needed)
- Export data as JSON

What this exercises: Form state, localStorage sync, file downloads, preference context

7. Search & Filtering

- Global search across all tasks
- Filter tasks by: status, priority, due date range, project
- Debounced search input
- URL-synced filters (filters persist in query params)

What this exercises: Debouncing (custom hook opportunity), URL state management, complex filtering logic, useSearchParams or equivalent

---

## Technical Requirements
### Architecture

- Component structure: Separate presentational and container components where it makes sense
- Custom hooks: Extract at least 5 reusable hooks (e.g., useLocalStorage, useDebounce, useTimer, useClickOutside, usePreviousValue)
- Context usage: Auth context, Theme context, and consider whether tasks need context or can use prop drilling/composition
- Error boundaries: Implement at least one error boundary around a complex feature area

### State Management
- Start with useState + useContext
- If state becomes unwieldy, refactor one area to useReducer to practice that pattern
- No external state library required, but structure code so one could be added later

### Data Layer

- Create a mock API module with simulated network delay (50-200ms)
- All data operations go through this layer (no direct localStorage manipulation in components)
- Handle loading and error states for all async operations

### Performance

- Implement React.memo on at least 3 components where it genuinely helps
- Use useCallback for handlers passed to memoized children
- Use useMemo for expensive computations (filtering large task lists, chart data transformation)
- Add React DevTools Profiler analysis for at least one optimization

### Accessibility

- Keyboard navigation for all interactive elements
- ARIA labels on icon buttons
- Focus management in modals (trap focus, return focus on close)
- Skip link to main content
- Color contrast compliance for both themes

---

## Testing Requirements
Unit Tests (React Testing Library + Vitest or Jest)
Custom Hooks — test each extracted hook:

- useLocalStorage: test initial value, updates, JSON parsing errors
- useDebounce: test delay behavior, cleanup on unmount
- useTimer: test start/stop/reset, cleanup of intervals
- Test edge cases and error conditions

### Utility Functions:

- Date formatting helpers
- Priority sorting logic
- Time calculation utilities
- Filter/search matching logic

Target: 90%+ coverage on hooks and utilities

---

### Component Tests
#### Form Components:

- Task form: validation, submission, error display
- Project form: all field interactions
- Test controlled input behavior

#### Interactive Components:

- Modal: open/close, focus trap, escape key closes
- Dropdown/select components: keyboard navigation
- Confirm dialogs: proper button actions

#### List Components:

- Task list: renders correct items, empty state, loading state
- Handles sorting prop changes
- Bulk selection behavior

Test patterns to use:

- `screen.getByRole` over `getByTestId` when possible
- `userEvent` over `fireEvent` for realistic interactions
- `waitFor` for async state updates
- Mock timers for debounce/timer tests

Target: Every component with logic or interactivity has tests

---

### Integration Tests
User Flows to Test:

1. Authentication flow
   - Login with valid credentials → redirects to dashboard
   - Access protected route while logged out → redirects to login
   - Logout → clears state, redirects to login
2. Task lifecycle
   - Create project → create task → edit task → mark complete → delete task
   - Verify state updates propagate correctly
3. Timer flow
   - Start timer → navigate away → verify timer continues
   - Stop timer → verify time logged to task
4. Search and filter
   - Apply multiple filters → verify correct results
   - Clear filters → verify all tasks return
   - Search → verify debounce behavior

Target: Cover the 4-5 most critical user journeys

---

### E2E Tests (Playwright or Cypress)
Scenarios:

1. New user onboarding
   - First login, create first project, create first task
2. Daily workflow
   - Login, view dashboard, start timer on task, complete task, check updated analytics
3. Data persistence
   - Create data, refresh page, verify data persists
   - Change theme, refresh, verify theme persists
4. Responsive behavior
   - Run critical flow on mobile viewport

Target: 4-6 E2E tests covering happy paths

---

Test Organization
```
src/
├── hooks/
│   ├── useLocalStorage.ts
│   └── useLocalStorage.test.ts    # co-located
├── utils/
│   ├── dateHelpers.ts
│   └── dateHelpers.test.ts        # co-located
├── components/
│   ├── TaskForm/
│   │   ├── TaskForm.tsx
│   │   └── TaskForm.test.tsx      # co-located
├── features/
│   └── tasks/
│       └── __tests__/             # integration tests
│           └── taskLifecycle.test.tsx
└── e2e/
    ├── auth.spec.ts
    ├── taskWorkflow.spec.ts
    └── persistence.spec.ts
```

Stretch Goals
- Optimistic updates with rollback on failed API calls
- Offline support with service worker and sync queue
- Keyboard shortcuts (cmd+k for search, etc.) with a useHotkeys hook
- Undo/redo for task operations using a history stack
- Real-time sync simulation (mock WebSocket updates)

Suggested Build Order
- Week 1: Auth, routing, project CRUD, basic task CRUD, theme toggle
- Week 2: Timer, drag-and-drop, search/filters, dashboard charts
- Week 3: Polish, accessibility audit, testing, performance optimization
