/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'cdn2.thedogapi.com',
          port: '',
          pathname: '/images/**',
        },
        {
          protocol: 'https',
          hostname: 'cdn2.thecatapi.com',  // Додатковий хост, якщо потрібно
          port: '',
          pathname: '/images/**',
        },
      ],
    },
  };
  
  export default nextConfig;
  
