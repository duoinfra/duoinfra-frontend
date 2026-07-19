const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

const TOKEN_KEY = 'duoinfra_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

async function apiFetch(path, options = {}) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (res.status === 401) {
    removeToken()
    window.location.href = '/login'
    return
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message ?? `HTTP ${res.status}`)
  }

  const text = await res.text()
  return text ? JSON.parse(text) : null
}

export async function login(email, password) {
  const data = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  setToken(data.accessToken)
  return data
}

export async function signup(name, email, password) {
  return apiFetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ nickname: name, email, password }),
  })
}

export async function getDashboardStats() {
  return apiFetch('/api/dashboard/stats')
}

export async function getServers() {
  return apiFetch('/api/servers')
}

export async function getServer(id) {
  return apiFetch(`/api/servers/${id}`)
}

export async function getMetrics(id) {
  return apiFetch(`/api/servers/${id}/metrics`)
}

export async function createServer(cpu, memory) {
  return apiFetch('/api/servers', {
    method: 'POST',
    body: JSON.stringify({ cpu, memory }),
  })
}

export async function deleteServer(id) {
  return apiFetch(`/api/servers/${id}`, { method: 'DELETE' })
}
