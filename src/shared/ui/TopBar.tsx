import type { ReactNode } from 'react'
import { DumbbellIcon } from './icons'
import styles from './TopBar.module.css'

interface TopBarProps {
  /** Right-hand slot, e.g. the theme toggle. */
  actions?: ReactNode
}

export function TopBar({ actions }: TopBarProps) {
  return (
    <div className={`${styles.bar} animate-fade`}>
      <span className={styles.brand}>
        <DumbbellIcon className={styles.mark} />
        Reps<span className={styles.brandAccent}>n</span>Sets
      </span>

      {actions}
    </div>
  )
}
