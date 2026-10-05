import { cssVars } from '@/shared/utils/cssVars'
import { cx } from '@/shared/utils/cx'
import styles from './SegmentedControl.module.css'

export interface SegmentedOption<TValue extends string> {
  value: TValue
  label: string
}

interface SegmentedControlProps<TValue extends string> {
  label: string
  name: string
  options: readonly SegmentedOption<TValue>[]
  value: TValue
  onChange: (value: TValue) => void
}

export function SegmentedControl<TValue extends string>({
  label,
  name,
  options,
  value,
  onChange,
}: SegmentedControlProps<TValue>) {
  const activeIndex = options.findIndex((option) => option.value === value)

  return (
    <fieldset className={styles.field}>
      <legend className={styles.label}>{label}</legend>

      <div
        className={styles.track}
        style={cssVars({
          '--count': options.length,
          '--index': Math.max(activeIndex, 0),
        })}
      >
        {activeIndex >= 0 && <span className={styles.indicator} aria-hidden="true" />}

        {options.map((option) => (
          <label
            key={option.value}
            className={cx(styles.option, option.value === value && styles.optionActive)}
          >
            <input
              className={styles.radio}
              type="radio"
              name={name}
              value={option.value}
              checked={option.value === value}
              onChange={() => onChange(option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
