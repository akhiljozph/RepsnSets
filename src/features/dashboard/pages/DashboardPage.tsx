import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/app/router/paths'
import {
  activeProfileService,
  ProfileAvatar,
  profileSummary,
  useProfileSession,
} from '@/features/profiles'
import { ThemeToggle } from '@/features/theme'
import { Button, PageHeader, Screen, Spinner, TopBar } from '@/shared/ui'
import styles from './DashboardPage.module.css'

export function DashboardPage() {
  const navigate = useNavigate()
  const { activeProfile } = useProfileSession()

  if (!activeProfile) {
    return (
      <Screen>
        <Spinner />
      </Screen>
    )
  }

  async function handleSwitchProfile() {
    await activeProfileService.clear()
    await navigate(ROUTES.profileSelect, { replace: true })
  }

  return (
    <Screen
      footer={
        <Button
          variant="secondary"
          fullWidth
          onClick={() => void handleSwitchProfile()}
        >
          Switch profile
        </Button>
      }
    >
      <TopBar actions={<ThemeToggle />} />

      <PageHeader eyebrow="Dashboard" title={`Hey ${activeProfile.name.split(' ')[0]}`} />

      <section className={`${styles.card} animate-pop`}>
        <ProfileAvatar name={activeProfile.name} seed={activeProfile.id} />
        <div>
          <p className={styles.name}>{activeProfile.name}</p>
          <p className={styles.meta}>{profileSummary(activeProfile)}</p>
        </div>
      </section>

      <p className={`${styles.placeholder} animate-rise`}>
        Workout plan, progress graphs and workout tracking land in the next steps.
      </p>
    </Screen>
  )
}
