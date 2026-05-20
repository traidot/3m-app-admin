import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: process.env.BASEPATH,
  // Redirect rule đã được xóa để sau khi login về trang chủ (/)
  // redirects: async () => {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/vi/dashboards/crm',
  //       permanent: true,
  //       locale: false
  //     }
  //   ]
  // },
  transpilePackages: ['react-datepicker'],
  // Turbopack config (Next.js 16+)
  turbopack: {},
  // Webpack config (fallback for compatibility)
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Resolve date-fns để tránh conflict với react-datepicker
      config.resolve.alias = {
        ...config.resolve.alias,
        'date-fns': require.resolve('date-fns'),
      }
      // Force external date-fns để tránh duplicate
      config.resolve.fallback = {
        ...config.resolve.fallback,
      }
    }
    return config
  },
}

export default nextConfig
