const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    
    entry: {
        main: path.resolve(__dirname, 'src/index.js')
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        clean: true,
        assetModuleFilename: '[name][ext]'
    },

    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist')
        },
        port: 3000,
        open: true,
        hot: true,
        compress: true,
        historyApiFallback: true
    },

    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: 'Space Invaders 3d',
            filename: 'index.html',
            template: 'src/template.html'
        })
    ]
}