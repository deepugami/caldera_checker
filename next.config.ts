import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', 'ethers'],
  },
  
  // Mobile and PWA optimizations
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          // Mobile viewport optimization
          {
            key: 'viewport',
            value: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
          },
        ],
      },
    ]
  },
  
  // Vercel optimizations
  output: 'standalone',
  
  // Image optimization for better mobile performance
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 420, 768, 1024, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Webpack optimizations for smaller bundle size
  webpack: (config, { isServer }) => {
    // Optimize for mobile
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    }
    
    // Reduce bundle size for mobile
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    return config
  },
  
  // Compression for better mobile loading
  compress: true,
  
  // TypeScript performance
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
}

export default nextConfig;
