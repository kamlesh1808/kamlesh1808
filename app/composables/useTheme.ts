export type Theme = 'dark' | 'light'

const themeIcons: Record<Theme, string> = {
  dark: 'fa-solid fa-sun',
  light: 'fa-solid fa-moon',
}

const themeToggleLabels: Record<Theme, string> = {
  dark: 'Use light theme',
  light: 'Use dark theme',
}

const nextThemes: Record<Theme, Theme> = {
  dark: 'light',
  light: 'dark',
}

export function useTheme() {
  const theme = useState<Theme>('theme', () => 'dark')
  const isDark = computed(() => theme.value === 'dark')
  const themeIcon = computed(() => themeIcons[theme.value])
  const themeToggleLabel = computed(() => themeToggleLabels[theme.value])

  function setTheme(nextTheme: Theme) {
    theme.value = nextTheme
    if (import.meta.client) {
      document.documentElement.dataset.theme = nextTheme
      localStorage.setItem('theme', nextTheme)
    }
  }

  function toggleTheme() {
    setTheme(nextThemes[theme.value])
  }

  if (import.meta.client) {
    onMounted(() => {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setTheme(savedTheme)
      } else {
        document.documentElement.dataset.theme = theme.value
      }
    })
  }

  return { theme, setTheme, isDark, themeIcon, themeToggleLabel, toggleTheme }
}
