import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    // WebP only: AVIF is ~10x slower to encode, which left slider photos blank
    // for seconds the first time they were picked.
    formats: ['image/webp'],
    deviceSizes: [390, 640, 768, 1024, 1280, 1440, 1920],
    imageSizes: [96, 160, 240, 320, 480],
  },
  experimental: {
    serverActions: { bodySizeLimit: '12mb' },
  },
  poweredByHeader: false,
};

export default withNextIntl(nextConfig);
