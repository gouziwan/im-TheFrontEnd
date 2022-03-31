import App from './App'
import Vue from 'vue'
import "./static/icon/iconfont.css"
import store from "./store/index.js"
import instruction from "./plugin/instruction.js"

// 混入
import { avatarImg } from "./minxis/index.js"


import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

Vue.use(instruction)

Vue.mixin(avatarImg)
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount();




