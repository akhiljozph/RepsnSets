import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/router/paths'
import type { Profile } from '@/db'
import { ThemeToggle } from '@/features/theme'
import { Button, PageHeader, Screen, Spinner, TopBar } from '@/shared/ui'
import { PlusIcon } from '@/shared/ui/icons'
import { ProfileCard } from '../components/ProfileCard'
import { useProfileSession } from '../hooks/useProfileSession'
import { activeProfileService } from '../services/activeProfileService'
import styles from './ProfileSelectPage.module.css'

export function ProfileSelectPage() {
  const navigate = useNavigate()
  const { status, profiles } = useProfileSession()
  const [selectingId, setSelectingId] = useState<string | null>(null)

  if (status === 'loading') {
    return (
      <Screen>
        <Spinner label="Loading profiles" />
      </Screen>
    )
  }

  // Nothing to choose from yet, so go straight to creation.
  if (profiles.length === 0) {
    return <Navigate to={ROUTES.profileCreate} replace />
  }

  async function handleSelect(profile: Profile) {
    setSelectingId(profile.id)

    try {
      await activeProfileService.select(profile.id)
      await navigate(ROUTES.dashboard, { replace: true })
    } finally {
      setSelectingId(null)
    }
  }

  return (
    <Screen
      footer={
        <Button
          variant="secondary"
          fullWidth
          leadingIcon={<PlusIcon />}
          onClick={() => void navigate(ROUTES.profileCreate)}
        >
          Create profile
        </Button>
      }
    >
      <TopBar actions={<ThemeToggle />} />

      <PageHeader
        eyebrow="Welcome back"
        title="Who's training?"
        subtitle="Each profile keeps its own plan, history and measurements."
      />

      <ul className={styles.list}>
        {profiles.map((profile, index) => (
          <li key={profile.id}>
            <ProfileCard
              profile={profile}
              index={index}
              isBusy={selectingId === profile.id}
              onSelect={(selected) => void handleSelect(selected)}
            />
          </li>
        ))}
      </ul>

      <p className={styles.hint}>
        Everything is stored on this device and works offline.
      </p>
    </Screen>
  )
}
