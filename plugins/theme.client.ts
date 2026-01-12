/**
 * Color Mode Plugin
 * Following Tailwind CSS official pattern: https://tailwindcss.com/docs/dark-mode
 * Initializes color mode system after inline script has applied initial theme
 */
export default defineNuxtPlugin(() => {
  if (process.client) {
    nextTick(() => {
      const { initColorMode, watchSystemTheme } = useColorMode()
      
      // Initialize color mode (syncs with what inline script already applied)
      initColorMode()
      
      // Watch for system theme changes (if no manual preference)
      watchSystemTheme()
      
      // Ensure theme persists during navigation
      // Read directly from localStorage to avoid creating new composable instances
      const router = useRouter()
      router.beforeEach((to, from, next) => {
        const html = document.documentElement
        const storedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null
        
        // Apply theme from localStorage if it exists
        // Otherwise, keep the current class (don't change on navigation)
        if (storedTheme === 'dark') {
          html.classList.add('dark')
          html.classList.remove('light')
          html.style.colorScheme = 'dark'
        } else if (storedTheme === 'light') {
          html.classList.remove('dark')
          html.classList.add('light')
          html.style.colorScheme = 'light'
        }
        // If no stored theme, don't change current state - let it persist
        
        next()
      })
    })
  }
})

