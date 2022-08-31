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


// 判断是否支持HMR功能
if (module.hot) {
  module.hot.accept("./js/count", function (count) {
    const result1 = count(2, 1);
    console.log(result1);
  });
  module.hot.accept('./js/sum')
}