const webpack = require('webpack');

module.exports = {
  // ... other Webpack configurations ...

  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
};
