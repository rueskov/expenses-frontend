const { override, addBabelPlugin, addWebpackModuleRule } = require('customize-cra');

module.exports = override(
  addBabelPlugin('@babel/plugin-proposal-class-properties'),
  addWebpackModuleRule({
    test: /\.(js|jsx)$/,
    exclude: /node_modules\/(?!(chart.js)\/).*/, 
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env', '@babel/preset-react'],
        plugins: ['@babel/plugin-proposal-class-properties']
      },
    },
  })
);
