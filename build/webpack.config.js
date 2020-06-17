//
// const path = require('path');
// const {CleanWebpackPlugin} = require('clean-webpack-plugin')
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const HtmlWebpackPlugin = require('html-webpack-plugin')
// const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
// let indexLess = new ExtractTextWebpackPlugin('index.less');
// let indexCss = new ExtractTextWebpackPlugin('index.css');
//
// module.exports = {
//     mode:'development', // 开发模式
//     entry: {
//         main:["@babel/polyfill",path.resolve(__dirname,'../src/main.js')],
//         header:["@babel/polyfill",path.resolve(__dirname,'../src/header.js')],
//     },
//     output: {
//         filename: '[name].[hash:8].js',      // 打包后的文件名称
//         path: path.resolve(__dirname,'../dist')  // 打包后的目录
//     },
//     plugins:[
//         new CleanWebpackPlugin(),
//         indexLess,
//         indexCss,
//         new HtmlWebpackPlugin({
//             template:path.resolve(__dirname,'../public/main.html'),
//             filename:'main.html',
//             chunks:['main'] // 与入口文件对应的模块名
//         }),
//         new HtmlWebpackPlugin({
//             template:path.resolve(__dirname,'../public/header.html'),
//             filename:'header.html',
//             chunks:['header'] // 与入口文件对应的模块名
//         }),
//         new MiniCssExtractPlugin({
//             filename: "[name].[hash].css",
//             chunkFilename: "[id].css",
//         })
//     ],
//     module:{
//         rules:[
//             {
//                 test:/\.js$/,
//                 use:{
//                     loader:'babel-loader',
//                     options:{
//                         presets:['@babel/preset-env']
//                     }
//                 },
//                 exclude:/node_modules/
//             },
//             {
//                 test:/\.css$/,
//                 use:indexCss.extract({
//                     use: ['css-loader']
//                 }) // 从右向左解析原则
//             },
//             {
//                 test:/\.less$/,
//                 use:indexLess.extract({
//                     use: ['css-loader','less-loader']
//                 }) // 从右向左解析原则
//             }
//         ]
//     }
// }
//


// vue环境

const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
let indexLess = new ExtractTextWebpackPlugin('index.less');
let indexCss = new ExtractTextWebpackPlugin('index.css');
const vueLoaderPlugin = require('vue-loader/lib/plugin')
const Webpack = require('webpack')

module.exports = {
    mode: 'development', // 开发模式
    entry: {
        index: ["@babel/polyfill", path.resolve(__dirname, '../src/vueMain.js')],
        main: ["@babel/polyfill", path.resolve(__dirname, '../src/main.js')],
        header: ["@babel/polyfill", path.resolve(__dirname, '../src/header.js')],
    },
    output: {
        filename: '[name].[hash:8].js',      // 打包后的文件名称
        path: path.resolve(__dirname, '../dist')  // 打包后的目录
    },
    plugins: [
        new vueLoaderPlugin(),
        new CleanWebpackPlugin(),
        new Webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html'),
            filename: 'index.html',
            chunks: ['index'] // 与入口文件对应的模块名
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../pub.gitignorelic/main.html'),
            filename: 'main.html',
            minify: {
                removeAttributeQuotes: true
            },
            chunks: ['main'] // 与入口文件对应的模块名
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/header.html'),
            filename: 'header.html',
            minify: {
                removeAttributeQuotes: true
            },
            chunks: ['header'] // 与入口文件对应的模块名
        }),
    ],
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.runtime.esm.js',
            ' @': path.resolve(__dirname, '../src')
        },
        extensions: ['*', '.js', '.json', '.vue']
    },

    module: {
        rules: [
            {
                test: /\.vue$/,
                use: ['vue-loader']
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        plugins: [require('autoprefixer')]
                    }
                }]
            },
            {
                test: /\.less$/,
                use: ['vue-style-loader', 'css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        plugins: [require('autoprefixer')]
                    }
                }, 'less-loader']
            }
        ]
    },
    devServer:{
        port:3000,
        hot:true,
        contentBase:'../dist'
    },
}

