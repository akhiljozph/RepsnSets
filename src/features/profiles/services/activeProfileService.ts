import { SETTING_KEYS, settingsRepository } from '@/db'

/**
 * The active profile selection.
 *
 * Stored in IndexedDB alongside the rest of the app state so that every
 * profile-scoped read can be derived from a single source of truth.
 */
export const activeProfileService = {
  async getId(): Promise<string | null> {
    const id = await settingsRepository.get<string>(SETTING_KEYS.activeProfileId)
    return id ?? null
  },

  async select(profileId: string): Promise<void> {
    await settingsRepository.set(SETTING_KEYS.activeProfileId, profileId)
  },

  async clear(): Promise<void> {
    await settingsRepository.remove(SETTING_KEYS.activeProfileId)
  },
}
