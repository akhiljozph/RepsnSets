import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/router/paths'
import { profileRepository } from '@/db'
import { ThemeToggle } from '@/features/theme'
import { Button, PageHeader, Screen, TopBar } from '@/shared/ui'
import { ArrowLeftIcon } from '@/shared/ui/icons'
import { ProfileForm } from '../components/ProfileForm'
import { useProfileSession } from '../hooks/useProfileSession'
import {
  EMPTY_PROFILE_FORM,
  toProfileDraft,
  validateProfileForm,
  type ProfileFormErrors,
  type ProfileFormValues,
} from '../model/profileForm'
import { activeProfileService } from '../services/activeProfileService'
import styles from './ProfileCreatePage.module.css'

const FORM_ID = 'create-profile-form'

export function ProfileCreatePage() {
  const navigate = useNavigate()
  const { profiles } = useProfileSession()
  const [values, setValues] = useState<ProfileFormValues>(EMPTY_PROFILE_FORM)
  const [errors, setErrors] = useState<ProfileFormErrors>({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const isFirstProfile = profiles.length === 0

  function handleChange(patch: Partial<ProfileFormValues>) {
    setValues((current) => ({ ...current, ...patch }))

    // Clear only the fields being edited so untouched errors stay visible.
    setErrors((current) => {
      const next = { ...current }
      for (const key of Object.keys(patch) as (keyof ProfileFormValues)[]) {
        delete next[key]
      }
      return next
    })
  }

  async function handleSubmit() {
    const validationErrors = validateProfileForm(values)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) return

    setIsSaving(true)
    setSaveError(null)

    try {
      const profile = await profileRepository.create(toProfileDraft(values))
      await activeProfileService.select(profile.id)
      await navigate(ROUTES.dashboard, { replace: true })
    } catch {
      setSaveError('Could not save the profile. Please try again.')
      setIsSaving(false)
    }
  }

  return (
    <Screen
      footer={
        <Button type="submit" form={FORM_ID} fullWidth disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Create profile'}
        </Button>
      }
    >
      <TopBar actions={<ThemeToggle />} />

      {!isFirstProfile && (
        <div className={styles.back}>
          <Button
            variant="ghost"
            leadingIcon={<ArrowLeftIcon />}
            onClick={() => void navigate(ROUTES.profileSelect)}
          >
            Profiles
          </Button>
        </div>
      )}

      <PageHeader
        eyebrow={isFirstProfile ? "Let's get set up" : 'New profile'}
        title={isFirstProfile ? 'Create your profile' : 'Add a profile'}
        subtitle={
          isFirstProfile
            ? 'We only need a few details to track your progress. Nothing leaves this device.'
            : 'Each profile has its own workout plan and history.'
        }
      />

      <ProfileForm
        id={FORM_ID}
        values={values}
        errors={errors}
        onChange={handleChange}
        onSubmit={() => void handleSubmit()}
      />

      {saveError && (
        <p className={styles.error} role="alert">
          {saveError}
        </p>
      )}
    </Screen>
  )
}
