/**
 * Stable identifiers for persisted records.
 *
 * IDs are generated on the client and must never be reassigned, so that export
 * and import can preserve relationships between records.
 */
export function createId(): string {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}
