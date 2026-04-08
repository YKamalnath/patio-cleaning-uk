/**
 * API client — uses relative `/api` in dev (Vite proxy) or VITE_API_URL in production.
 */
const API_BASE = import.meta.env.VITE_API_URL ?? ''

export type ApiSuccess<T> = {
  success: true
  message: string
  data: T
  meta?: { page?: number; limit?: number; total?: number; pages?: number }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function parseJson(res: Response) {
  const text = await res.text()
  if (!text) return {}
  try {
    return JSON.parse(text)
  } catch {
    return {}
  }
}

export async function apiPostFormData<T>(path: string, formData: FormData, token: string): Promise<ApiSuccess<T>> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  const data = await parseJson(res)
  if (!res.ok || data.success === false) {
    const msg = typeof data.message === 'string' ? data.message : `Request failed (${res.status})`
    throw new ApiError(msg, res.status, data.errors)
  }
  return data as ApiSuccess<T>
}

export async function apiPatchFormData<T>(path: string, formData: FormData, token: string): Promise<ApiSuccess<T>> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  const data = await parseJson(res)
  if (!res.ok || data.success === false) {
    const msg = typeof data.message === 'string' ? data.message : `Request failed (${res.status})`
    throw new ApiError(msg, res.status, data.errors)
  }
  return data as ApiSuccess<T>
}

export async function apiPost<T>(path: string, body: Record<string, unknown>, token?: string | null): Promise<ApiSuccess<T>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
  const data = await parseJson(res)
  if (!res.ok || data.success === false) {
    const msg = typeof data.message === 'string' ? data.message : `Request failed (${res.status})`
    throw new ApiError(msg, res.status, data.errors)
  }
  return data as ApiSuccess<T>
}

export async function apiGetPublic<T>(path: string): Promise<ApiSuccess<T>> {
  const res = await fetch(`${API_BASE}${path}`)
  const data = await parseJson(res)
  if (!res.ok || data.success === false) {
    const msg = typeof data.message === 'string' ? data.message : `Request failed (${res.status})`
    throw new ApiError(msg, res.status, data.errors)
  }
  return data as ApiSuccess<T>
}

export async function apiGet<T>(path: string, token: string): Promise<ApiSuccess<T>> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await parseJson(res)
  if (!res.ok || data.success === false) {
    const msg = typeof data.message === 'string' ? data.message : `Request failed (${res.status})`
    throw new ApiError(msg, res.status, data.errors)
  }
  return data as ApiSuccess<T>
}

export async function apiPatch<T>(path: string, body: Record<string, unknown>, token: string): Promise<ApiSuccess<T>> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  })
  const data = await parseJson(res)
  if (!res.ok || data.success === false) {
    const msg = typeof data.message === 'string' ? data.message : `Request failed (${res.status})`
    throw new ApiError(msg, res.status, data.errors)
  }
  return data as ApiSuccess<T>
}

export async function apiDelete<T>(path: string, token: string): Promise<ApiSuccess<T>> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await parseJson(res)
  if (!res.ok || data.success === false) {
    const msg = typeof data.message === 'string' ? data.message : `Request failed (${res.status})`
    throw new ApiError(msg, res.status, data.errors)
  }
  return data as ApiSuccess<T>
}
