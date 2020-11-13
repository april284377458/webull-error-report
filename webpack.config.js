const path = require('path');
const entryPath = path.resolve(__dirname, `./lib/index.js`);
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = () => ({
    entry: {
        index: [entryPath],
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
        library: "errorTool",
        libraryTarget: "umd"
    },
    mode: 'production',
    devtool: 'nosources-source-map',
    module: {
        rules: [
            {
                test: /\.(js)?$/,
                loader: 'babel-loader',
                include: [path.resolve(__dirname, './src')],
                options: {
                    cacheDirectory: true,
                    babelrc: false,
                    sourceMaps: true,
                    presets: [["@babel/preset-env", {
                        "targets": {
                            "browsers": [ "ie >= 10", "chrome >= 58" ] 
                        }
                    }]],
                    plugins: [
                        '@babel/plugin-transform-runtime', 
                        '@babel/plugin-transform-modules-commonjs',
                    ]
                }
            },
            {
                test: /\.(ts)?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                include: [path.resolve(__dirname, './src')],
                options: {
                    cacheDirectory: true,
                    babelrc: false,
                    sourceMaps: true,
                    presets: ['@babel/preset-typescript', ["@babel/preset-env", {
                        "targets": {
                            "browsers": [ "ie >= 8", "chrome >= 58" ] 
                        }
                    }]],
                    plugins: [
                        '@babel/plugin-transform-runtime',
                        '@babel/plugin-transform-typescript',
                        '@babel/plugin-transform-modules-commonjs',
                    ]
                }
            },
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', 'json'],
        modules: [path.resolve('./src'), 'node_modules']
    },
    plugins: [
        new CleanWebpackPlugin(),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({})
        ]
    }
});



