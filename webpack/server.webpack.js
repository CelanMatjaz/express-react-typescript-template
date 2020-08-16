const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = (env = {}) => {
  const isProduction = env.prod;

  const sourceDir = path.join(process.cwd(), 'src');
  const clientDir = path.join(sourceDir, 'server');
  const clientEntry = path.join(clientDir, 'server.ts');

  const folder = isProduction ? 'release' : 'debug';

  const clientOutputDir = path.join(process.cwd(), 'build', folder);

  const config = {
    mode: isProduction ? 'production' : 'development',
    target: 'node',
    entry: clientEntry,
    output: { path: clientOutputDir, publicPath: '/', filename: 'server.js' },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: ['/node_modules'],
          use: [
            { loader: 'babel-loader' },
            {
              loader: 'awesome-typescript-loader',
              options: {
                lib: ['esnext'],
                transpileOnly: true,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(
          isProduction ? 'production' : 'development'
        ),
      }),
    ],
    externals: [nodeExternals()],
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
  };

  if (!isProduction) config.devtool = 'inline-source-map';

  return config;
};
