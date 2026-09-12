export type Theme = 'dark' | 'light'

export function useTheme() {
  const theme = useState<Theme>('theme', () => 'dark')

  function setTheme(nextTheme: Theme) {
    theme.value = nextTheme
    if (import.meta.client) {
      document.documentElement.dataset.theme = nextTheme
      localStorage.setItem('theme', nextTheme)
    }
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

  return { theme, setTheme }
}
