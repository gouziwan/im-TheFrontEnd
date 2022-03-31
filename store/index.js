import Vuex from 'vuex';
import Vue from "vue"
import AES from '@/js_sdk/ar-aes/ar-aes.js'
import { AESkey,v1 } from "../plugin/instruction.js"
import {http,img} from "../Api/index.js"

Vue.use(Vuex);

let userInfo  = uni.getStorageSync('user_info');
// 解密
userInfo = AES.AES.decrypt(userInfo,AESkey,v1);

userInfo = Boolean(userInfo) ? JSON.parse(userInfo)['user_info'] : {}

const store = new Vuex.Store({
	mutations: {},
	actions: {},
	// 信息存储
	state:{
		userInfo:userInfo,
		http,
		img,
		token:null,
		// 兼容
		innerHeight:window ? window.innerHeight : 0,
		// 用户聊天信息
		userChar:[],
		userFriend:[],
		isLink:false,
		list:{},
		unreadMsg:{}
	},
	getters:{
		getAvataImg(state){
			if(state.userInfo.imgurl){
				return state.img + state.userInfo.imgurl
			}
			return null
		},
		// 兼容
		getViewPortSize(state){
			let data = {
				height:state.innerHeight + 'px'
			}
			return data
		}
	}
})

export default store;