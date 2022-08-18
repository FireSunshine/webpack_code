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
    filename: 'main.js'
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
    ],
  },
  // 插件
  plugins: [

  ],
  // 模式
  mode: 'development',
}