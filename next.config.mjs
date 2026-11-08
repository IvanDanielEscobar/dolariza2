/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["192.168.100.67", "localhost", "127.0.0.1"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/realBrasileño",
        destination: "/divisas",
        permanent: true,
      },
      {
        source: "/real-brasileno",
        destination: "/divisas",
        permanent: true,
      },
      {
        source: "/pesoChileno",
        destination: "/divisas",
        permanent: true,
      },
      {
        source: "/pesoUruguayo",
        destination: "/divisas",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
