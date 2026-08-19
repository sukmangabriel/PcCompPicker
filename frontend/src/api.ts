import axios, { AxiosHeaders } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3002/api'

export type AuthUser = {
  id: number
  username: string
}

export type AuthResponse = {
  token: string
  user: AuthUser
}

export type SavedConfiguration = {
  id: number
  user_id: number
  name: string
  cpu_id?: string | null
  gpu_id?: string | null
  ram_id?: string | null
  storage_id?: string | null
  cooling_id?: string | null
  psu_id?: string | null
  case_id?: string | null
  motherboard_id?: string | null
  created_at?: string
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pccomp-picker-token')

  if (token) {
    config.headers = config.headers ?? new AxiosHeaders()
    config.headers.set('Authorization', `Bearer ${token}`)
  }

  return config
})

export async function registerUser(username: string, password: string) {
  const { data } = await api.post<AuthResponse>('/register', { username, password })
  return data
}

export async function loginUser(username: string, password: string) {
  const { data } = await api.post<AuthResponse>('/login', { username, password })
  return data
}

export async function logoutUser() {
  return api.post('/logout')
}

export async function fetchConfigurations() {
  const { data } = await api.get<{ configurations: SavedConfiguration[] }>('/configurations')
  return data.configurations
}

export async function saveConfiguration(payload: Record<string, string | null>) {
  const { data } = await api.post<{ configuration: SavedConfiguration }>('/configurations', payload)
  return data.configuration
}

export async function updateConfiguration(id: number, payload: Record<string, string | null>) {
  const { data } = await api.put<{ configuration: SavedConfiguration }>(`/configurations/${id}`, payload)
  return data.configuration
}

export async function renameConfiguration(id: number, name: string) {
  const { data } = await api.put<{ configuration: SavedConfiguration }>(`/configurations/${id}`, { name })
  return data.configuration
}

export async function deleteConfiguration(id: number) {
  const { data } = await api.delete<{ message: string }>(`/configurations/${id}`)
  return data
}
