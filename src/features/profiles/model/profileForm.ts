import type { Gender, ProfileDraft } from '@/db'
import type { SegmentedOption } from '@/shared/ui'
import { calculateAge, parseIsoDate, todayIsoDate } from '@/shared/utils/date'

export interface ProfileFormValues {
  name: string
  gender: Gender
  /** `YYYY-MM-DD`, as produced by a native date input. */
  dateOfBirth: string
  /** Kept as a string so partially typed input is not clobbered mid-edit. */
  heightCm: string
}

export type ProfileFormErrors = Partial<Record<keyof ProfileFormValues, string>>

export const GENDER_OPTIONS: readonly SegmentedOption<Gender>[] = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
]

export const MIN_HEIGHT_CM = 80
export const MAX_HEIGHT_CM = 250
const MAX_AGE_YEARS = 120
const MAX_NAME_LENGTH = 40

export const EMPTY_PROFILE_FORM: ProfileFormValues = {
  name: '',
  gender: 'MALE',
  dateOfBirth: '',
  heightCm: '',
}

export function validateProfileForm(values: ProfileFormValues): ProfileFormErrors {
  const errors: ProfileFormErrors = {}
  const name = values.name.trim()

  if (!name) {
    errors.name = 'Enter a name for this profile.'
  } else if (name.length > MAX_NAME_LENGTH) {
    errors.name = `Keep the name under ${MAX_NAME_LENGTH} characters.`
  }

  const birthDate = parseIsoDate(values.dateOfBirth)
  const age = calculateAge(values.dateOfBirth)

  if (!values.dateOfBirth) {
    errors.dateOfBirth = 'Enter your date of birth.'
  } else if (!birthDate || age === null) {
    errors.dateOfBirth = 'Enter a valid date.'
  } else if (age < 0) {
    errors.dateOfBirth = 'Date of birth cannot be in the future.'
  } else if (age > MAX_AGE_YEARS) {
    errors.dateOfBirth = 'Enter a more recent date of birth.'
  }

  const heightCm = Number(values.heightCm)

  if (!values.heightCm.trim()) {
    errors.heightCm = 'Enter your height in centimetres.'
  } else if (!Number.isFinite(heightCm)) {
    errors.heightCm = 'Height must be a number.'
  } else if (heightCm < MIN_HEIGHT_CM || heightCm > MAX_HEIGHT_CM) {
    errors.heightCm = `Height must be between ${MIN_HEIGHT_CM} and ${MAX_HEIGHT_CM} cm.`
  }

  return errors
}

export function toProfileDraft(values: ProfileFormValues): ProfileDraft {
  return {
    name: values.name.trim(),
    gender: values.gender,
    dateOfBirth: values.dateOfBirth,
    heightCm: Number(values.heightCm),
  }
}

/** Upper bound for the date input so future dates cannot be picked. */
export function maxDateOfBirth(): string {
  return todayIsoDate()
}
