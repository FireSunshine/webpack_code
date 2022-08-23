import count from './js/count'
import sum from './js/sum'
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