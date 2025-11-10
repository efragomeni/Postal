import { MongoDBAdapter } from "@auth/mongodb-adapter";






/*export interface User {
  id: string
  username: string
  email: string
}

export function login(username: string, password: string): User | null {
  // Simulación simple de login
  if (username && password) {
    const user: User = {
      id: "1",
      username: username,
      email: `${username}@example.com`,
    }
    localStorage.setItem("user", JSON.stringify(user))
    return user
  }
  return null
}

export function register(username: string, email: string, password: string): User | null {
  // Simulación simple de registro
  if (username && email && password) {
    const user: User = {
      id: Date.now().toString(),
      username: username,
      email: email,
    }
    localStorage.setItem("user", JSON.stringify(user))
    return user
  }
  return null
}

export function logout(): void {
  localStorage.removeItem("user")
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const userStr = localStorage.getItem("user")
  if (userStr) {
    return JSON.parse(userStr)
  }
  return null
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}
*/