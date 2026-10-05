import { Navigate, Route, Routes } from 'react-router-dom'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { ProfileCreatePage } from '@/features/profiles/pages/ProfileCreatePage'
import { ProfileSelectPage } from '@/features/profiles/pages/ProfileSelectPage'
import { ROUTES } from './paths'
import { RequireActiveProfile } from './RequireActiveProfile'
import { StartupRoute } from './StartupRoute'

export function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.root} element={<StartupRoute />} />
      <Route path={ROUTES.profileSelect} element={<ProfileSelectPage />} />
      <Route path={ROUTES.profileCreate} element={<ProfileCreatePage />} />

      <Route element={<RequireActiveProfile />}>
        <Route path={ROUTES.dashboard} element={<DashboardPage />} />
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.root} replace />} />
    </Routes>
  )
}
