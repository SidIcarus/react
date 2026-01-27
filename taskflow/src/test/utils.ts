import { createElement, type ReactNode } from "react";
import { vi } from "vitest";

const hoisted = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockAuth: {
    signup: vi.fn(),
    signin: vi.fn(),
    signout: vi.fn(),
    forgetPassword: vi.fn(),
    resetPassword: vi.fn(),
    user: null,
    isAuthenticated: false,
    isLoading: false,
  },
}));

export const mockNavigate = hoisted.mockNavigate;
export const mockAuth = hoisted.mockAuth;

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => hoisted.mockNavigate,
  Link: ({ children, to }: { children: ReactNode; to: string }) =>
    createElement("a", { href: to }, children),
}));

vi.mock("@/contexts/auth", () => ({
  useAuth: () => hoisted.mockAuth,
}));

export function resetMocks() {
  hoisted.mockNavigate.mockReset();
  hoisted.mockAuth.signup.mockReset();
  hoisted.mockAuth.signin.mockReset();
  hoisted.mockAuth.signout.mockReset();
  hoisted.mockAuth.forgetPassword.mockReset();
  hoisted.mockAuth.resetPassword.mockReset();
}
