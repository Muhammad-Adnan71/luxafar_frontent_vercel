/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  headers: async () => [
    {
      source: "/:path*", // Match all routes
      headers: [
        {
          key: "X-Robots-Tag",
          value: "index, follow", // Customize the value as needed
        },
      ],
    },
  ],
  webpack: (config, { dev }) => {
    if (!dev) {
      config.optimization.minimize = true;
    }
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/en",
      },
      {
        source: "/bespoke-holiday",
        destination: "/en/bespoke-holiday",
      },
      {
        source: "/:locale((?!en$|fr$|es$|it$|ru$|zh$)[\\w-]+)",
        destination: "/en/:locale*",
      },
      {
        source: "/destination",
        destination: "/en/destination",
      },
      {
        source: "/destination/:path*",
        destination: "/en/destination/:path*",
      },
      {
        source: "/tours",
        destination: "/en/tours",
      },
      {
        source: "/holiday-types",
        destination: "/en/holiday-types",
      },
      {
        source: "/holiday-types/:path*",
        destination: "/en/holiday-types/:path*",
      },
      {
        source: "/inspirations",
        destination: "/en/inspirations",
      },
      {
        source: "/inspirations/:path*",
        destination: "/en/inspirations/:path*",
      },
      {
        source: "/about",
        destination: "/en/about",
      },

      {
        source: "/contact",
        destination: "/en/contact",
      },
      {
        source: "/shop",
        destination: "/en/shop",
      },
      {
        source: "/shop/:path*",
        destination: "/en/shop/:path*",
      },
      {
        source: "/privacy-policy",
        destination: "/en/privacy-policy",
      },

      {
        source: "/terms-and-conditions",
        destination: "/en/terms-and-conditions",
      },
      {
        source: "/cookies-policy",
        destination: "/en/cookies-policy",
      },
      {
        source: "/become-a-partner",
        destination: "/en/become-a-partner",
      },
      {
        source: "/team",
        destination: "/en/team",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/feed",
        destination: "/rss.xml",
        permanent: true,
      },

      // {
      //   source: "/destination/:path*",
      //   destination: "/",
      //   permanent: true,
      //   statusCode: 301,
      // },
      {
        source: "/:locale/destination/:destinationName/tours/:tourName", // Old URL pattern
        destination: "/:locale/:tourName", // New URL pattern with only the tour name
        permanent: true, // 301 redirect
        statusCode: 301,
      },
      {
        source: "/:locale/destination/:destinationName", // Old URL pattern
        destination: "/:locale/:destinationName", // New URL pattern with only the tour name
        permanent: true, // 301 redirect
        statusCode: 301,
      },
      {
        source: "/:locale/inspirations/:destinationName/:inspirationName", // Old URL pattern
        destination: "/:locale/:inspirationName", // New URL pattern with only the tour name
        permanent: true, // 301 redirect
        statusCode: 301,
      },
      {
        source: "/:locale/destination/:destinationName/place/:placeName", // Old URL pattern
        destination: "/:locale/:placeName", // New URL pattern with only the tour name
        permanent: true, // 301 redirect
        statusCode: 301,
      },
      {
        source: "/destination/:destinationName/tours/:tourName", // Old URL pattern
        destination: "/:tourName", // New URL pattern with only the tour name
        permanent: true, // 301 redirect
        statusCode: 301,
      },
      {
        source: "/destination/:destinationName", // Old URL pattern
        destination: "/:destinationName", // New URL pattern with only the tour name
        permanent: true, // 301 redirect
        statusCode: 301,
      },
      {
        source: "/inspirations/:destinationName/:inspirationName", // Old URL pattern
        destination: "/:inspirationName", // New URL pattern with only the tour name
        permanent: true, // 301 redirect
        statusCode: 301,
      },
      {
        source: "/destination/:destinationName/place/:placeName", // Old URL pattern
        destination: "/:placeName", // New URL pattern with only the tour name
        permanent: true, // 301 redirect
        statusCode: 301,
      },
      // {
      //   source: "/:locale(en|fr|es|it|ru|zh)/destination/:path*",
      //   destination: "/",
      //   permanent: true,
      //   statusCode: 301,
      // },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "luxafar.s3.amazonaws.com",
      },
    ],
  },
};
