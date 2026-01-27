export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  forgetPassword: (email: string) => Promise<{ name: string; email: string }>;
  resetPassword: (
    name: string,
    email: string,
    password: string,
  ) => Promise<boolean>;
  signin: (email: string, password: string) => Promise<void>;
  signout: () => void;
  signup: (name: string, email: string, password: string) => Promise<void>;
}

export interface RouterContext {
  auth: AuthContextType;
}
