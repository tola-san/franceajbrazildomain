import { heroui } from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1400px',
        },
      },
      screens: {
        xs: '0',
        sm: '576px',
        md: '768px',
        lg: '992px',
        xl: '1280px',
        '2xl': '1400px',
        '3xl': '1780px',
        '4xl': '2560px',
        '5xl': '3840px',
      },
      fontFamily: {
        sans: ["var(--font-bricolage-grotesque)"],
        mono: ["var(--font-tanker)"],
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        scroll: 'scroll 10s linear infinite',
      },
    },
  },
  darkMode: "class",
  plugins: [
    require('@tailwindcss/typography'),
    heroui({
      themes: {
        light: {
          colors: {
            'primary': "#311911",
            'secondary': "#FAF4F0",
            'success': '#009B3A',
            'danger': '#ed2939',
            'warning': '#FFB936',
            'content1': '#FFFFFF',
            'background': '#FAF4F0'
          },
        },
        dark: {
          colors: {
            'primary': "#311911",
            'secondary': "#FAF4F0",
            'success': '#009B3A',
            'danger': '#ed2939',
            'warning': '#FFB936',
            'content1': '#FFFFFF',
            'background': '#FAF4F0'
          }
        }
      }
    })
  ],
}

module.exports = config;