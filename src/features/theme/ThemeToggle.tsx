import { AutoThemeIcon, MoonIcon, SunIcon } from '@/shared/ui/icons'
import { cx } from '@/shared/utils/cx'
import styles from './ThemeToggle.module.css'
import type { ThemePreference } from './themeStorage'
import { useTheme } from './useTheme'

const OPTIONS: ReadonlyArray<{
  value: ThemePreference
  label: string
  Icon: typeof SunIcon
}> = [
  { value: 'light', label: 'Light theme', Icon: SunIcon },
  { value: 'dark', label: 'Dark theme', Icon: MoonIcon },
  { value: 'system', label: 'Match system theme', Icon: AutoThemeIcon },
]

export function ThemeToggle() {
  const { preference, setPreference } = useTheme()

  return (
    <div className={styles.toggle} role="group" aria-label="Theme">
      {OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          className={cx(styles.option, preference === value && styles.active)}
          aria-pressed={preference === value}
          title={label}
          onClick={() => setPreference(value)}
        >
          <Icon />
          <span className={styles.srOnly}>{label}</span>
        </button>
      ))}
    </div>
  )
}
