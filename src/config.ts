/**
 * One place for the endpoints and the client id.
 *
 * The extension is a public client: it holds no secret. The client id is
 * public by design; the device-code flow is what proves who the user is.
 *
 * The endpoints are set at build time (see `build.mjs`), so the code and the
 * manifest's host permissions always agree on where the API is.
 */
declare const __API_URL__: string
declare const __WEB_URL__: string

export const API_URL = __API_URL__
export const CLIENT_ID = 'yotajob-extension'
export const WEB_URL = __WEB_URL__

export type DetectedRole = {
  title: string | null
  company: string | null
  location: string | null
  salary: string | null
  url: string
  description: string | null
}
