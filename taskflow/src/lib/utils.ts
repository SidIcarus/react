import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const FAKE_DELAY = 300;
export function simulatedNetworkCall() {
  return new Promise((resolve) => setTimeout(resolve, FAKE_DELAY));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
