import tailwindcssLogical from 'tailwindcss-logical'
import type { Config } from 'tailwindcss'

// Use require for TypeScript files in Tailwind config (loaded by PostCSS, not TS compiler)
// eslint-disable-next-line @typescript-eslint/no-require-imports
const tailwindPlugin = require('./src/@core/tailwind/plugin.ts').default

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,css}'],
  corePlugins: {
    preflight: false
  },
  important: '#__next',
  plugins: [tailwindcssLogical, tailwindPlugin],
  theme: {
    extend: {}
  }
}

export default config
