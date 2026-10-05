import type { ReactNode } from 'react'
import { cx } from '@/shared/utils/cx'
import styles from './Screen.module.css'

interface ScreenProps {
  children: ReactNode
  /** Pinned to the bottom of the viewport so primary actions stay in thumb reach. */
  footer?: ReactNode
  className?: string
}

export function Screen({ children, footer, className }: ScreenProps) {
  return (
    <div className={styles.screen}>
      <div className={styles.glow} aria-hidden="true" />
      <main className={cx(styles.content, className)}>{children}</main>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  )
}
