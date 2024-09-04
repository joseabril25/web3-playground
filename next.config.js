const path = require('path');

const moduleExports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  trailingSlash: true,
  i18n: {
    locales: ['en', 'ar'],
    defaultLocale: 'en',
  },
  env: {
    ETHPASS_KEY: process.env.ETHPASS_KEY
  },
};

module.exports = moduleExports;
