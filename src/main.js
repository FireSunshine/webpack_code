// 完整引入
import "core-js";
// 按需引入
import "core-js/es/promise";
import count from './js/count'
import sum from './js/sum'
import { chu } from './js/math'
// 想要打包webpack资源， 必须引入资源
import './css/iconfont.css'
import './css/index.css'
import './less/index.less'
import './sass/index.sass'
import './sass/index.scss'
import './stylus/index.styl'

let res = 12345;
console.log(res);
console.log(count(2, 1));
console.log(sum(1, 2, 3, 4, 5, 6));
console.log(chu(5, 5));

document.getElementById('btn').onclick = function () {
  // eslint会对动态导入语法报错，需要修改eslint配置文件
  // webpackChunkName: "math"：这是webpack动态导入模块命名的方式
  // "math"将来就会作为[name]的值显示。
  import(/* webpackChunkName: 'math' */'./js/split').then(({ codeSplit }) => {
    console.log(codeSplit("1234567-023$%^&89"));
  })
}


// 判断是否支持HMR功能
if (module.hot) {
  module.hot.accept("./js/count", function (count) {
    const result1 = count(2, 1);
    console.log(result1);
  });
  module.hot.accept('./js/sum')
}

const promise = new Promise((resolve) => {
  resolve('success')
})
promise.then((res) => {
  console.log(res);
})

const arr = [1,2,3,4]
console.log(arr.includes(1));