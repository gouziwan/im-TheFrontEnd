<template>
	<view class="chat-view"
		<!-- #ifdef H5 -->
			:style="getHeight"
		<!-- #endif -->
		:animation="animation"
		id="chatView"
		<!-- #ifdef MP -->
			:style="{
				height:getCharHeight+'px'
			}"
		<!-- #endif -->
	>
		 <u-navbar
		    :title="friendName"
		    style="width: 100%;"
			fixed
			placeholder
			@leftClick="toBack"
		>
		<template slot="left">
			<text class="iconfont icon-fanhui"></text>
		</template>
		
		<template slot="right">
			<text class="iconfont icon-shenglvehao"></text>
		</template>
		</u-navbar>
			<char-view :value="cruuendShowFriendChar" :currentId="currentId"
				<!-- #ifdef MP -->
					:style="{
						height:getContextHeight+'px'
					}"
					:animation="contextAnimation"
				<!-- #endif -->
				:friendAvatar="friendAvatar"
				@scrolltoupper="onScrolltoupper"
				:isLoading="isScrollTop"
				:isNomore="cruuendShowNumber >= getFriendChar.length"
			></char-view>
			<view class="chat-view-button"
				<!-- #ifdef MP -->
				:style="{
					paddingBottom:getBorderSecurity+'px'
				}"
				<!-- #endif -->
			>
				<text class="iconfont icon-yuyin"></text>
				<textarea
					:maxlength="-1"
					confirm-type="send"
					class="chat-textarea"
					@focus="onFocus"
					@linechange="onLinechange"
					@confirm="onConfirm"
					@blur="onBlur"
					:confirm-hold="true"
					<!-- #ifdef MP -->
					@keyboardheightchange="onkeyboardheightchange"
					<!-- #endif -->
					v-model="textValue"
					:show-confirm-bar="false"
					:adjust-position="false"
					:style="{
						height:inputHeight+'px'
					}"
				></textarea>
				<text class="iconfont icon-biaoqing-xue" @click="onClickShowExpression"></text>
				<text class="iconfont icon-tianjia" @click="onClickShowFunctionalAreas"></text>	
			</view>
			<FunctionalAreas :show="show" :height="getFunctionalAreas" :duration="duration" @onChange="onChangeImg" @onChangeLocation="onChangeLocation"></FunctionalAreas>
			<Expression 
				@onChange="onChangeValue" 
				:show="expressionShow" 
				:height="getFunctionalAreas" 
				:duration="duration" 
				:sendDisabled="isSendValue" 
				:clearDisabled="isValueLength"
				@onClear="onClearValue"
				@onSend="onConfirm"
			></Expression>
	</view>
</template>

<script>
	
	// #ifdef H5
	import h5 from "./h5/h5.js"
	// #endif
	
	
	// #ifdef MP
	import wx from "./wx/wx.js"
	// #endif
	
	import Socket from "../../Socket/Socket.js"
	
	import CharView from "../../components/CharView.vue"
	import FunctionalAreas from "../../components/FunctionalAreas.vue"
	import Expression from "../../components/expression.vue"
	import { duration } from "../../config.js"
	import { socket } from "../../Socket/Socket.js"
	import uploadMinxin from "../../plugin/upload.js"
	import { img,setMsgRead } from "../../Api/index.js"
	
	export default{
		data(){
			return {
				show:false,
				animation:'',
				duration:duration,
				inputHeight:25,
				currentId:'',
				textValue:'',
				expressionShow:false,
				list:[],
				friendId:'',
				friendName:'',
				friendAvatar:'',
				cruuendShowNumber:10,
				// 这个是滚动到顶部触发的加载事件
				isScrollTop:false,
				setid:''
			}
		},
		computed:{
			isValueLength(){
				return this.textValue.length === 0
			},
			isSendValue(){
				let val = this.textValue.trim()
				return val.length === 0
			},
			// 排序后的数组
			getFriendChar(){
				const { userChar } = this;
				
				let val = userChar[this.friendId] instanceof Array ? [...userChar[this.friendId]] : [];
				
				// 排序的时候顺便进行消息static 变成已读
				val.sort((a,b)=>{
					return b.send_tiem - a.send_tiem
				});

				return val
			},
			// 当前显示的数组不要一下子显示完
			cruuendShowFriendChar(){
				let arr = [...this.getFriendChar].splice(0,this.cruuendShowNumber)
				return arr.reverse()
			}
		},
		onLoad(options){
			const { id,name,imgurl } = options
			if(id == undefined || name==undefined || imgurl == undefined) return
			this.friendId = id
			this.friendName = name
			this.friendAvatar = imgurl
		},
		mounted(){
			this.recordFriend()
		},
		methods:{
			toBack(){
				uni.navigateBack({
					delta:1
				})
			},
			createdAanimtion(fun,val,key){
				const { duration } = this
				let animation = uni.createAnimation({ duration })
				animation[fun](val).step();
				this[key] = animation.export()
			},
			scrollToPlace(item = 0){
				this.currentId = '';
				 setTimeout(()=>{
					this.currentId = `index-${this.cruuendShowFriendChar.length - 1}`
				},item)
			},
			onConfirm(e){
				const { value } = e.detail
				const { userChar } = this;
				const { userInfo,friendId,textValue } = this
				// 判断Value 是否是空
				let val = textValue.trim();
				
				if(val.length > 0){
					const val = {
						msg:textValue,
						types:1,
						userId:userInfo.userid,
						friendId,
						send_tiem:Date.now(),
						static:1
					}
					this.onSendMssage({
						data:val,
						callback:() => this.addUserChar(friendId,val),
						success:(data)=>{
							
						}
					})
					
					this.textValue = '',
					this.scrollToPlace()
				}
			 },
			 onSendMssage(val){
				 const {sendMssageService} = Socket.methods;
				 sendMssageService(val)
			 },
			 onChangeImg({data}){		
				const { friendId ,userInfo} = this
				const _this = this
				this.uploadMsgImgArr({
					Arr:data,
					formData:{
						friendId,
						userId:userInfo.userid
					},
					success:res=>{
						res = JSON.parse(res.data);
						if(res.code == 200){
							this.onSendMssage({data:res.data})
						}
					},
					fail(res,el){
						_this.PubSub.emit(el.onid,res)
					},
					callback:(fun,el,types)=>{						
						let msgDate = {
							userId:userInfo.userid,
							friendId,
							types,
							msg:el.path,
							send_tiem:Date.now(),
							static:0,
							el:el,
							onProgressUpdate:fun
						}
						this.addUserChar(friendId,msgDate)
					}
				})			
			 },
			 onLinechange(e){
			 	const {	height , lineCount} = e.detail;
			 	
			 	if(lineCount > 5) return
			 	 
			 	 this.inputHeight = height
			 },
			 onChangeValue(e){
				 const {id,value} = e;	
				 if(id==='1'){
					this.textValue += value
				 }else if(id === '2'){
					const { userInfo,friendId } = this
					let data = {
						name:value.name,
						type:"image/png",
						path:img + value.name,
					}
					
					this.uploadMsgImgArr({
						Arr:[data],
						formData:{
							friendId,
							userId:userInfo.userid
						},
						success:res=>{
							res = JSON.parse(res.data);
							if(res.code == 200){
								this.onSendMssage({data:res.data})
							}
						},
						fail:res=>{
							_this.PubSub.emit(el.onid,res)
						},
						callback:(fun,el,types)=>{
							let msgDate = {
								userId:userInfo.userid,
								friendId,
								types,
								msg:el.path,
								send_tiem:Date.now(),
								static:0,
								el:el,
								onProgressUpdate:fun
							}
							this.userChar[friendId].push(msgDate)
						}
					})
				 }
			 },
			 onClearValue(val){
				 const {textValue} = this
				 let last = textValue[textValue.length - 1];
				 let code = last.charCodeAt(0);
				 let len = val[code];
				 
				 if(len !== undefined){
					let num = textValue.length - len < 0 ? 0 : textValue.length - len
					this.textValue = textValue.slice(0,num);
				 }else{
					 this.textValue =  textValue.slice(0,textValue.length - 1);
				 }
			 },
			 // 记录打开的用户下次的时候就不会更新了
			 recordFriend(friendId = this.friendId){
				const { userid } = this.userInfo
				let result =  uni.getStorageSync('user_dialogue');
				
				result = result == '' || result == undefined ? {} : JSON.parse(this.decrypt(result))
								
				if(result[userid] == undefined)  result[userid] = {} 
				
				let val = result[userid];
				
				if(val[friendId] == undefined){
					val[friendId] = true;
					this.$store.state.list = result;
					result = this.encrypt(JSON.stringify(result));
					uni.setStorageSync('user_dialogue',result);
				}
			 },
			 onScrolltoupper(e){
				if(this.isScrollTop == true) return
				
				this.isScrollTop = true
				
				if(this.cruuendShowNumber >= this.getFriendChar.length){
					setTimeout(()=>{
						this.isScrollTop = false
					},1000)
					return
				}
				
				setTimeout(()=>{
					let load = this.cruuendShowNumber;
					this.cruuendShowNumber += 10
					this.currentId = '';
						// 获取最新节点的信息/
						setTimeout(()=>{
							this.currentId = `index-${this.cruuendShowNumber - load}`
						setTimeout(()=>{
							this.isScrollTop = false
						},0)
					},0)
				},1000)
			 },
			 // 获取地址
			 onChangeLocation(value){
				 const { friendId,userInfo} = this
				 const val = {
				 	msg:JSON.stringify(value),
				 	types:4,
				 	userId:userInfo.userid,
				 	friendId,
				 	send_tiem:Date.now(),
				 	static:1
				 }
				this.onSendMssage({
					data:val,
					callback:()=>{
						this.addUserChar(friendId,val)
					}
				})
			 },
			addUserChar(key,val){
				if(!(this.userChar[key] instanceof Array)) {
					this.$set(this.userChar,key,[])
				}
				this.userChar[key].push(val) 
			},
			setMsgRead(newName,loadName){
				let arr = []
				if(newName instanceof Array && newName.length > 0 && loadName instanceof Array){	
					let nums =newName.length -  loadName.length 
					for(let i = 0; i < nums;i++){
						let el = newName[i];
						if(el.userId !== this.userInfo.userid && el.static == 1){
							arr.push(el.id);
						}
					}
					
					if(arr.length > 0 ){
						setMsgRead(arr,res=>{
							if(res.data.code == 200 ){
								this.getFriendChar.forEach(el=>{
									if(arr.indexOf(el.id) !== -1){
										el.static = '0'
									}
								})
							}
						})
					}
				}
			}	
		},
		watch:{
			getFriendChar:{
				handler(newName,loadName) {
					this.setMsgRead(newName,loadName)
					clearTimeout(this.setid)
					this.setid = setTimeout(()=>{
						this.scrollToPlace();
					},0)
					
				},
			}
		},
		components:{
			'char-view':CharView,
			FunctionalAreas,
			Expression
		},
		// #ifdef H5
			mixins:[h5,uploadMinxin]
		// #endif
		// #ifdef MP
			mixins:[wx,uploadMinxin]
		// #endif
	}
</script>

<style lang="scss">
	.chat-view{
		height: 100vh;
		overflow: hidden;
		background-color:$uni-ba-color-ligre ;
		.iconfont{
			font-size: $uni-font-icon-sm;
		}
		display: flex;
		flex-direction:column;
		.chat-view-button{
			transition:  all 0.2s;
			padding: 5px 0;
			display: flex;
			width: 100%;
			align-items: flex-end;
			border-top: solid 1px $uni-border-color;
			background-color: $uni-ba-color-ligre;
			.chat-textarea{
				border: solid 1px $uni-border-color;
				border-radius: $uni-border-radius-sm;
				line-height: 25px;
				height: 25px;
				font-size: 16px;
				padding: 3px 5px;
				background-color: $uni-bg-color;
			}
			.iconfont{
				font-size: $uni-font-icon-el;
				padding: 0 10px;
			}
		}
	}
	
</style>