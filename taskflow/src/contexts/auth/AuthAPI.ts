import type { User } from "./types";
import { simulatedNetworkCall } from '@/lib/utils';

const USERS_STORAGE_KEY = "taskflow_mock_users";

interface MockUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

const DEFAULT_USERS: MockUser[] = [
  {
    id: "1",
    email: "demo@example.com",
    password: "password",
    name: "Demo User",
  },
];

function getMockUsers(): MockUser[] {
  if (typeof window === "undefined") return DEFAULT_USERS;

  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : DEFAULT_USERS;
}

function saveMockUsers(users: MockUser[]) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export async function forgetPasswordApi(email: string) {
  await simulatedNetworkCall();

  const users = getMockUsers();

  const user = users.find((u) => u.email === email);

  if (!user) throw new Error("Invalid email");

  const { id: _0, password: _1, ...userWithoutPassword } = user;

  return userWithoutPassword;
}

export async function resetPasswordApi(
  name: string,
  email: string,
  password: string,
) {
  await simulatedNetworkCall();

  const users = getMockUsers();

  const idx = users.findIndex((u) => u.email === email && u.name === name);
  const user = users[idx];

  if (!user) throw new Error("Invalid email");

  user.password = password;
  users[idx] = user;
  saveMockUsers(users);

  return true;
}

export async function signinApi(
  email: string,
  password: string,
): Promise<User> {
  await simulatedNetworkCall();

  const users = getMockUsers();

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) throw new Error("Invalid credentials");

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function signupApi(name: string, email: string, password: string) {
  await simulatedNetworkCall();

  const users = getMockUsers();

  // Check if email already exists
  if (users.some((u) => u.email === email)) {
    throw new Error("Email already registered");
  }

  users.push({
    id: String(users.length + 1),
    email,
    name,
    password,
  });

  saveMockUsers(users);

  return true;
}
