import Dexie, { type Table } from 'dexie'
import type { AppSetting, Profile } from './entities'

/**
 * The single Dexie database for the app.
 *
 * Every schema change must be added as a new `version()` block so existing
 * installs migrate instead of losing data. Never mutate an existing version.
 *
 * Fields are declared with `declare` so TypeScript does not emit class fields
 * that would shadow the table instances Dexie assigns.
 */
export class RepsnSetsDatabase extends Dexie {
  declare profiles: Table<Profile, string>
  declare settings: Table<AppSetting, string>

  constructor() {
    super('repsnsets')

    this.version(1).stores({
      profiles: 'id, name, createdAt',
      settings: 'key',
    })
  }
}

export const db = new RepsnSetsDatabase()
