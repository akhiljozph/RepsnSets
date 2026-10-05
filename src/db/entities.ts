/**
 * Persisted entity definitions.
 *
 * These interfaces describe exactly what is written to IndexedDB. IndexedDB is
 * the source of truth; React state is never the permanent store.
 *
 * Timestamps are epoch milliseconds. Calendar dates are `YYYY-MM-DD` strings.
 */

export const GENDERS = ['MALE', 'FEMALE', 'OTHER'] as const

export type Gender = (typeof GENDERS)[number]

export interface Profile {
  id: string
  name: string
  gender: Gender
  /** `YYYY-MM-DD`. Age is derived from this and never stored. */
  dateOfBirth: string
  heightCm: number
  createdAt: number
  updatedAt: number
}

/** Key/value store for app-level state that is not tied to a single profile. */
export interface AppSetting<TValue = unknown> {
  key: string
  value: TValue
}

export const SETTING_KEYS = {
  activeProfileId: 'activeProfileId',
} as const
