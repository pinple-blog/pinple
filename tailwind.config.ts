import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-blue-500',
    'bg-green-500', 
    'bg-red-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-gray-500',
    'bg-gradient-to-br',
    'from-gray-50',
    'to-white',
    'rounded-2xl',
    'shadow-sm',
    'border-gray-100',
    'font-light',
    'tracking-wide'
  ]
}
export default config