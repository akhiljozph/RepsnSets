import { Navigate } from 'react-router-dom'
import { useProfileSession } from '@/features/profiles/hooks/useProfileSession'
import { Screen, Spinner } from '@/shared/ui'
import { ROUTES } from './paths'

/**
 * Entry point for `/`.
 *
 * The app always prompts for a profile on launch, and falls through to profile
 * creation when none exist yet.
 */
export function StartupRoute() {
  const { status, profiles } = useProfileSession()

  if (status === 'loading') {
    return (
      <Screen>
        <Spinner label="Starting RepsnSets" />
      </Screen>
    )
  }

  return (
    <Navigate
      to={profiles.length === 0 ? ROUTES.profileCreate : ROUTES.profileSelect}
      replace
    />
  )
}
