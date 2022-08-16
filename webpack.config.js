const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',

    entry: {
        main: path.resolve(__dirname, 'src/index.js'),
        player_1: path.resolve(__dirname, 'src/scripts/sprites/player_1.js'),
        player_movement: path.resolve(__dirname, 'src/scripts/actions/player_movement.js'),
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

            // JS
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },

            // CSS
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },

            // Images
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                use: [{
                    loader: 'file-loader',
                    options: {
                        outputPath: 'assets/images/'
                    }
                }]
            },

            // Models
            {
                test: /\.(glb|gltf|fbx|obj)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        outputPath: 'assets/models/'
                    }
                }]
            },

            // Url
            {
                test: /\.hdr$/,
                use: "url-loader"
            },
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