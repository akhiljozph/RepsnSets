import styles from './Spinner.module.css'

interface SpinnerProps {
  label?: string
}

/** Full-height loading state used while IndexedDB reads resolve. */
export function Spinner({ label = 'Loading' }: SpinnerProps) {
  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <span className={styles.ring} />
      <span className={styles.srOnly}>{label}</span>
    </div>
  )
}
