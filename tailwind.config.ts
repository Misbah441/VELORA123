import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAF8F2',
        surface: '#FFFFFF',
        primary: {
          DEFAULT: '#174C3C',
          hover: '#103B2E',
        },
        text: {
          main: '#202923',
          secondary: '#53615A',
        },
        muted: '#E8F0E9',
        accent: {
          surface: '#FFF1D6',
          text: '#7A4700',
        },
        danger: '#B42318',
        information: '#245B78',
        divider: '#D6DED7',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Malayalam', 'sans-serif'],
      },
      fontSize: {
        base: '16px',
      },
      spacing: {
        '4.5': '18px',
      },
      minHeight: {
        touch: '44px',
      },
      minWidth: {
        touch: '44px',
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
      },
    },
  },
  plugins: [],
};

export default config;
