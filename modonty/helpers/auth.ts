// This file will be replaced by NextAuth
// Temporary user interface for migration
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

let currentUser: User | null = null;

export function getCurrentUser(): User | null {
  return currentUser;
}

export function setCurrentUser(user: User | null): void {
  currentUser = user;
}

export function isAuthenticated(): boolean {
  return currentUser !== null;
}

export function logout(): void {
  currentUser = null;
}




