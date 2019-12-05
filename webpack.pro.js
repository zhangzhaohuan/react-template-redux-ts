const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
const autoprefixer = require('autoprefixer');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { DefinePlugin } = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


module.exports = {
    mode: 'production',
    entry: {
        index: './src/index.tsx',
    },
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'static/js/[name].[hash:8].js',
        chunkFilename: '[name].[chunkhash:8].chunk.js'
    },
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    module: {
        rules: [
            {
                oneOf: [
                    {
                        test: /\.(js|jsx)$/,
                        use: 'babel-loader',
                        include: path.join(__dirname, 'src'),
                    },
                    {
                        test: /\.(ts|tsx)$/,
                        include: path.join(__dirname, 'src'),
                        use: [
                            {
                                loader: require.resolve('babel-loader'),
                            },
                            {
                                loader: require.resolve('ts-loader'),
                                options: {
                                    // disable type checker - we will use it in fork plugin
                                    transpileOnly: true,
                                },
                            },
                        ],
                    },
                    {
                        test: /\.css$/,
                        exclude: /\.module\.css$/,
                        use: [
                            {
                                loader: MiniCssExtractPlugin.loader,
                            },
                            {
                                loader: require.resolve('css-loader'),
                                options: {
                                    importLoaders: 1,
                                    // sourceMap: true,
                                },
                            },
                            {
                                loader: require.resolve('postcss-loader'),
                                options: {
                                    // Necessary for external CSS imports to work
                                    // https://github.com/facebookincubator/create-react-app/issues/2677
                                    ident: 'postcss',
                                    plugins: () => [
                                        require('postcss-flexbugs-fixes'),
                                        autoprefixer({
                                            overrideBrowserslist: [
                                                '>1%',
                                                'last 4 versions',
                                                'Firefox ESR',
                                                'not ie < 9', // React doesn't support IE8 anyway
                                            ],
                                            flexbox: 'no-2009',
                                        }),
                                    ],
                                },
                            },
                        ]
                    },
                    {
                        test: /\.module\.css$/,
                        use: [
                            {
                                loader: MiniCssExtractPlugin.loader,
                            },
                            {
                                loader: require.resolve('css-loader'),
                                options: {
                                    importLoaders: 1,
                                    modules: true,
                                    // sourceMap: true,
                                },
                            },
                            {
                                loader: require.resolve('postcss-loader'),
                                options: {
                                    // Necessary for external CSS imports to work
                                    // https://github.com/facebookincubator/create-react-app/issues/2677
                                    ident: 'postcss',
                                    plugins: () => [
                                        require('postcss-flexbugs-fixes'),
                                        autoprefixer({
                                            overrideBrowserslist: [
                                                '>1%',
                                                'last 4 versions',
                                                'Firefox ESR',
                                                'not ie < 9', // React doesn't support IE8 anyway
                                            ],
                                            flexbox: 'no-2009',
                                        }),
                                    ],
                                },
                            },
                        ]
                    },
                    {
                        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                        use: [
                            {
                                loader: 'url-loader',
                                options: {
                                    limit: 10240,
                                    name: 'static/image/[name].[hash:8].[ext]'
                                }
                            }
                        ]
                    },
                    {
                        test: /.(woff|woff2|eot|ttf|otf)$/,
                        loader: 'file-loader',
                        options: {
                            name: 'static/media/[name].[hash:8].[ext]'
                        }
                    },
                    //放在最后，处理没被其他loader处理的文件
                    {
                        exclude: [/\.(js|jsx)$/, /\.(ts|tsx)$/, /\.html$/, /\.json$/, /\.(sa|sc|c)ss$/],
                        loader: 'file-loader',
                        options: {
                            name: 'static/other/[name].[hash:8].[ext]'
                        }
                    }
                ]
            }

        ]
    },
    optimization: {
        splitChunks: {
            chunks: 'all',      //[all、initial、async]:[所有、入口、异步]
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,        //每个异步模块的最大并发请求数：注意：同时又两个模块满足拆分条件的时候更大的包会先被拆分
            maxInitialRequests: 3,      //每个入口文件的最大并发请求数：注意：同时又两个模块满足拆分条件的时候更大的包会先被拆分
            automaticNameDelimiter: '~',
            name: 'custom_common_chunk',
            // splitChunks的配置项都是作用于cacheGroup上的，
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10  //权重
                },
                default: {
                    minChunks: 2,
                    priority: -20,  //权重
                    reuseExistingChunk: true
                }
            }
        }
    },
    externals: {
        React: "react",
        ReactDOM: "react-dom"
    },
    plugins: [
        new FriendlyErrorsWebpackPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'public/index.html'),
            filename: 'index.html',
            chunks: ['index', 'custom_common_chunk'],
            // chunks: ['index'],
            inject: true,
            minify: {
                html5: true,
                collapseWhitespace: true,
                preserveLineBreaks: false,
                minifyCSS: true,
                minifyJS: true,
                removeComments: false
            }
        }),
        // new HtmlWebpackExternalsPlugin({
        //     externals: [
        //         {
        //             module: 'react',
        //             entry: 'https://11.url.cn/now/lib/16.2.0/react.min.js',
        //             global: 'React',
        //         },
        //         {
        //             module: 'react-dom',
        //             entry: 'https://11.url.cn/now/lib/16.2.0/react-dom.min.js',
        //             global: 'ReactDOM',
        //         },
        //     ],
        // }),
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[hash:8].css',
            chunkFilename: '[id].[hash:8].css',
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default', { discardComments: { removeAll: true } }],
            },
            canPrint: true
        }),
        new DefinePlugin({
            'process.env': JSON.stringify(process.env)
        }),
        new BundleAnalyzerPlugin({
            //  可以是`server`，`static`或`disabled`。
            //  在`server`模式下，分析器将启动HTTP服务器来显示软件包报告。
            //  在“静态”模式下，会生成带有报告的单个HTML文件。
            //  在`disabled`模式下，你可以使用这个插件来将`generateStatsFile`设置为`true`来生成Webpack Stats JSON文件。
            analyzerMode: 'static',
            //  将在“服务器”模式下使用的主机启动HTTP服务器。
            analyzerHost: '127.0.0.1',
            //  将在“服务器”模式下使用的端口启动HTTP服务器。
            analyzerPort: 8888,
            //  路径捆绑，将在`static`模式下生成的报告文件。
            //  相对于捆绑输出目录。
            reportFilename: 'report.html',
            //  模块大小默认显示在报告中。
            //  应该是`stat`，`parsed`或者`gzip`中的一个。
            //  有关更多信息，请参见“定义”一节。
            defaultSizes: 'parsed',
            //  在默认浏览器中自动打开报告
            openAnalyzer: true,
            //  如果为true，则Webpack Stats JSON文件将在bundle输出目录中生成
            generateStatsFile: false,
            //  如果`generateStatsFile`为`true`，将会生成Webpack Stats JSON文件的名字。
            //  相对于捆绑输出目录。
            statsFilename: 'stats.json',
            //  stats.toJson（）方法的选项。
            //  例如，您可以使用`source：false`选项排除统计文件中模块的来源。
            //  在这里查看更多选项：https：  //github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
            statsOptions: null,
            logLevel: 'info' // 日志级别。可以是'信息'，'警告'，'错误'或'沉默'。
        })
    ],
}