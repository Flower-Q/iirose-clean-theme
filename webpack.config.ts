import * as path from 'path';
import { promisify } from 'util';
import { Configuration } from 'webpack';
import WebpackUserscript = require('webpack-userscript');

const isProduction = process.env.NODE_ENV === 'production';

async function getConfiguration(): Promise<Configuration> {
  const readPackageJson = require('read-package-json');
  const { name } = await promisify(readPackageJson)('./package.json');

  return {
    mode: isProduction ? 'production' : 'development',
    entry: path.resolve(__dirname, 'src', 'index.ts'),
    output: {
      path: path.resolve(__dirname, 'lib'),
      filename: `${name}.user.js`
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.css', '.scss']
    },
    devServer: {
      contentBase: path.resolve(__dirname, 'lib')
    },
    plugins: [
      new WebpackUserscript({
        headers: {
          version: isProduction ? '[version]' : '[version]-build.[buildNo]',
          include: 'https://iirose.com/messages.html'
        }
      })
    ],
    module: {
      rules: [
        {
          test: /\.pcss$/,
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
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    }
  };
}

export default getConfiguration();
