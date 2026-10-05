import type { FormEvent } from 'react'
import { SegmentedControl, TextField } from '@/shared/ui'
import { cssVars } from '@/shared/utils/cssVars'
import { calculateAge } from '@/shared/utils/date'
import {
  GENDER_OPTIONS,
  MAX_HEIGHT_CM,
  MIN_HEIGHT_CM,
  maxDateOfBirth,
  type ProfileFormErrors,
  type ProfileFormValues,
} from '../model/profileForm'
import styles from './ProfileForm.module.css'

interface ProfileFormProps {
  /** Lets a submit button outside the form trigger it via the `form` attribute. */
  id: string
  values: ProfileFormValues
  errors: ProfileFormErrors
  onChange: (patch: Partial<ProfileFormValues>) => void
  onSubmit: () => void
}

export function ProfileForm({ id, values, errors, onChange, onSubmit }: ProfileFormProps) {
  const age = values.dateOfBirth ? calculateAge(values.dateOfBirth) : null
  const showAge = age !== null && age >= 0 && !errors.dateOfBirth

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form id={id} className={styles.form} noValidate onSubmit={handleSubmit}>
      <div className="animate-rise" style={cssVars({ '--stagger': 0 })}>
        <TextField
          label="Name"
          placeholder="e.g. Akhil"
          autoComplete="name"
          autoCapitalize="words"
          enterKeyHint="next"
          value={values.name}
          error={errors.name}
          onChange={(event) => onChange({ name: event.target.value })}
        />
      </div>

      <div className="animate-rise" style={cssVars({ '--stagger': 1 })}>
        <SegmentedControl
          label="Gender"
          name="gender"
          options={GENDER_OPTIONS}
          value={values.gender}
          onChange={(gender) => onChange({ gender })}
        />
      </div>

      <div className="animate-rise" style={cssVars({ '--stagger': 2 })}>
        <TextField
          label="Date of birth"
          type="date"
          max={maxDateOfBirth()}
          value={values.dateOfBirth}
          error={errors.dateOfBirth}
          hint={showAge ? `${age} years old` : 'Age and BMI are calculated from this.'}
          onChange={(event) => onChange({ dateOfBirth: event.target.value })}
        />
      </div>

      <div className="animate-rise" style={cssVars({ '--stagger': 3 })}>
        <TextField
          label="Height"
          type="number"
          inputMode="decimal"
          placeholder="175"
          suffix="cm"
          min={MIN_HEIGHT_CM}
          max={MAX_HEIGHT_CM}
          step="0.5"
          enterKeyHint="done"
          value={values.heightCm}
          error={errors.heightCm}
          onChange={(event) => onChange({ heightCm: event.target.value })}
        />
      </div>
    </form>
  )
}
