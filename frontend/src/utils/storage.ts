const THEME_KEY = 'gigflow_theme'

export type StoredTheme = 'light' | 'dark'

export const storage = {
  getTheme: (): StoredTheme => {
    const theme = localStorage.getItem(THEME_KEY)
    return theme === 'dark' ? 'dark' : 'light'
  },
  setTheme: (theme: StoredTheme) => localStorage.setItem(THEME_KEY, theme),
}
