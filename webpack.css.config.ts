import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as path from 'path';
import { Configuration } from 'webpack';

async function getConfiguration(): Promise<Configuration> {
  const FilterWebpackOutput = require('filter-webpack-output');

  return {
    mode: 'production',
    entry: {
      main: path.resolve(__dirname, 'src', 'styles', 'main.pcss'),
      danmaku: path.resolve(__dirname, 'src', 'styles', 'danmaku.pcss')
    },
    output: {
      path: path.resolve(__dirname, 'lib')
    },
    resolve: {
      extensions: ['.css', '.scss']
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css'
      }),
      new FilterWebpackOutput(/\.js$/)
    ],
    module: {
      rules: [
        {
          test: /\.pcss$/,
          loaders: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: { importLoaders: 1, sourceMap: false }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: [
                  require('postcss-import')({
                    resolve: require('postcss-import-alias-resolver')({
                      alias: {
                        '~': path.resolve(__dirname, 'node_modules')
                      }
                    })
                  }),
                  require('tailwindcss'),
                  require('postcss-nested'),
                  require('postcss-preset-env')({ stage: 1 }),
                  require('autoprefixer'),
                  require('cssnano')({
                    preset: [
                      'default',
                      {
                        discardComments: {
                          removeAll: true
                        }
                      }
                    ]
                  })
                ]
              }
            }
          ]
        }
      ]
    }
  };
}

export default getConfiguration();
