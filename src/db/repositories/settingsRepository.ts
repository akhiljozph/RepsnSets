import { db } from '@/db/client'

/**
 * Data access for app-level settings.
 *
 * UI code must go through repositories rather than touching Dexie directly.
 */
export const settingsRepository = {
  async get<TValue>(key: string): Promise<TValue | undefined> {
    const record = await db.settings.get(key)
    return record?.value as TValue | undefined
  },

  async set<TValue>(key: string, value: TValue): Promise<void> {
    await db.settings.put({ key, value })
  },

  async remove(key: string): Promise<void> {
    await db.settings.delete(key)
  },
}
