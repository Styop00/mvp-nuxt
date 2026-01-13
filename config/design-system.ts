/**
 * Design System Configuration
 * Centralized theme configuration for the Tourney application
 */

export const designSystem = {
  // Color Palette - Dark Theme
  colors: {
    // Background Colors
    background: {
      primary: '#0F172A',      // Slate 900 - Main background
      secondary: '#1E293B',     // Slate 800 - Cards, panels
      tertiary: '#334155',      // Slate 700 - Elevated surfaces
      hover: '#475569',         // Slate 600 - Hover states
    },
    
    // Surface Colors
    surface: {
      default: '#1E293B',       // Slate 800
      elevated: '#334155',      // Slate 700
      overlay: 'rgba(15, 23, 42, 0.8)', // Overlay backgrounds
    },
    
    // Text Colors
    text: {
      primary: '#F8FAFC',       // Slate 50 - Main text
      secondary: '#CBD5E1',     // Slate 300 - Secondary text
      tertiary: '#94A3B8',      // Slate 400 - Muted text
      disabled: '#64748B',      // Slate 500 - Disabled text
      inverse: '#0F172A',       // For text on light backgrounds
    },
    
    // Brand Colors
    brand: {
      primary: '#ef4444',       // Indigo 500 - Primary brand
      secondary: '#00D9C0',     // Teal accent
      accent: '#8B5CF6',        // Purple accent
      hover: '#4F46E5',         // Indigo 600
      active: '#4338CA',        // Indigo 700
    },
    
    // Semantic Colors
    semantic: {
      success: '#10B981',       // Emerald 500
      warning: '#F59E0B',       // Amber 500
      error: '#EF4444',         // Red 500
      info: '#3B82F6',          // Blue 500
    },
    
    // Border Colors
    border: {
      default: '#334155',       // Slate 700
      light: '#475569',         // Slate 600
      dark: '#1E293B',         // Slate 800
      focus: '#ef4444',        // Indigo 500
    },
    
    // Sidebar Colors
    sidebar: {
      background: '#1E293B',    // Slate 800
      hover: '#334155',         // Slate 700
      active: '#ef4444',        // Indigo 500
      text: '#F8FAFC',         // Slate 50
    },
  },
  
  // Typography
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      display: ['Montserrat', 'system-ui', 'sans-serif'],
      mono: ['ui-monospace', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  
  // Spacing
  spacing: {
    xs: '0.5rem',    // 8px
    sm: '0.75rem',   // 12px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },
  
  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.375rem',   // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
    glow: '0 0 20px rgba(99, 102, 241, 0.3)',
  },
  
  // Transitions
  transitions: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  
  // Z-Index Scale
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
  
  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

export type DesignSystem = typeof designSystem;

