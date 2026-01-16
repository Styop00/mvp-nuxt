<template>
  <div class="relative" ref="dropdownContainer">
    <button
      @click.stop="showDropdown = !showDropdown"
      :disabled="isToggling"
      class="relative p-2 rounded-lg transition-all duration-200 ease-in-out
             bg-surface-default
             border border-border-default
             text-text-secondary
             hover:bg-bg-hover
             hover:text-brand-primary
             focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2
             focus:ring-offset-surface-default
             disabled:opacity-50 disabled:cursor-not-allowed"
      :aria-label="currentIsDark ? 'Switch to light mode' : 'Switch to dark mode'"
      :title="currentIsDark ? 'Switch to light mode' : 'Switch to dark mode'"
      ref="toggleButton"
    >
      <div class="relative w-5 h-5 flex items-center justify-center overflow-hidden">
        <!-- Sun icon (shown when in dark mode - click to switch to light) -->
        <Transition
          name="icon-fade"
          mode="out-in"
        >
          <font-awesome
            v-if="showSunIcon"
            key="sun"
            :icon="['fas', 'sun']"
            class="absolute w-4 h-4 transition-[color,opacity,transform] duration-300 ease-in-out text-text-secondary"
          />
          <!-- Moon icon (shown when in light mode - click to switch to dark) -->
          <font-awesome
            v-else
            key="moon"
            :icon="['fas', 'moon']"
            class="absolute w-4 h-4 transition-[color,opacity,transform] duration-300 ease-in-out text-text-secondary"
          />
        </Transition>
      </div>
    </button>

    <!-- Theme Selection Dropdown -->
    <Transition name="fade">
      <div
        v-if="showDropdown"
        class="absolute top-full right-0 mt-2 bg-surface-elevated border border-border-default shadow-lg rounded-lg min-w-[160px] overflow-hidden z-[10000] backdrop-blur-sm"
        ref="dropdownMenu"
      >
        <ul class="py-1">
          <li
            @click="handleThemeSelect('dark', $event)"
            :class="[
              'px-4 py-2 text-sm cursor-pointer transition-[background-color,color] duration-300 ease-in-out flex items-center gap-3 relative',
              currentIsDark
                ? 'bg-bg-hover text-brand-primary font-medium'
                : 'text-text-secondary hover:bg-bg-hover hover:text-brand-primary'
            ]"
            role="menuitem"
          >
            <font-awesome 
              :icon="['fas', 'moon']" 
              class="w-4 h-4 transition-[color,opacity] duration-300 ease-in-out"
              :class="currentIsDark ? 'text-brand-primary' : 'text-text-secondary'"
            />
            <span class="transition-[color] duration-300 ease-in-out">Dark mode</span>
            <Transition name="check-fade">
              <font-awesome
                v-if="currentIsDark"
                key="check-dark"
                :icon="['fas', 'check']"
                class="w-3 h-3 ml-auto text-brand-primary transition-[color,opacity,transform] duration-300 ease-in-out"
              />
            </Transition>
          </li>
          <li
            @click="handleThemeSelect('light', $event)"
            :class="[
              'px-4 py-2 text-sm cursor-pointer transition-[background-color,color] duration-300 ease-in-out flex items-center gap-3 relative',
              !currentIsDark
                ? 'bg-bg-hover text-brand-primary font-medium'
                : 'text-text-secondary hover:bg-bg-hover hover:text-brand-primary'
            ]"
            role="menuitem"
          >
            <font-awesome 
              :icon="['fas', 'sun']" 
              class="w-4 h-4 transition-[color,opacity] duration-300 ease-in-out"
              :class="!currentIsDark ? 'text-brand-primary' : 'text-text-secondary'"
            />
            <span class="transition-[color] duration-300 ease-in-out">Light theme</span>
            <Transition name="check-fade">
              <font-awesome
                v-if="!currentIsDark"
                key="check-light"
                :icon="['fas', 'check']"
                class="w-3 h-3 ml-auto text-brand-primary transition-[color,opacity,transform] duration-300 ease-in-out"
              />
            </Transition>
          </li>
        </ul>
      </div>
    </Transition>

    <!-- Circular Animation Overlay (Ant Design style) -->
    <Teleport to="body">
      <div
        v-if="isAnimating"
        ref="animationOverlay"
        class="theme-switch-overlay"
        :style="animationStyle"
      ></div>
    </Teleport>
  </div>
</template>

<style scoped>
/* Ant Design-style theme switch animation - global styles for teleported element */
:global(.theme-switch-overlay) {
  mix-blend-mode: normal;
  will-change: width, height, opacity;
  /* Ensure smooth rendering during animation */
  backface-visibility: hidden;
  transform: translateZ(0);
  -webkit-font-smoothing: antialiased;
  /* Allow components to be visible through the overlay */
  backdrop-filter: blur(0px);
}

/* Smooth icon transition */
.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
}

.icon-fade-enter-from {
  opacity: 0;
  transform: scale(0.8) rotate(-90deg);
}

.icon-fade-leave-to {
  opacity: 0;
  transform: scale(0.8) rotate(90deg);
}

.icon-fade-enter-to,
.icon-fade-leave-from {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}

/* Check icon transition */
.check-fade-enter-active,
.check-fade-leave-active {
  transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
}

.check-fade-enter-from {
  opacity: 0;
  transform: scale(0.5) translateX(-4px);
}

.check-fade-leave-to {
  opacity: 0;
  transform: scale(0.5) translateX(4px);
}

.check-fade-enter-to,
.check-fade-leave-from {
  opacity: 1;
  transform: scale(1) translateX(0);
}
</style>

<script setup lang="ts">
const { isDark, colorMode, setColorMode, initColorMode } = useColorMode()

const isToggling = ref(false)
const showDropdown = ref(false)
const isAnimating = ref(false)
// Local reactive state for icon display - ensures reactivity
const currentIsDark = ref(false)

// Animation overlay refs and styles
const animationOverlay = ref<HTMLElement | null>(null)
const toggleButton = ref<HTMLElement | null>(null)
const dropdownContainer = ref<HTMLElement | null>(null)
const animationStyle = ref<Record<string, string>>({})

// Sync local state with colorMode changes - ensures reactivity with smooth transitions
watch(() => colorMode.value, (newMode) => {
  // Use requestAnimationFrame to ensure DOM updates happen in sync
  requestAnimationFrame(() => {
    currentIsDark.value = newMode === 'dark'
  })
}, { immediate: true, flush: 'sync' })

// Ensure component syncs with actual DOM state on mount
onMounted(() => {
  if (process.client) {
    // Initialize composable state
    initColorMode()
    
    // Sync local state with actual DOM state (for initial render accuracy)
    currentIsDark.value = document.documentElement.classList.contains('dark')
    
    // Watch for DOM changes (when theme is changed externally)
    // Use debounce to prevent rapid updates during animation
    let updateTimeout: ReturnType<typeof setTimeout> | null = null
    const observer = new MutationObserver(() => {
      if (updateTimeout) clearTimeout(updateTimeout)
      updateTimeout = setTimeout(() => {
        const isDarkNow = document.documentElement.classList.contains('dark')
        if (currentIsDark.value !== isDarkNow) {
          currentIsDark.value = isDarkNow
        }
        // Also sync colorMode.value with DOM
        const html = document.documentElement
        const newMode: 'dark' | 'light' = html.classList.contains('dark') ? 'dark' : 'light'
        if (colorMode.value !== newMode) {
          colorMode.value = newMode
        }
      }, 50) // Small delay to batch updates
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownContainer.value && !dropdownContainer.value.contains(event.target as Node)) {
        showDropdown.value = false
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    
    onUnmounted(() => {
      observer.disconnect()
      document.removeEventListener('click', handleClickOutside)
    })
  }
})

/**
 * Ant Design-style circular expanding animation
 * Creates a subtle overlay that expands from the click point
 * Components remain visible during the transition
 */
const animateThemeSwitch = (clickX: number, clickY: number, newMode: 'dark' | 'light') => {
  if (!process.client || !animationOverlay.value) return

  // Get viewport dimensions
  const width = window.innerWidth
  const height = window.innerHeight
  
  // Calculate the distance from click point to farthest corner
  const distanceToTopLeft = Math.sqrt(clickX ** 2 + clickY ** 2)
  const distanceToTopRight = Math.sqrt((width - clickX) ** 2 + clickY ** 2)
  const distanceToBottomLeft = Math.sqrt(clickX ** 2 + (height - clickY) ** 2)
  const distanceToBottomRight = Math.sqrt((width - clickX) ** 2 + (height - clickY) ** 2)
  
  // Use the maximum distance to ensure full coverage
  const radius = Math.max(
    distanceToTopLeft,
    distanceToTopRight,
    distanceToBottomLeft,
    distanceToBottomRight
  ) + 100 // Add padding to ensure full coverage
  
  // Get the colors for the new theme
  const newBgColor = newMode === 'dark' ? '#0F172A' : '#F8FAFC'
  
  // Apply theme change immediately so components can start transitioning
  setColorMode(newMode)
  
  // Set overlay position and initial size (centered at click point)
  // Use solid background color of new theme (like Ant Design style)
  // Opacity allows components to be visible transitioning underneath
  animationStyle.value = {
    position: 'fixed',
    left: `${clickX}px`,
    top: `${clickY}px`,
    width: '0px',
    height: '0px',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    // Solid background color of the new theme (Ant Design style)
    backgroundColor: newBgColor,
    pointerEvents: 'none',
    zIndex: '999998', // Below dropdown but above page content
    transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1), height 0.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease-out',
    opacity: '0.6', // Semi-transparent so components transitioning are visible underneath
    mixBlendMode: 'normal',
  }
  
  // Force reflow to ensure initial state is applied
  if (animationOverlay.value) {
    animationOverlay.value.offsetHeight
  }
  
  // Trigger animation by expanding to full radius
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (animationOverlay.value) {
        // Expand the overlay (like Ant Design's circular reveal effect)
        animationStyle.value = {
          ...animationStyle.value,
          width: `${radius * 2}px`,
          height: `${radius * 2}px`,
        }
        
        // Gradually reduce opacity as overlay expands so components become more visible
        // This creates the effect where you see components transitioning underneath
        setTimeout(() => {
          if (animationOverlay.value) {
            animationStyle.value = {
              ...animationStyle.value,
              opacity: '0.3', // Reduce opacity to show more of the transitioning components
            }
          }
        }, 300) // Mid-animation
        
        // After animation completes, fade out the overlay completely
        setTimeout(() => {
          if (animationOverlay.value) {
            animationStyle.value = {
              ...animationStyle.value,
              opacity: '0',
            }
            
            // Remove overlay after fade
            setTimeout(() => {
              isAnimating.value = false
              animationStyle.value = {}
              
              // Sync state after animation - ensure smooth update
              requestAnimationFrame(() => {
                if (process.client) {
                  const isDarkNow = document.documentElement.classList.contains('dark')
                  currentIsDark.value = isDarkNow
                  // Force a re-render if needed
                  nextTick(() => {
                    isToggling.value = false
                  })
                } else {
                  isToggling.value = false
                }
              })
            }, 400)
          }
        }, 500)
      }
    })
  })
}

const handleThemeSelect = (mode: 'dark' | 'light', event?: MouseEvent) => {
  if (isToggling.value || (mode === 'dark' && currentIsDark.value) || (mode === 'light' && !currentIsDark.value)) {
    showDropdown.value = false
    return
  }
  
  isToggling.value = true
  showDropdown.value = false
  
  // Get click position from event (menu item) or fallback to button center
  let clickX = window.innerWidth / 2
  let clickY = window.innerHeight / 2
  
  if (event && event.currentTarget) {
    // Get position from clicked menu item
    const target = event.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    clickX = rect.left + rect.width / 2
    clickY = rect.top + rect.height / 2
  } else if (toggleButton.value) {
    // Fallback to button center
    const rect = toggleButton.value.getBoundingClientRect()
    clickX = rect.left + rect.width / 2
    clickY = rect.top + rect.height / 2
  }
  
  // Start animation - ensure overlay is mounted first
  isAnimating.value = true
  
  // Wait for overlay to be mounted in DOM before starting animation
  nextTick(() => {
    // Double-check overlay is ready
    if (animationOverlay.value) {
      animateThemeSwitch(clickX, clickY, mode)
    } else {
      // Retry after a short delay if overlay isn't ready yet
      setTimeout(() => {
        if (animationOverlay.value) {
          animateThemeSwitch(clickX, clickY, mode)
        } else {
          // Fallback: apply theme without animation if overlay fails
          setColorMode(mode)
          isAnimating.value = false
          isToggling.value = false
        }
      }, 10)
    }
  })
}

const handleToggle = () => {
  if (isToggling.value) return
  
  // If clicking the button, just toggle dropdown
  // Animation will happen when selecting from dropdown
  showDropdown.value = !showDropdown.value
}

// Use local state for icon display for immediate reactivity
const showSunIcon = computed(() => currentIsDark.value)
</script>

