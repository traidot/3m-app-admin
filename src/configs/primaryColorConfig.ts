export type PrimaryColorConfig = {
  name?: string
  light?: string
  main: string
  dark?: string
}

// Primary color config object
// Updated based on storefront theme with additional color options
const primaryColorConfig: PrimaryColorConfig[] = [
  {
    name: 'esim',
    light: '#818CF8',
    main: '#4F46E5',
    dark: '#3730A3'
  }
]

export default primaryColorConfig
