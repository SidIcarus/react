import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { signinApi, signupApi } from "./AuthAPI";
import { AUTH_STORAGE_KEY } from "./constants";
import type { AuthContextType, User } from "./types";

const AuthContext = createContext<AuthContextType | null>(null);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  // Upgrading to use something else will just require changing this now since persistance
  // is abstracted away to the useLocalStorage hook
  const [user, setUser, removeUser] = useLocalStorage<User | null>(
    AUTH_STORAGE_KEY,
    null,
  );
  const [hasMounted, setHasMounted] = useState(false);

  // SSR hydration safety
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Signin function
  const signin = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);

      try {
        const loggedInUser = await signinApi(email, password);

        // Persist to localStorage
        setUser(loggedInUser);
      } finally {
        setIsLoading(false);
      }
      // Note: we don't catch here - let the error bubble up
      // so the signin form can display it
    },
    [setUser],
  );

  // Logout function
  const signout = useCallback(() => {
    removeUser();
  }, [removeUser]);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    await signupApi(name, email, password);
  }, []);

  // The value object we're providing
  const value: AuthContextType = {
    user,
    isLoading: !hasMounted || isLoading, // needed for potential flash when hydrating while user is null
    isAuthenticated: !!user,
    signin,
    signout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook for consuming the context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
