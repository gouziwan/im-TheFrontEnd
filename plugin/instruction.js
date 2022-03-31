import AES from '@/js_sdk/ar-aes/ar-aes.js'

export const AESkey = '1a2b3c4f5g6j7k8l'

export const v1 = '1A2b3c4f5g6j7k8s'

import DateTiem from "../plugin/date.js"

export default {
	install(Vue){
		Vue.prototype.$skmaId = '';
		// 节流
		Vue.prototype.$shake = function(f,item){
			clearTimeout(this.$skmaId)
			this.$skmaId = setTimeout(()=>{
				f && f()
			},item)
		}
		
		// 计时器  fun 执行的函数 start 开始事件 end 结束 item 多少秒执行
		// 一个对象只能执行一个
		Vue.prototype.$clock = function(fun,start,end,item){
			new Clock().clock(fun,start,end,item)
		}
		
		
		Vue.prototype.$setStorage = function(value) {
			let { key,data,success,fail,complete,kes} = value;
			
			// 如果有则会添加进去里面无则创建一个新的
			try{
				let result = uni.getStorageSync(key);
					
				result == '' || result == null || result == false ? result = {} : result = JSON.parse(result);
				
				kes = kes == undefined ? key : kes;
				
				result[kes] = data
				
				result = JSON.stringify(result);
				
				// 加密
				result = AES.AES.encrypt(result,AESkey,v1)
				
				let res = uni.setStorageSync(key,result);
				
				success && success(res)
			}catch(e){
				fail && fail(e)
			}
			
			complete && complete()
		}
		
		
		// key success只要不为空 或者不为null 的时候执行 ,fail值为空或者为null的时候执行
		Vue.prototype.$getStorage = function({key,success,fail}) {
			try{
				let result = uni.getStorageSync(key);
				if(result == '' || result == null || result == undefined){
					fail && fail()
					return
				}
				// 解密
				result = AES.AES.decrypt(result,AESkey,v1)
				
				if(result == ''){
					return fail && fail(e)
				}
				
				result = JSON.parse(result);
				success && success(result)
			}catch(e){
				fail && fail(e)
			}
		}
		
		
		Vue.prototype.encrypt = function(val){
			return AES.AES.encrypt(val,AESkey,v1)
		}
		
		Vue.prototype.decrypt = function(val){
			return AES.AES.decrypt(val,AESkey,v1)
		}
		
		Vue.prototype.DateTiem = DateTiem
		
		
		Vue.prototype.PubSub = PubSub
	}
}

class Clock{
	constructor() {
	  this.id = '' 
	  this.start = ''
	}
	
	// fun 每秒执行的函数  succ  到点执行的函数
	clock({fun,start,end,item,succ}){
		clearInterval(this.id);
		this.start = start;
		this.id = setInterval(()=>{
			if(this.start <= end ) {
				clearInterval(this.id)
				succ && succ()
			}
			fun && fun(this.start,this.id);
			this.start--;
		},item)
	}	
}


class PubSub {
	static map = new Map();
	
	
	static on(key,fun){
		this.map.set(key,fun);
	}
	
	
	static emit(key,...args){
		let fun = this.map.get(key);
		fun && fun(...args)
	}
	
	static off(key){
		this.map.delete(key)
	}
} 




