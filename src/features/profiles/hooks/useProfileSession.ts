import { useLiveQuery } from 'dexie-react-hooks'
import { profileRepository, type Profile } from '@/db'
import { activeProfileService } from '../services/activeProfileService'

export interface ProfileSession {
  /** `loading` until the first IndexedDB read resolves. */
  status: 'loading' | 'ready'
  profiles: Profile[]
  activeProfile: Profile | null
}

const LOADING: ProfileSession = { status: 'loading', profiles: [], activeProfile: null }

/**
 * Live view of the profiles and the current selection.
 *
 * Backed by `useLiveQuery`, so the UI re-renders whenever the underlying tables
 * change rather than holding a stale copy in React state.
 */
export function useProfileSession(): ProfileSession {
  const result = useLiveQuery(async () => {
    const [profiles, activeProfileId] = await Promise.all([
      profileRepository.list(),
      activeProfileService.getId(),
    ])

    return {
      profiles,
      activeProfile: profiles.find((profile) => profile.id === activeProfileId) ?? null,
    }
  }, [])

  if (!result) return LOADING

  return { status: 'ready', ...result }
}
