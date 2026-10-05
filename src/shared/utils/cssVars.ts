import type { CSSProperties } from 'react'

/**
 * Passes CSS custom properties through `style` with type safety, since
 * `CSSProperties` does not model custom properties.
 */
export function cssVars(
  vars: Record<`--${string}`, string | number>,
): CSSProperties {
  return vars as CSSProperties
}
