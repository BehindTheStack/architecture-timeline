/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output para Docker otimizado
  output: 'standalone',
  
  // Otimizações de imagem
  images: {
    unoptimized: true,
  },
  
  // Desabilitar sourcemaps em produção
  productionBrowserSourceMaps: false,
  
  // Otimizações de build
  swcMinify: true,
  
  // Configurações de performance
  compress: true,
  poweredByHeader: false,
  
  // Configurações experimentais
  experimental: {
    // Otimizar pacotes externos
    optimizePackageImports: ['lucide-react'],
  },
}

module.exports = nextConfig
