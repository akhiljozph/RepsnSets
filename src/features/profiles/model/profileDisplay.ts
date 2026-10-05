import type { Gender, Profile } from '@/db'
import { calculateAge } from '@/shared/utils/date'

const GENDER_LABELS: Record<Gender, string> = {
  MALE: 'Male',
  FEMALE: 'Female',
  OTHER: 'Other',
}

export function genderLabel(gender: Gender): string {
  return GENDER_LABELS[gender]
}

/** Short meta line, e.g. `28 yrs · Male · 178 cm`. */
export function profileSummary(profile: Profile): string {
  const age = calculateAge(profile.dateOfBirth)

  return [
    age === null ? null : `${age} yrs`,
    genderLabel(profile.gender),
    `${profile.heightCm} cm`,
  ]
    .filter(Boolean)
    .join(' · ')
}
