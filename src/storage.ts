const TOKEN_KEY = 'yotajob.token'

/** The token lives in extension storage, scoped to this extension only. */
export async function getToken(): Promise<string | null> {
  const stored = await chrome.storage.local.get(TOKEN_KEY)
  return (stored[TOKEN_KEY] as string | undefined) ?? null
}

export async function setToken(token: string): Promise<void> {
  await chrome.storage.local.set({ [TOKEN_KEY]: token })
}

export async function clearToken(): Promise<void> {
  await chrome.storage.local.remove(TOKEN_KEY)
}
