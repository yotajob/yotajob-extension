import { API_URL } from './config.ts'
import type { DetectedRole } from './config.ts'
import { getToken } from './storage.ts'

/** Save a posting to the seeker's private ledger. */
export async function saveRole(role: DetectedRole): Promise<{ id: string }> {
  const token = await getToken()
  if (!token) throw new Error('Sign in first.')

  const response = await fetch(`${API_URL}/v1/applications`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify({
      company: role.company ?? 'Unknown company',
      role: role.title ?? 'Unknown role',
      posting_url: role.url,
      source: 'Extension',
      stage: 'saved',
    }),
  })

  if (response.status === 401) throw new Error('Your session expired. Sign in again.')
  if (!response.ok) throw new Error('Could not save this role.')
  return (await response.json()) as { id: string }
}
