/**
 * Color Mode Composable
 * Following Tailwind CSS official pattern: https://tailwindcss.com/docs/dark-mode
 * Manages dark/light theme switching with localStorage persistence and system preference support
 */

export type ColorMode = 'dark' | 'light'

// Shared state to avoid creating multiple instances
const sharedColorMode = ref<ColorMode>('dark')

// Initialize from actual DOM state or localStorage (only on client, after DOM ready)
if (process.client && typeof window !== 'undefined') {
  try {
    const html = document.documentElement
    const storedTheme = localStorage.getItem('theme') as ColorMode | null
    
    if (storedTheme === 'dark' || storedTheme === 'light') {
      sharedColorMode.value = storedTheme
    } else {
      // Check actual DOM state (set by inline script)
      const isDarkInDOM = html.classList.contains('dark')
      sharedColorMode.value = isDarkInDOM ? 'dark' : 'light'
    }
  } catch (e) {
    // Fallback to dark if anything fails
    sharedColorMode.value = 'dark'
  }
}

export const useColorMode = () => {
  // Use shared state so all components share the same reactive reference
  const colorMode = sharedColorMode
  
  // Check if dark mode is active - reactive to colorMode.value changes
  // This is fully reactive because colorMode.value is a ref
  const isDark = computed(() => colorMode.value === 'dark')
  const isLight = computed(() => colorMode.value === 'light')
  
  /**
   * Initialize color mode on client side
   * Syncs shared state with actual DOM state and localStorage
   */
  const initColorMode = () => {
    if (process.client) {
      const html = document.documentElement
      const storedTheme = localStorage.getItem('theme') as ColorMode | null
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      
      // Priority: stored theme > current DOM state > system preference > default to dark
      let newTheme: ColorMode
      
      if (storedTheme === 'dark' || storedTheme === 'light') {
        newTheme = storedTheme
      } else {
        // Check what's already applied by inline script
        const currentClass = html.classList.contains('dark') ? 'dark' : 'light'
        newTheme = currentClass
      }
      
      // Update shared state
      colorMode.value = newTheme
      
      // Only apply if different from what's already set (avoid flicker)
      const currentIsDark = html.classList.contains('dark')
      if ((newTheme === 'dark' && !currentIsDark) || 
          (newTheme === 'light' && currentIsDark)) {
        applyColorMode(newTheme)
      }
    }
  }
  
  /**
   * Apply color mode to HTML element
   * Following Tailwind's class-based dark mode pattern
   */
  const applyColorMode = (mode: ColorMode) => {
    if (!process.client) return
    
    const html = document.documentElement
    
    if (mode === 'dark') {
      html.classList.add('dark')
      html.style.colorScheme = 'dark'
    } else {
      html.classList.remove('dark')
      html.style.colorScheme = 'light'
    }
  }
  
  /**
   * Set color mode preference
   * Following Tailwind CSS official pattern:
   * https://tailwindcss.com/docs/dark-mode#with-system-theme-support
   */
  const setColorMode = (mode: ColorMode) => {
    if (!process.client) return
    
    // Update shared state FIRST so components react immediately
    colorMode.value = mode
    // Store in localStorage
    localStorage.setItem('theme', mode)
    // Apply to DOM
    applyColorMode(mode)
  }
  
  /**
   * Toggle between dark and light mode
   * Reads from DOM for accuracy, updates reactive state FIRST for immediate reactivity
   */
  const toggleColorMode = () => {
    if (!process.client) return
    
    // Read from actual DOM state for accuracy (not reactive ref which might be stale)
    const html = document.documentElement
    const currentIsDark = html.classList.contains('dark')
    const newMode: ColorMode = currentIsDark ? 'light' : 'dark'
    
    // Update reactive state FIRST - this triggers computed/watch updates immediately
    colorMode.value = newMode
    
    // Store in localStorage
    localStorage.setItem('theme', newMode)
    
    // Apply to DOM (this will match what we set in reactive state)
    applyColorMode(newMode)
  }
  
  /**
   * Clear preference to respect system theme
   * Following Tailwind's pattern for three-way toggle
   */
  const clearPreference = () => {
    if (!process.client) return
    
    localStorage.removeItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const newMode: ColorMode = prefersDark ? 'dark' : 'light'
    colorMode.value = newMode
    applyColorMode(newMode)
  }
  
  /**
   * Watch for system theme changes
   * Only applies if no manual preference is set
   */
  const watchSystemTheme = () => {
    if (process.client && !localStorage.getItem('theme')) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      
      const handleChange = (e: MediaQueryListEvent) => {
        // Only update if no manual preference is set
        if (!localStorage.getItem('theme')) {
          const newMode: ColorMode = e.matches ? 'dark' : 'light'
          colorMode.value = newMode
          applyColorMode(newMode)
        }
      }
      
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange)
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange)
      }
    }
  }
  
  return {
    colorMode, // Expose reactive reference (components can read, but use setColorMode to write)
    isDark,
    isLight,
    initColorMode,
    setColorMode,
    toggleColorMode,
    clearPreference,
    watchSystemTheme,
  }
}

