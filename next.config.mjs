const nextConfig = {
  images: {
  remotePatterns: [
    { protocol: "https", hostname: "ecommerce.routemisr.com" },
  ],
},
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
