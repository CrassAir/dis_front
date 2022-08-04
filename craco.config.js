const CracoLessPlugin = require("craco-less");

module.exports = {
    output: {
        hashFunction: "sha256"
    },
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: {},
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};