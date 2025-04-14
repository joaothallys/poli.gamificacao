/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.polichat.io",
        port: "",
        pathname: "/gamification/**",
      },
    ],
  },

  // Adicione outras variáveis de ambiente, se necessário
  env: {
    // NEXT_PUBLIC_CLIENTVAR: env.NEXT_PUBLIC_CLIENTVAR,
  },
};

export default config;