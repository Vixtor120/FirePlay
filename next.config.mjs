import withPWA from 'next-pwa';

const nextConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})({
  // Otras configuraciones de Next.js
  images: {
    domains: ['media.rawg.io'], // Dominio para las imágenes de RAWG API
  },
});

export default nextConfig;
