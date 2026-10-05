import { cssVars } from '@/shared/utils/cssVars'
import { cx } from '@/shared/utils/cx'
import styles from './ProfileAvatar.module.css'

interface ProfileAvatarProps {
  name: string
  /** Seeds the colour so a profile keeps the same avatar across sessions. */
  seed: string
  className?: string
}

function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'

  const first = words[0]?.[0] ?? ''
  const last = words.length > 1 ? (words[words.length - 1]?.[0] ?? '') : ''

  return (first + last).toUpperCase()
}

function hueOf(seed: string): number {
  let hash = 0
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) % 360
  }
  return hash
}

export function ProfileAvatar({ name, seed, className }: ProfileAvatarProps) {
  return (
    <span
      className={cx(styles.avatar, className)}
      style={cssVars({ '--hue': hueOf(seed) })}
      aria-hidden="true"
    >
      {initialsOf(name)}
    </span>
  )
}
