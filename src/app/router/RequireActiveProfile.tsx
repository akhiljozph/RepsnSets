import { Navigate, Outlet } from 'react-router-dom'
import { useProfileSession } from '@/features/profiles/hooks/useProfileSession'
import { Screen, Spinner } from '@/shared/ui'
import { ROUTES } from './paths'

/** Guards profile-scoped routes so no screen can render without a selection. */
export function RequireActiveProfile() {
  const { status, activeProfile } = useProfileSession()

  if (status === 'loading') {
    return (
      <Screen>
        <Spinner />
      </Screen>
    )
  }

  if (!activeProfile) {
    return <Navigate to={ROUTES.profileSelect} replace />
  }

  return <Outlet />
}
