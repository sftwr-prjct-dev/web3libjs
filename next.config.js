module.exports = {
  reactStrictMode: true,
  trailingSlash: true,
  exportPathMap: function () {
    return {
      '/': { page: '/' },
      '/widgets/swap': { page: '/widgets/swap' },
      '/create/swap': { page: '/create/swap' },
    };
  },
};
