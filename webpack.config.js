module.exports = {
    entry: './client/js/game.js',
    output: {
        path: __dirname,
        filename: './client/bundle.js'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: 'style!css' }
        ]
    },
    devtool : 'source-map',
    devServer: {
        contentBase: './client',
        noInfo: false, //  --no-info option
        hot: true,
        inline: true
    }
};