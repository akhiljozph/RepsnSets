import { db } from '@/db/client'
import type { Profile } from '@/db/entities'
import { createId } from '@/shared/utils/id'

export type ProfileDraft = Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>

export const profileRepository = {
  list(): Promise<Profile[]> {
    return db.profiles.orderBy('createdAt').toArray()
  },

  get(id: string): Promise<Profile | undefined> {
    return db.profiles.get(id)
  },

  async create(draft: ProfileDraft): Promise<Profile> {
    const now = Date.now()
    const profile: Profile = { ...draft, id: createId(), createdAt: now, updatedAt: now }

    await db.profiles.add(profile)
    return profile
  },

  async update(id: string, changes: Partial<ProfileDraft>): Promise<void> {
    await db.profiles.update(id, { ...changes, updatedAt: Date.now() })
  },

  async hasAny(): Promise<boolean> {
    return (await db.profiles.count()) > 0
  },
}
