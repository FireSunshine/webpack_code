const path = require('path'); // nodejs 核心模块， 专门用来处理路径问题

module.exports = {
  // 入口
  entry: './src/main.js', // 相对路径
  // 输出
  output: {
    // 文件输出路径
    // __dirname, nodejs的变量， 代表当前文件夹目录
    path: path.resolve(__dirname, 'dist'), // 绝对路径
    // 文件名
    filename: 'static/js/main.js', // 将js文件输出到 static/js 目录中
    // 自动将上次打包目录资源清空
    // 原理： 在打包前，将path整个目录清空， 在进行打包
    clean: true, 
  },
  // 加载器
  module: {
    rules: [
      // loader的配置
      {
        test: /\.css$/, // 检测文件
        use: [// 执行顺序，从右到左（从上往下）
          'style-loader', // 将js中css通过创建style标签添加 html文件中生效
          'css-loader' // 将css资源编译成commonjs的模块到js中
        ]
      },
      {
        test: /\.less$/i,
        // loader: 'xxxx', // 只能使用一个loader
        use: [
          "style-loader",
          "css-loader",
          "less-loader", // 将less编译成css文件
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader", // 将sass编译成css文件
        ],
      },
      {
        test: /\.styl$/,
        use: [
          "style-loader",
          "css-loader",
          "stylus-loader" // 将styl编译成css文件
        ],
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
      }
    ],
  },
  // 插件
  plugins: [

  ],
  // 模式
  mode: 'development',
}