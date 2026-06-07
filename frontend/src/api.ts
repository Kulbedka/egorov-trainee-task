export type AuthUser = {
  name: string
  email: string
  picture: string
}

const authStorageKey = 'kairos.auth.user'

export const apiUrl = (import.meta.env.VITE_API_URL ?? 'http://localhost:5000').replace(/\/+$/, '')
export const googleAuthUrl = `${apiUrl}/api/auth/google`

export async function isBackendAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${apiUrl}/health`)
    if (!response.ok) return false

    const health = await response.json() as { status?: string }
    return health.status === 'ok'
  } catch {
    return false
  }
}

export function getAuthUser(): AuthUser | null {
  const params = new URLSearchParams(window.location.search)

  if (params.get('auth') === 'success') {
    const user = {
      name: params.get('name') ?? '',
      email: params.get('email') ?? '',
      picture: params.get('picture') ?? '',
    }

    sessionStorage.setItem(authStorageKey, JSON.stringify(user))
    removeAuthParams(params)
    return user
  }

  const storedUser = sessionStorage.getItem(authStorageKey)
  if (!storedUser) return null

  try {
    return JSON.parse(storedUser) as AuthUser
  } catch {
    sessionStorage.removeItem(authStorageKey)
    return null
  }
}

export function clearAuthUser(): void {
  sessionStorage.removeItem(authStorageKey)
}

function removeAuthParams(params: URLSearchParams): void {
  for (const key of ['auth', 'name', 'email', 'picture']) params.delete(key)

  const query = params.toString()
  const cleanUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`
  window.history.replaceState({}, '', cleanUrl)
}
