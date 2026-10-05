/**
 * Calendar-date helpers.
 *
 * Dates of birth and measurement dates are stored as plain `YYYY-MM-DD`
 * strings, so they are parsed as local calendar days rather than UTC instants.
 */

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

export function toIsoDate(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function todayIsoDate(): string {
  return toIsoDate(new Date())
}

export function parseIsoDate(isoDate: string): Date | null {
  const match = ISO_DATE_PATTERN.exec(isoDate)
  if (!match) return null

  const [, yearText = '', monthText = '', dayText = ''] = match
  const year = Number(yearText)
  const month = Number(monthText)
  const day = Number(dayText)

  const date = new Date(year, month - 1, day)

  // Rejects overflow dates such as 2026-02-31, which Date would roll forward.
  const isRealDate =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day

  return isRealDate ? date : null
}

/** Age in whole years, or `null` when the date of birth cannot be parsed. */
export function calculateAge(dateOfBirth: string, now: Date = new Date()): number | null {
  const birthDate = parseIsoDate(dateOfBirth)
  if (!birthDate) return null

  let age = now.getFullYear() - birthDate.getFullYear()
  const monthDelta = now.getMonth() - birthDate.getMonth()
  const hasHadBirthdayThisYear =
    monthDelta > 0 || (monthDelta === 0 && now.getDate() >= birthDate.getDate())

  if (!hasHadBirthdayThisYear) age -= 1

  return age
}

export function formatIsoDate(isoDate: string): string {
  const date = parseIsoDate(isoDate)
  if (!date) return isoDate

  return date.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
