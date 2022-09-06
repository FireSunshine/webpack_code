const os = require('os')
const path = require('path'); // nodejs 核心模块， 专门用来处理路径问题
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require('terser-webpack-plugin')
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

const threads = os.cpus().length; // cpu核数

// 获取处理样式的Loaders
function getStyleLoader(pre) {
  return [
    // 执行顺序，从右到左（从上往下）
    // 'style-loader', // 将js中css通过创建style标签添加 html文件中生效
    MiniCssExtractPlugin.loader, // 提取css文件成单独文件
    'css-loader', // 将css资源编译成commonjs的模块到js中
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            "postcss-preset-env", // 能解决大多数样式兼容性问题
          ],
        },
      },
    },
    pre
  ].filter(Boolean)
}

module.exports = {
  // 入口
  entry: './src/main.js', // 相对路径
  // 输出
  output: {
    // 文件输出路径
    // __dirname, nodejs的变量， 代表当前文件夹目录
    // 生产模式需要输出文件
    path: path.resolve(__dirname, '../dist'), // 绝对路径
    // 文件名
    filename: 'static/js/main.js', // 将js文件输出到 static/js 目录中
    chunkFilename: 'static/js/[name].thunk.js', // d动态导入输出资源命名方式
    // 自动将上次打包目录资源清空
    // 原理： 在打包前，将path整个目录清空， 在进行打包
    clean: true,
  },
  // 加载器
  module: {
    rules: [
      {
        oneOf: [
          // loader的配置
          {
            test: /\.css$/, // 检测文件
            use: getStyleLoader()
          },
          {
            test: /\.less$/i,
            // loader: 'xxxx', // 只能使用一个loader
            use: getStyleLoader("less-loader"), // 将less编译成css文件
          },
          {
            test: /\.s[ac]ss$/i,
            use: getStyleLoader("sass-loader"),
          },
          {
            test: /\.styl$/,
            use: getStyleLoader("stylus-loader"),
          },
          {
            test: /\.(png|jpe?g|gif|webp|svg)$/,
            type: 'asset',
            parser: {
              dataUrlCondition: {
                // 小于30kb的图片转base64
                // 优点：减少请求数量  缺点：体积会更大
                maxSize: 30 * 1024 // 30kb
              }
            },
            generator: {
              // 将图片文件输出到 static/images 目录中
              // 将图片文件命名 [hash:8][ext][query]
              // [hash:8]: hash值取8位
              // [ext]: 使用之前的文件扩展名
              // [query]: 添加之前的query参数
              filename: 'static/images/[hash:8][ext][query]'
            }
          },
          {
            test: /\.(ttf|woff2?|mp3|mp4|avi)$/,
            type: 'asset/resource',
            generator: {
              // 将图片文件输出到 static/images 目录中
              // 将图片文件命名 [hash:8][ext][query]
              // [hash:8]: hash值取8位
              // [ext]: 使用之前的文件扩展名
              // [query]: 添加之前的query参数
              filename: 'static/media/[hash:8][ext][query]'
            }
          },
          {
            test: /\.js$/,
            // exclude: /(node_modules|bower_components)/, // 排除node_modules代码不编译
            include: path.resolve(__dirname, '../src'),
            use: [
              {
                loader: 'thread-loader', // 开启多进程
                options: {
                  workers: threads // 数量
                }
              },
              {
                loader: 'babel-loader',
                options: {
                  // 智能预设
                  // presets: ['@babel/preset-env']
                  cacheDirectory: true, // 开启babel编译缓存
                  cacheCompression: false, // 缓存文件不要压缩
                  plugins: ["@babel/plugin-transform-runtime"], // 减少代码体积
                }
              }
            ]
          }
        ]
      }
    ],
  },
  // 插件
  plugins: [
    new ESLintPlugin({
      // 检测哪些文件
      context: path.resolve(__dirname, '../src'),
      exclude: "node_modules", // 默认值
      cache: true, // 开启缓存
      cacheLocation: path.resolve(__dirname, '../node_modules/.cache/.eslintcache'),
      threads, // 开启多进程
    }),
    new HtmlWebpackPlugin({
      // 以 public/index.html 为模板创建文件
      // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
      template: path.resolve(__dirname, '../public/index.html')
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/main.css'
    }),
    // new CssMinimizerPlugin(),
    // new TerserWebpackPlugin({
    //   parallel: threads // 开启多进程
    // }),
  ],
  optimization: {
    minimize: true,
    // 压缩的操作
    minimizer: [
      // 压缩css
      new CssMinimizerPlugin(),
      // 压缩js
      new TerserWebpackPlugin({
        parallel: threads // 开启多进程
      }),
      // 压缩图片
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              [
                "svgo",
                {
                  plugins: [
                    "preset-default",
                    "prefixIds",
                    {
                      name: "sortAttrs",
                      params: {
                        xmlnsOrder: "alphabetical",
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
    // 代码分割配置
    splitChunks: {
      chunks: "all", // 对所有模块都进行分割
      // 以下是默认值
      // minSize: 20000, // 分割代码最小的大小
      // minRemainingSize: 0, // 类似于minSize，最后确保提取的文件大小不能为0
      // minChunks: 1, // 至少被引用的次数，满足条件才会代码分割
      // maxAsyncRequests: 30, // 按需加载时并行加载的文件的最大数量
      // maxInitialRequests: 30, // 入口js文件最大并行请求数量
      // enforceSizeThreshold: 50000, // 超过50kb一定会单独打包（此时会忽略minRemainingSize、maxAsyncRequests、maxInitialRequests）
      // cacheGroups: { // 组，哪些模块要打包到一个组
      //   defaultVendors: { // 组名
      //     test: /[\\/]node_modules[\\/]/, // 需要打包到一起的模块
      //     priority: -10, // 权重（越大越高）
      //     reuseExistingChunk: true, // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
      //   },
      //   default: { // 其他没有写的配置会使用上面的默认值
      //     minChunks: 2, // 这里的minChunks权重更大
      //     priority: -20,
      //     reuseExistingChunk: true,
      //   },
    },
  },
  // 开发服务器: 不会输出资源，在内存中编译打包
  // devServer: {
  //   host: "localhost", // 启动服务器域名
  //   port: "3000", // 启动服务器端口号
  //   open: true, // 是否自动打开浏览器
  // },
  // 模式
  mode: 'production',
  devtool: 'source-map'
}