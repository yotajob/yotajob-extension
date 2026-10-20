/**
 * The content script only listens. It never reads a field value and never
 * sends anything anywhere: the popup asks the page for what it needs at the
 * moment the user clicks the extension.
 */
declare global {
  interface Window {
    __yotajobDetect?: () => unknown
  }
}

window.__yotajobDetect = () => null
