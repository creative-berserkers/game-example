module.exports = {
    entry: "./public/js/game.js",
    output: {
        path: __dirname,
        filename: "./public/bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" }
        ]
    },
    devServer: {
        contentBase: "./public",
        noInfo: false, //  --no-info option
        hot: true,
        inline: true
    }
};