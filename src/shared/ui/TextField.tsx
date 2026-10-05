import { useId, type InputHTMLAttributes } from 'react'
import { cx } from '@/shared/utils/cx'
import styles from './TextField.module.css'

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string
  hint?: string
  error?: string
  /** Unit shown inside the field, e.g. `cm`. */
  suffix?: string
}

export function TextField({
  label,
  hint,
  error,
  suffix,
  className,
  ...rest
}: TextFieldProps) {
  const inputId = useId()
  const messageId = `${inputId}-message`
  const message = error ?? hint

  return (
    <div className={cx(styles.field, className)}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>

      <div className={cx(styles.control, error && styles.invalid)}>
        <input
          id={inputId}
          className={styles.input}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          {...rest}
        />
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </div>

      {message && (
        <p
          id={messageId}
          className={cx(styles.message, error && styles.errorMessage)}
          role={error ? 'alert' : undefined}
        >
          {message}
        </p>
      )}
    </div>
  )
}
