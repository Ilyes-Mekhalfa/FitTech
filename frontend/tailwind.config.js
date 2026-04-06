
module.exports = {
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Red - Energy and Action
        'primary': '#b90014',
        'primary-container': '#e31b23',
        'on-primary': '#ffffff',
        'on-primary-container': '#fff9f8',
        'primary-fixed': '#ffdad6',
        'primary-fixed-dim': '#ffb4ac',
        'on-primary-fixed': '#410002',
        'on-primary-fixed-variant': '#93000d',
        'inverse-primary': '#ffb4ac',

        // Secondary - Neutral Greys
        'secondary': '#5f5e5e',
        'secondary-container': '#e2dfde',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#636262',
        'secondary-fixed': '#e5e2e1',
        'secondary-fixed-dim': '#c8c6c5',
        'on-secondary-fixed': '#1b1b1c',
        'on-secondary-fixed-variant': '#474746',

        // Tertiary - Blue Accent
        'tertiary': '#005f93',
        'tertiary-container': '#0079b9',
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#f9faff',
        'tertiary-fixed': '#cde5ff',
        'tertiary-fixed-dim': '#94ccff',
        'on-tertiary-fixed': '#001d32',
        'on-tertiary-fixed-variant': '#004b74',

        // Surface - Background Hierarchy
        'background': '#f9f9f9',
        'on-background': '#1a1c1c',
        'surface': '#f9f9f9',
        'on-surface': '#1a1c1c',
        'on-surface-variant': '#5d3f3c',
        'surface-bright': '#f9f9f9',
        'surface-dim': '#dadada',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f3f3f3',
        'surface-container': '#eeeeee',
        'surface-container-high': '#e8e8e8',
        'surface-container-highest': '#e2e2e2',
        'surface-variant': '#e2e2e2',
        'surface-tint': '#c00015',
        'inverse-surface': '#2f3131',
        'inverse-on-surface': '#f1f1f1',

        // Error - Critical States
        'error': '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error': '#ffffff',
        'on-error-container': '#93000a',

        // Outlines - Borders & Dividers
        'outline': '#926e6b',
        'outline-variant': '#e7bdb8',
      },

      fontFamily: {
        // Typography System
        'headline': ['Lexend', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'label': ['Inter', 'sans-serif'],
      },

      fontSize: {
        // Display Scale
        'display-lg': ['3.5rem', { lineHeight: '1.2', letterSpacing: '-0.015em' }],
        'display-md': ['2.8rem', { lineHeight: '1.2', letterSpacing: '-0.015em' }],
        'display-sm': ['2.2rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],

        // Headline Scale
        'headline-lg': ['2rem', { lineHeight: '1.3', letterSpacing: '0' }],
        'headline-md': ['1.75rem', { lineHeight: '1.3', letterSpacing: '0' }],
        'headline-sm': ['1.5rem', { lineHeight: '1.4', letterSpacing: '0' }],

        // Title Scale
        'title-lg': ['1.375rem', { lineHeight: '1.4', letterSpacing: '0' }],
        'title-md': ['1.125rem', { lineHeight: '1.5', letterSpacing: '0.009em' }],
        'title-sm': ['1rem', { lineHeight: '1.5', letterSpacing: '0.1em' }],

        // Body Scale
        'body-lg': ['1rem', { lineHeight: '1.5', letterSpacing: '0.5px' }],
        'body-md': ['0.875rem', { lineHeight: '1.43', letterSpacing: '0.25px' }],
        'body-sm': ['0.75rem', { lineHeight: '1.33', letterSpacing: '0.4px' }],

        // Label Scale
        'label-lg': ['0.875rem', { lineHeight: '1.43', letterSpacing: '0.1em' }],
        'label-md': ['0.75rem', { lineHeight: '1.33', letterSpacing: '0.5em' }],
        'label-sm': ['0.6875rem', { lineHeight: '1.27', letterSpacing: '0.1em' }],
      },

      fontWeight: {
        'thin': '300',
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900',
      },

      borderRadius: {
        // No-Line Rule: Minimal roundedness
        'none': '0',
        'xs': '0.0625rem',     // 1px - Micro elements
        'sm': '0.125rem',      // 2px - Small components
        'md': '0.25rem',       // 4px - Standard buttons, inputs
        'lg': '0.5rem',        // 8px - Cards, modals
        'xl': '0.75rem',       // 12px - Large containers
        'full': '9999px',      // Circles and pills
      },

      spacing: {
        // Material Design 3 Spacing Scale
        'xs': '0.25rem',       // 4px
        'sm': '0.5rem',        // 8px
        'md': '1rem',          // 16px
        'lg': '1.5rem',        // 24px
        'xl': '2rem',          // 32px
        '2xl': '3rem',         // 48px
        '3xl': '4rem',         // 64px
      },

      boxShadow: {
        // Ambient light shadows (not "pop" shadows)
        'xs': '0 1px 2px 0 rgba(26, 28, 28, 0.05)',
        'sm': '0 2px 4px 0 rgba(26, 28, 28, 0.06)',
        'md': '0 4px 8px 0 rgba(26, 28, 28, 0.08)',
        'lg': '0 8px 16px 0 rgba(26, 28, 28, 0.1)',
        'xl': '0 12px 24px 0 rgba(26, 28, 28, 0.12)',
        '2xl': '0 20px 40px 0 rgba(26, 28, 28, 0.06)',
        '3xl': '0 25px 50px 0 rgba(26, 28, 28, 0.1)',
        
        // Primary red shadows
        'primary-sm': '0 2px 4px 0 rgba(185, 0, 20, 0.1)',
        'primary-md': '0 4px 12px 0 rgba(185, 0, 20, 0.15)',
        'primary-lg': '0 8px 24px 0 rgba(185, 0, 20, 0.2)',
      },

      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },

      opacity: {
        '5': '0.05',
        '10': '0.1',
        '15': '0.15',
        '20': '0.2',
        '25': '0.25',
        '30': '0.3',
        '40': '0.4',
        '50': '0.5',
        '60': '0.6',
        '70': '0.7',
        '80': '0.8',
        '90': '0.9',
        '95': '0.95',
      },

      transitionDuration: {
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
      },

      transitionTimingFunction: {
        'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'standard': 'cubic-bezier(0.2, 0, 0, 1)',
      },

      // Custom Gradients
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #e31b23 0%, #b90014 100%)',
        'gradient-primary-light': 'linear-gradient(135deg, #e31b23 0%, #c00015 100%)',
        'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      },

      // Aspect Ratios
      aspectRatio: {
        'square': '1 / 1',
        'video': '16 / 9',
        'card': '4 / 5',
      },

      // Z-Index Scale
      zIndex: {
        'hide': '-1',
        'auto': 'auto',
        'base': '0',
        'dropdown': '100',
        'sticky': '200',
        'fixed': '300',
        'modal-bg': '400',
        'modal': '500',
        'popover': '600',
        'tooltip': '700',
      },
    },
  },

  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],

  // Safelist for dynamic classes
  safelist: [
    // Status colors
    'text-tertiary-fixed',
    'bg-tertiary-fixed',
    'text-error-container',
    'bg-error-container',
    // Grid columns
    { pattern: /^grid-cols-\d+$/ },
    { pattern: /^col-span-\d+$/ },
    // Width utilities
    { pattern: /^w-\d+\/\d+$/ },
  ],
};