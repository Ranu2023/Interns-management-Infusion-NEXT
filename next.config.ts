
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // These modules are optional dependencies of genkit and opentelemetry.
    // They are not required for the app to run, but they can cause
    // build warnings if they are not present.
    // We can ignore them to suppress the warnings.
    if (isServer) {
        config.externals.push('@opentelemetry/exporter-jaeger');
        config.externals.push('@genkit-ai/firebase');
    }
    return config;
  }
};

export default nextConfig;
