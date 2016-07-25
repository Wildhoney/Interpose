require('babel-loader');

module.exports = {
    entry: './src/interpose.js',
    output: {
        path: __dirname + '/dist',
        filename: 'interpose.js',
        library: 'interpose',
        libraryTarget: 'commonjs2'
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

