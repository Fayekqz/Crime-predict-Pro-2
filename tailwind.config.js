/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
      './pages/**/*.{js,jsx}',
      './components/**/*.{js,jsx}',
      './app/**/*.{js,jsx}',
      './src/**/*.{js,jsx}',
    ],
    prefix: "",
    theme: {
      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1400px",
        },
      },
      extend: {
        colors: {
          border: "var(--color-border)", /* gray-200 */
          input: "var(--color-input)", /* white */
          ring: "var(--color-ring)", /* blue-700 */
          background: "var(--color-background)", /* gray-50 */
          foreground: "var(--color-foreground)", /* gray-800 */
          primary: {
            DEFAULT: "var(--color-primary)", /* blue-700 */
            foreground: "var(--color-primary-foreground)", /* white */
          },
          secondary: {
            DEFAULT: "var(--color-secondary)", /* slate-600 */
            foreground: "var(--color-secondary-foreground)", /* white */
          },
          destructive: {
            DEFAULT: "var(--color-destructive)", /* red-500 */
            foreground: "var(--color-destructive-foreground)", /* white */
          },
          muted: {
            DEFAULT: "var(--color-muted)", /* gray-100 */
            foreground: "var(--color-muted-foreground)", /* gray-500 */
          },
          accent: {
            DEFAULT: "var(--color-accent)", /* amber-500 */
            foreground: "var(--color-accent-foreground)", /* gray-800 */
          },
          popover: {
            DEFAULT: "var(--color-popover)", /* white */
            foreground: "var(--color-popover-foreground)", /* gray-800 */
          },
          card: {
            DEFAULT: "var(--color-card)", /* white */
            foreground: "var(--color-card-foreground)", /* gray-800 */
          },
          success: {
            DEFAULT: "var(--color-success)", /* emerald-500 */
            foreground: "var(--color-success-foreground)", /* white */
          },
          warning: {
            DEFAULT: "var(--color-warning)", /* amber-500 */
            foreground: "var(--color-warning-foreground)", /* gray-800 */
          },
          error: {
            DEFAULT: "var(--color-error)", /* red-500 */
            foreground: "var(--color-error-foreground)", /* white */
          },
        },
        borderRadius: {
          lg: "var(--radius)",
          md: "calc(var(--radius) - 2px)",
          sm: "calc(var(--radius) - 4px)",
        },
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
          mono: ['JetBrains Mono', 'monospace'],
        },
        fontSize: {
          'xs': ['0.75rem', { lineHeight: '1rem' }],
          'sm': ['0.875rem', { lineHeight: '1.25rem' }],
          'base': ['1rem', { lineHeight: '1.5rem' }],
          'lg': ['1.125rem', { lineHeight: '1.75rem' }],
          'xl': ['1.25rem', { lineHeight: '1.75rem' }],
          '2xl': ['1.5rem', { lineHeight: '2rem' }],
          '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
          '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        },
        boxShadow: {
          'sm': '0 1px 3px rgba(0, 0, 0, 0.1)',
          'md': '0 4px 6px rgba(0, 0, 0, 0.1)',
          'lg': '0 10px 25px rgba(0, 0, 0, 0.15)',
          'xl': '0 20px 40px rgba(0, 0, 0, 0.2)',
        },
        animation: {
          "fade-in": "fadeIn 150ms ease-out",
          "slide-in": "slideIn 200ms ease-out",
          "spring": "spring 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        },
        keyframes: {
          fadeIn: {
            "0%": { opacity: "0" },
            "100%": { opacity: "1" },
          },
          slideIn: {
            "0%": { transform: "translateX(-10px)", opacity: "0" },
            "100%": { transform: "translateX(0)", opacity: "1" },
          },
          spring: {
            "0%": { transform: "scale(0.95)", opacity: "0" },
            "100%": { transform: "scale(1)", opacity: "1" },
          },
        },
        transitionTimingFunction: {
          'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
          'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        },
        transitionDuration: {
          '150': '150ms',
          '200': '200ms',
          '300': '300ms',
        },
      },
    },
    plugins: [
      require("tailwindcss-animate"),
    ],
  }