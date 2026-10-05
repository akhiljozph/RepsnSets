import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import { ThemeContext, type ThemeContextValue } from './ThemeContext'
import {
  applyTheme,
  readThemePreference,
  subscribeToSystemTheme,
  systemTheme,
  writeThemePreference,
  type ThemePreference,
} from './themeStorage'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(readThemePreference)
  const osTheme = useSyncExternalStore(subscribeToSystemTheme, systemTheme)

  const resolvedTheme = preference === 'system' ? osTheme : preference

  useEffect(() => {
    applyTheme(resolvedTheme)
  }, [resolvedTheme])

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next)
    writeThemePreference(next)
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({ preference, resolvedTheme, setPreference }),
    [preference, resolvedTheme, setPreference],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
