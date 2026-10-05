import type { Profile } from '@/db'
import { ChevronRightIcon } from '@/shared/ui/icons'
import { cssVars } from '@/shared/utils/cssVars'
import { cx } from '@/shared/utils/cx'
import { profileSummary } from '../model/profileDisplay'
import { ProfileAvatar } from './ProfileAvatar'
import styles from './ProfileCard.module.css'

interface ProfileCardProps {
  profile: Profile
  /** Position in the list, used to cascade the entrance animation. */
  index: number
  isBusy?: boolean
  onSelect: (profile: Profile) => void
}

export function ProfileCard({ profile, index, isBusy, onSelect }: ProfileCardProps) {
  return (
    <button
      type="button"
      className={cx(styles.card, 'animate-rise', isBusy && styles.busy)}
      style={cssVars({ '--stagger': index })}
      disabled={isBusy}
      onClick={() => onSelect(profile)}
    >
      <ProfileAvatar name={profile.name} seed={profile.id} />

      <span className={styles.details}>
        <span className={styles.name}>{profile.name}</span>
        <span className={styles.meta}>{profileSummary(profile)}</span>
      </span>

      <ChevronRightIcon className={styles.chevron} />
    </button>
  )
}
