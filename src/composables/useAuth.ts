import { computed, ref } from 'vue'
import { apiConfig } from '@/config'

function checkSessionCookie(): boolean {
  try {
    const cookies = document.cookie.split('; ')
    const sessionExpiry = cookies.find((c) => c.startsWith('session_expiry='))
    return !!sessionExpiry
  } catch {
    return false
  }
}

const isAuthenticated = ref(checkSessionCookie())

async function login(email: string, password: string): Promise<void> {
  const response = await fetch(`${apiConfig.baseURL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.message || 'Login failed')
  }

  isAuthenticated.value = true
}

async function register(email: string, password: string): Promise<void> {
  const response = await fetch(`${apiConfig.baseURL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.message || 'Registration failed')
  }

  isAuthenticated.value = true
}

async function logout(): Promise<void> {
  try {
    await fetch(`${apiConfig.baseURL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
  } catch {
    // Logout proceeds even if the server request fails
  }
  isAuthenticated.value = false
}

export const useAuth = () => {
  return {
    isAuthenticated,
    login,
    register,
    logout,
  }
}
