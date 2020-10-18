const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = () => ({
  mode: "development",
  cache: false,
  devtool: "source-map",
  optimization: {
    minimize: false,
  },
  target: "web",
  entry: path.resolve(__dirname, "./src/main.ts"),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
    publicPath: '/',
    chunkFilename: 'js/[name].js'
  },
  resolve: {
    extensions: [".tsx", ".ts", ".vue", ".jsx", ".js", ".json"],
    alias: {
      "@": path.resolve(__dirname, "src"),
      vue: "@vue/runtime-dom",
    },
    modules: [
      "node_modules",
    ]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "babel-loader"
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: "vue-loader",
            options: {
              babelParserPlugins: [
                'jsx',
                'classProperties',
                'decorators-legacy'
              ]
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 4096,
              fallback: {
                loader: "file-loader",
                options: {
                  name: "img/[name].[hash:8].[ext]"
                }
              }
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'vue-style-loader',
            options: {
              sourceMap: false,
              shadowMode: false
            }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              importLoaders: 2
            }
          },
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'vue-style-loader',
            options: {
              sourceMap: false,
              shadowMode: false
            }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: false,
              importLoaders: 2
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false,
            }
          },
        ]
      }
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial'
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    },
  },
  plugins: [
    new webpack.DefinePlugin(
      {
        'process.env': {
          NODE_ENV: '"development"',
          BASE_URL: '"/"'
        }
      }
    ),
    new ModuleFederationPlugin({
      name: "layout",
      filename: "remoteEntry.js",
      remotes: {
        home: "home@http://localhost:3002/remoteEntry.js",
      },
      exposes: {},
    }),
    new CaseSensitivePathsPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./public/index.html"),
      chunks: ["main"],
    }),
    new VueLoaderPlugin(),
  ],
  devServer: {
    contentBase: path.join(__dirname),
    compress: true,
    port: 3001,
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
  },
});
