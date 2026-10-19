import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Imanes",
    short_name: "Imanes",
    description: "Las fotos de viaje que hay detrás de cada imán de la nevera.",
    lang: "es",
    start_url: "/",
    display: "standalone",
    background_color: "#e9efeb",
    theme_color: "#e9efeb",
    icons: [
      { src: "/iconos/192.png", sizes: "192x192", type: "image/png" },
      { src: "/iconos/512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
