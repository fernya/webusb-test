const {ProvidePlugin} = require("webpack");

module.exports = {
    webpack: {
        resolve: {
            fallback: {
                buffer: require.resolve('buffer/'),
            }
        },
        plugins: [
            new ProvidePlugin({
                Buffer: ['buffer', 'Buffer'],
            })
        ],
    }
};