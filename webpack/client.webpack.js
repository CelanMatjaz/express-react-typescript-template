const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env = {}) => {
  const isProduction = env.prod;

  const sourceDir = path.join(process.cwd(), 'src');
  const clientDir = path.join(sourceDir, 'client');
  const clientEntry = path.join(clientDir, 'index.tsx');

  const folder = isProduction ? 'release' : 'debug';

  const clientOutputDir = path.join(process.cwd(), 'build', folder, 'public');

  const config = {
    mode: isProduction ? 'production' : 'development',
    target: 'web',
    entry: clientEntry,
    output: {
      path: clientOutputDir,
      publicPath: '/',
      filename: isProduction ? 'bundle.js' : 'bundle.[hash].js',
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: ['/node_modules'],
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-env',
                  '@babel/preset-react',
                  '@babel/preset-typescript',
                ],
                plugins: ['@babel/plugin-transform-template-literals'],
              },
            },
            {
              loader: 'awesome-typescript-loader',
              options: {
                lib: ['ES6'],
                transpileOnly: true,
              },
            },
          ],
        },
        {
          test: /\.(scss|sass)$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        // Change index.html title here
        title: 'Express-React template with wepback',
        template: path.join(clientDir, 'template.html'),
        minify: isProduction,
      }),
      new MiniCssExtractPlugin({
        filename: isProduction ? 'style.css' : 'style.[hash].css',
      }),
    ],
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
  };

  if (!isProduction) config.devtool = 'inline-source-map';

  return config;
};
