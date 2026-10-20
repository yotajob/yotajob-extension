import type { DetectedRole } from './config.ts'

/**
 * Read a job posting out of the page.
 *
 * We only read the DOM the user is already looking at, and only when the
 * extension is clicked. Nothing is sent anywhere until the user says so.
 */
export function detectRole(): DetectedRole {
  const meta = (name: string): string | null => {
    const node = document.querySelector(`meta[property="${name}"], meta[name="${name}"]`)
    return node?.getAttribute('content')?.trim() || null
  }

  const jsonLd = (): Record<string, unknown> | null => {
    for (const node of document.querySelectorAll('script[type="application/ld+json"]')) {
      try {
        const parsed = JSON.parse(node.textContent || '{}')
        const entries = Array.isArray(parsed) ? parsed : [parsed]
        for (const entry of entries) {
          if (entry && typeof entry === 'object' && '@type' in entry) {
            const type = String(entry['@type'])
            if (type === 'JobPosting') return entry as Record<string, unknown>
          }
        }
      } catch {
        // A malformed JSON-LD block is not our problem to fix.
      }
    }
    return null
  }

  const posting = jsonLd()
  const title =
    (posting?.title as string | undefined) ??
    meta('og:title') ??
    document.querySelector('h1')?.textContent?.trim() ??
    null

  const company =
    (posting?.hiringOrganization as { name?: string } | undefined)?.name ??
    meta('og:site_name') ??
    document.querySelector('[class*="company"], [class*="employer"]')?.textContent?.trim() ??
    null

  const location =
    (posting?.jobLocation as { address?: { addressLocality?: string } } | undefined)?.address
      ?.addressLocality ?? null

  const baseSalary = posting?.baseSalary as
    | { value?: { minValue?: number; maxValue?: number; unitText?: string } }
    | undefined
  const salary = baseSalary ? formatSalary(baseSalary) : null

  return {
    title,
    company,
    location,
    salary,
    url: window.location.href,
    description: (posting?.description as string | undefined)?.slice(0, 600) ?? null,
  }
}

function formatSalary(baseSalary: {
  value?: { minValue?: number; maxValue?: number; unitText?: string }
}): string | null {
  const value = baseSalary.value
  if (!value || value.minValue == null) return null
  const unit = value.unitText === 'HOUR' ? '/hr' : ''
  if (value.maxValue == null) return `${value.minValue}${unit}`
  return `${value.minValue}–${value.maxValue}${unit}`
}
