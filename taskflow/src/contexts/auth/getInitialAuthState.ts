import { AUTH_STORAGE_KEY } from "./constants";
import type { User } from "./types";

export interface InitialAuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function getInitialAuthState(): InitialAuthState {
  const initialAuthState: InitialAuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
  };
  if (typeof window === "undefined") return initialAuthState;

  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    initialAuthState.user = stored ? (JSON.parse(stored) as User) : null;
    initialAuthState.isAuthenticated = !!initialAuthState.user;

    return initialAuthState;
  } catch {
    return initialAuthState;
  }
}
