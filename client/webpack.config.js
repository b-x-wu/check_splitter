const path = require("path")


module.exports={
    mode: process.env.NODE_ENV ?? "development", 
    entry: "./index.js", 
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "main.js"
    },
    target: "web",
    devServer: {
        port: process.env.PORT ?? "3001",
        static: ["./public"],
        open: true,
        hot: true,
    },
    resolve: {
        extensions: ['.js','.jsx','.json'] 
    },
    module:{
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use:  'babel-loader',
            }
        ]
    }
}
