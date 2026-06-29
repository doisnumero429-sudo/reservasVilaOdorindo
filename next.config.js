/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // O site público é o HTML/CSS/JS original (visual preservado), servido na raiz.
      { source: '/', destination: '/site/index.html' },
      { source: '/cardapio', destination: '/site/index.html' },
      { source: '/reservar', destination: '/site/index.html' },
      { source: '/atendimento', destination: '/site/index.html' },
    ];
  },
};

module.exports = nextConfig;
