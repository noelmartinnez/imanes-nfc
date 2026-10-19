import type { NextConfig } from "next";

// Todo el contenido sale de content/ en el build, así que cada página es estática.
// (Sin cacheComponents para que las rutas desconocidas den un 404 de verdad.)
const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // content/ se lee con fs: que viaje con las funciones del servidor en Vercel.
  outputFileTracingIncludes: {
    "/*": ["./content/**/*.json"],
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
