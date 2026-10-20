import { detectRole } from './detect.ts'
import { saveRole } from './api.ts'
import { getToken } from './storage.ts'

const status = document.querySelector('#status')
const role = document.querySelector('#role')
const signIn = document.querySelector<HTMLButtonElement>('#sign-in')
const save = document.querySelector<HTMLButtonElement>('#save')
const code = document.querySelector('#code')

async function render(): Promise<void> {
  const detected = detectRole()
  if (role) role.textContent = detected.title ?? 'No job title detected on this page'
  const token = await getToken()
  if (save) save.disabled = !token
  if (signIn) signIn.hidden = Boolean(token)
  if (status) status.textContent = token ? 'Signed in' : 'Not signed in'
}

signIn?.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: 'start-sign-in' }, (response: { userCode?: string }) => {
    if (code) code.textContent = response.userCode ? `Enter ${response.userCode} at yotajob.com/activate` : ''
    void render()
  })
})

save?.addEventListener('click', () => {
  void (async () => {
    try {
      await saveRole(detectRole())
      if (status) status.textContent = 'Saved to your tracker'
    } catch (error) {
      if (status) status.textContent = (error as Error).message
    }
  })()
})

void render()
