/**
 * One place for the endpoints and the client id.
 *
 * The extension is a public client: it holds no secret. The client id is
 * public by design; the device-code flow is what proves who the user is.
 */
export const API_URL = 'https://api.yotajob.com'
export const CLIENT_ID = 'yotajob-extension'
export const WEB_URL = 'https://yotajob.com'

export type DetectedRole = {
  title: string | null
  company: string | null
  location: string | null
  salary: string | null
  url: string
  description: string | null
}
