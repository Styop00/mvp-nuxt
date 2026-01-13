# Design System Documentation

## Overview

This application uses a comprehensive dark theme design system built with Tailwind CSS. The design system is centralized in `config/design-system.ts` and provides consistent colors, typography, spacing, and animations throughout the application.

## Theme Configuration

### Dark Theme Colors

The design system uses a carefully crafted dark color palette:

- **Background Colors:**
  - Primary: `#0F172A` (Slate 900) - Main background
  - Secondary: `#1E293B` (Slate 800) - Cards, panels
  - Tertiary: `#334155` (Slate 700) - Elevated surfaces
  - Hover: `#475569` (Slate 600) - Hover states

- **Text Colors:**
  - Primary: `#F8FAFC` (Slate 50) - Main text
  - Secondary: `#CBD5E1` (Slate 300) - Secondary text
  - Tertiary: `#94A3B8` (Slate 400) - Muted text
  - Disabled: `#64748B` (Slate 500) - Disabled text

- **Brand Colors:**
  - Primary: `#ef4444` (Indigo 500)
  - Secondary: `#00D9C0` (Teal accent)
  - Hover: `#4F46E5` (Indigo 600)
  - Active: `#4338CA` (Indigo 700)

### Usage in Components

Use Tailwind classes with the dark theme colors:

```vue
<!-- Background -->
<div class="bg-dark-bg-primary">Main background</div>
<div class="bg-dark-surface-default">Card background</div>

<!-- Text -->
<p class="text-dark-text-primary">Primary text</p>
<p class="text-dark-text-secondary">Secondary text</p>

<!-- Borders -->
<div class="border border-dark-border-default">Border</div>

<!-- Brand colors -->
<button class="bg-brand-primary-color hover:bg-brand-hover">Button</button>
```

## Page Transitions

The application includes smooth page transitions configured in `nuxt.config.ts`:

- **Page Transition:** Fade and slide animation (300ms)
- **Layout Transition:** Scale and fade animation (300ms)

Transitions are automatically applied to all page navigations.

## Animations

### Available Animations

The design system includes several pre-configured animations:

- `fade-in` / `fade-out` - Opacity transitions
- `slide-in-right` / `slide-in-left` - Horizontal slide animations
- `scale-in` / `scale-out` - Scale animations

### Usage

```vue
<div class="animate-fade-in">Content</div>
<div class="animate-slide-in-right">Content</div>
```

### Custom Transitions

Custom transition classes are available in `assets/css/tailwind.css`:

- `.page-enter-active` / `.page-leave-active` - Page transitions
- `.layout-enter-active` / `.layout-leave-active` - Layout transitions
- `.fade-enter-active` / `.fade-leave-active` - Fade transitions
- `.slide-enter-active` / `.slide-leave-active` - Slide transitions

## Components

### Buttons

Buttons use the brand primary color with hover effects:

```vue
<BaseButton>Click me</BaseButton>
```

### Cards

Cards use the dark surface colors with hover effects:

```vue
<div class="bg-dark-surface-default border border-dark-border-default rounded-xl p-6 shadow-md hover:shadow-lg card-hover">
  Card content
</div>
```

### Inputs

Inputs use dark theme styling:

```vue
<input class="bg-dark-bg-primary border-dark-border-default text-dark-text-primary focus:border-brand-primary-color focus:ring-2 focus:ring-brand-primary-color/20" />
```

## Design Tokens

All design tokens are defined in `config/design-system.ts`:

- Colors
- Typography (font families, sizes, weights)
- Spacing
- Border radius
- Shadows
- Transitions
- Z-index scale
- Breakpoints

## Best Practices

1. **Always use design system colors** - Don't use arbitrary color values
2. **Use semantic color names** - `text-dark-text-primary` instead of `text-white`
3. **Leverage transitions** - Add smooth transitions to interactive elements
4. **Consistent spacing** - Use the spacing scale from the design system
5. **Accessible contrast** - All text colors meet WCAG contrast requirements

## Customization

To customize the theme:

1. Update colors in `config/design-system.ts`
2. Update Tailwind config in `tailwind.config.js`
3. Update global styles in `assets/css/tailwind.css`

## Browser Support

The design system works in all modern browsers that support:
- CSS Custom Properties
- Tailwind CSS
- CSS Grid and Flexbox

