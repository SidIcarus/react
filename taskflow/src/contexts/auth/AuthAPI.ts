import type { User } from "./types";

const FAKE_DELAY = 300;

const MOCK_USERS = [
  {
    id: "1",
    email: "demo@example.com",
    password: "password",
    name: "Demo User",
  },
];

export async function signinApi(
  email: string,
  password: string,
): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, FAKE_DELAY));

  const user = MOCK_USERS.find(
    (u) => u.email === email && u.password === password,
  );

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
