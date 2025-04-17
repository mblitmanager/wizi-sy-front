/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      roboto: ['Roboto', 'sans-serif'],
      montserrat: ['Montserrat', 'sans-serif'],
      poppins: ['Poppins', 'sans-serif'],
      nunito: ['Nunito', 'sans-serif'],
    },
    extend: {
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
      backfaceVisibility: {
        hidden: 'hidden',
      },
      rotate: {
        'y-180': 'rotateY(180deg)',
      },
      perspective: {
        '1000': '1000px',
      },
      backgroundColor: {
        background: 'hsl(var(--background))',
        card: 'hsl(var(--card))',
        popover: 'hsl(var(--popover))',
        primary: 'hsl(var(--primary))',
        secondary: 'hsl(var(--secondary))',
        muted: 'hsl(var(--muted))',
        accent: 'hsl(var(--accent))',
        destructive: 'hsl(var(--destructive))',
        input: 'hsl(var(--input))',
      },
      textColor: {
        foreground: 'hsl(var(--foreground))',
        'card-foreground': 'hsl(var(--card-foreground))',
        'popover-foreground': 'hsl(var(--popover-foreground))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        'destructive-foreground': 'hsl(var(--destructive-foreground))',
      },
      borderColor: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      keyframes: {
        'progress-fill': {
          from: { width: '0%' },
          to: { width: '100%' },
        },
      },
      animation: {
        'progress-fill': 'progress-fill 1s ease-in-out',
      },
    },
  },
  plugins: [],
} 