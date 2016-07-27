require('babel-loader');

module.exports = {
    entry: './example/js/index.js',
    output: {
        path: __dirname + '/example/js',
        filename: 'build.js',
        libraryTarget: 'var'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'stage-0']
                }
            }
        ]
    }
};
