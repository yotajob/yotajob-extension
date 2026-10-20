import { pollForToken, startDeviceFlow } from './auth.ts'
import { setToken } from './storage.ts'

/**
 * The background service worker talks to the API. It holds the host
 * permission, so requests are not subject to CORS: the extension origin
 * never needs to be allow-listed for the API.
 */
chrome.runtime.onMessage.addListener((message: { type: string }, _sender, sendResponse) => {
  if (message.type === 'start-sign-in') {
    void (async () => {
      try {
        const { flow, verifier } = await startDeviceFlow()
        sendResponse({ ok: true, userCode: flow.user_code, verificationUri: flow.verification_uri })

        // The person approves the code in the web app. We open it for them.
        await chrome.tabs.create({ url: flow.verification_uri })

        const deadline = Date.now() + flow.expires_in * 1000
        while (Date.now() < deadline) {
          await new Promise((resolve) => setTimeout(resolve, flow.interval * 1000))
          const token = await pollForToken(flow, verifier)
          if (token) {
            await setToken(token.access_token)
            sendResponse({ ok: true, signedIn: true })
            return
          }
        }
        sendResponse({ ok: false, error: 'Sign-in timed out.' })
      } catch (error) {
        sendResponse({ ok: false, error: (error as Error).message })
      }
    })()
    return true
  }
  return false
})
