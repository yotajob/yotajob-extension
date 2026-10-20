import { API_URL, CLIENT_ID } from './config.ts'

/**
 * Device-code + PKCE.
 *
 * The extension is a public client, so it never holds a secret: the code
 * verifier stays in the extension, the challenge travels with the request,
 * and the token arrives only after the user approves it on the web app.
 */
export type DeviceCode = {
  device_code: string
  user_code: string
  verification_uri: string
  expires_in: number
  interval: number
}

export type TokenResponse = {
  access_token: string
  token_type: string
  expires_in: number
}

async function pkce(): Promise<{ verifier: string; challenge: string }> {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  const verifier = btoa(String.fromCharCode(...bytes))
  .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))
  const challenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  return { verifier, challenge }
}

export async function startDeviceFlow(): Promise<{ flow: DeviceCode; verifier: string }> {
  const { verifier, challenge } = await pkce()
  const response = await fetch(`${API_URL}/v1/auth/device/code`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, code_challenge: challenge, code_challenge_method: 'S256' }),
  })
  if (!response.ok) throw new Error('Could not start sign-in.')
  return { flow: (await response.json()) as DeviceCode, verifier }
}

export async function pollForToken(flow: DeviceCode, verifier: string): Promise<TokenResponse | null> {
  const response = await fetch(`${API_URL}/v1/auth/device/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      device_code: flow.device_code,
      code_verifier: verifier,
      grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
    }),
  })
  if (response.status === 400) return null
  if (!response.ok) throw new Error('Sign-in failed.')
  return (await response.json()) as TokenResponse
}
