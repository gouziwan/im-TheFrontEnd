import { ip } from "../Api/index.js"

import io from "../components/socket.js"

export let socket = io(`http://${ip}:5000`);

export default {
	data(){
		return {
			// 是否链接
			isLink:false
		}
	},
	methods:{
		initServiceLink(){
			this.establishServiceLink()
			this.connectionError()
		},
		
		// 创建与服务器链接
		establishServiceLink(){
			const { userInfo } = this
			const token = uni.getStorageSync('user_token');
		
			if(token == null || token == undefined || token == '') return socket.close()
			// 已经链接
			// 这说明已经断开连接了
			if(socket.disconnected){
				socket.connect(`http://${ip}:5000`)
			}
			
			socket.on("connect", () => {		
			  // 这里是发送token
			  socket.emit('validation',token,socket.id);
			  this.$store.state.isLink = socket.connected
			  this.getServiceMssage()
			});
		},
		// 接收服务端的信息
		getServiceMssage(){
			socket.on('getMsg',(val)=>{
				const {userChar} = this;
				const { userid }  = this.userInfo
				
				userChar[val.userId].push(val);
				
				let result = this.getRecordFriend();
				
				result[userid] = result[userid] == undefined ? {} : result[userid];
				
				if(result[userid][val.userId] == undefined){
					result[userid][val.userId] = true;
					this.setRecordFriend(result)
				}
				this.$store.state.list = result
			})
		},
		// 给服务器端发送信息
		sendMssageService({data,callback,success,fail}){
			socket.emit('sendMsg',data)
			callback && callback()
		},
		// 连接出错的时候
		connectionError(){
			socket.on("disconnect",(reason)=>{
				
			})
		},
		getRecordFriend(){
			let result =  uni.getStorageSync('user_dialogue');
			return result == '' || result == undefined ? {} : JSON.parse(this.decrypt(result))		
		},
		setRecordFriend(value){
			value = this.encrypt(JSON.stringify(value));
			uni.setStorageSync('user_dialogue',value);
		}
	}
}