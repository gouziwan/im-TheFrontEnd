<template>
	<view class="expression" v-if="isShow" :style="{
		bottom:bottom+'px'
	}" :animation="animation">
		<view class="expression-tar">
			<view class="expression-tar-poasition" @click="onClickSwitchPage">
				<view class="expression-icon iconfont" v-for="(item,index) in classNameArr" :class="item" :key="index" :data-index="index" ></view>
			</view>
			<view class="expression-tar-back" :style="{
				left:backOffset+'px'
			}"></view>
		</view>
		<view class="expression-swiper-content">
			<swiper class="expression-swiper" :current="current" :style="{
				height:getSwitchHeight+'px'
			}" @change="onChangeCurrent">
				<swiper-item class="expression-swiper-item-text" @click="onClickEmoji">
					<view class="expression-swiper-list-empji">
						<text class="expression-swiper-item-empji" data-id="1" :data-value="item" v-for="(item,index) in emojiArr" :key="index" >
							{{item}}
						</text>
					</view>
				</swiper-item>
				
				<swiper-item class="expression-swiper-item-images" @click="onClickEmoji">
					<view class="expression-swiper-item-img" @click="onClickShowPopup">
						<view class="expression-img-addImg">
							<text class="iconfont icon-add"></text>
						</view>
					</view>
					<view class="expression-swiper-item-img" :data-value="item" data-id="2" v-for="(item,index) in imgArr" :key="index">
						<image class="expression-img-swiper" :data-value="item" data-id="2"  mode="aspectFit" :src="img + item.name"></image>
					</view>
				</swiper-item>
			</swiper>
			
			<view class="expression-swiper-empji-button-content" v-if="current == 0">
				<button class="expression-button" type="default" @click="onClear" :disabled="clearDisabled">x</button>
				<button class="expression-button send" type="default" @click="onSend" :disabled="sendDisabled">发送</button>
			</view>
		</view>
		
		<u-popup :show="showPopup">
		    <view class="popup-content" :style="{
				height:innerHeight+'px'
			}">
				 <u-navbar title="添加单个表情" @leftClick="onClickClosePopup" @rightClick="onClickManagementExpression">
					 <template slot="left">
						 <view>关闭</view>
					 </template>
					 <template slot="right">
						 <view>{{isShowDelete ? "取消" : "管理"}}</view>
					 </template>
				 </u-navbar>
				 
				 <view class="content-expression">
					 <view class="content-expression-item addImg" @click="onClickAddImg" v-if="!isShowDelete">
						 <view class="expression-img-addImg">
						 	<text class="iconfont icon-add"></text>
						 </view>
					 </view>
					 <view class="content-expression-item" v-for="item in imgArr">
						<image class="expression-img-swiper" :data-value="item" data-id="2"  mode="aspectFit" :src="img + item.name"></image>
							<view class="expression-u-checkbox" @click="onClickCheckBoxState(item)" v-show="isShowDelete">
								<view class="expression-u-checkbox-offset">
									<AppChckeBox selectBack="#FBE836" :checkbox="isCkeckBoxSelect(item)" :data="item" :size="20"></AppChckeBox>	
								</view>
							</view>	
					 </view>
				 </view>
				 
				 <view class="popup-content-delete" v-if="isShowDelete">
					 <view @click="onClickDeleteExpression">删除</view>
					 <view style="margin-right: auto;margin-left: 20px;" @click="checkboxArr = []">清空</view>
				 </view>
				 <!-- 表情包加载 -->
				 <u-toast ref="uToast"></u-toast>
		    </view>
		</u-popup>
	</view>
</template>

<script>
	import emoji from "../js_sdk/m-emoji/m-emoji_2.0.0/emoji.js"
	import { img,uploadExpression,getExpression,deleteExpression } from "../Api/index.js"
	import AppChckeBox from "./chckebox.vue"
	import {duration} from "../config.js"
	export default {
		components:{
			AppChckeBox
		},
		props:{
			show:{
				type:Boolean,
				default:false
			},
			height:{
				type:Number,
				default:0
			},
			baColor:{
				type:String,
				default:'#fff'
			},
			duration:{
				type:Number,
				default:duration
			},
			clearDisabled:{
				type:Boolean,
				default:false
			},
			sendDisabled:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return {
				emojiArr:[],
				classNameArr:['icon-biaoqing','icon-aixin'],
				current:0,
				img:img,
				imgArr:[],
				backOffset:0,
				bottom:-this.height,
				hreadBar:0,
				animation:'',
				isShow:false,
				emojiArrKey:{},
				showPopup:false,
				isShowDelete:false,
				checkboxArr:[]
			}
		},
		created(){
			this.emojiArr = emoji.slice(0,69);
			this.emojiArr.forEach(el=>{
				let code = el.charCodeAt(el.length - 1);
				this.emojiArrKey[code] = el.length
			})	
		},
		mounted(){
			const { userid } = this.userInfo
			
			getExpression(
				userid,
				res=>{
					const {code,data} = res.data
					if(code == 200){
						this.imgArr = data
					}
				}
			)
		},
		methods:{
			onClickEmoji(e){
				const { id,value } = e.target.dataset;
				if(id == undefined || value == undefined) return
				console.log(value)
				this.$emit('onChange',{id,value})
			},
			onClickAddImg(){
				uni.chooseImage({
					sourceType:['album'],
					count:1,
					success:res=>{
						const {tempFiles} = res;
						const path = tempFiles[0].path
						this.uploadExpressionLoading()
						uploadExpression({
							filePath:path,
							userid:this.userInfo.userid,
							success:res=>{
								const { uToast } = this.$refs;
								 res = JSON.parse(res.data);
								 const {code,data} = res;
								 if(data instanceof Object && code == 200){
									 
									 this.imgArr.push(data)
								 }
								 uToast.hide()
							}
						})
					}
				})
			},
			// 上传表情包加载图标
			uploadExpressionLoading(){
				const { uToast } = this.$refs;
				uToast.show(
					{
						type: 'loading',
						title: '正在加载',
						message: "正在加载",
						duration:9999999999999999
					},
				)
			},
			// 获取点击节点的信息
			getNodeInfo(select,fun = 'selectAll'){
				return new Promise((resolve)=>{
					const query = uni.createSelectorQuery().in(this);
					query[fun](select).boundingClientRect(res=>{
						resolve(res)
					}).exec()
				})
			},
			
			// 获取 图标下的背景图片的偏移量
			async getBackOffset(index = 0){
				let result = await this.getNodeInfo('.expression-icon');
				let result1 = await this.getNodeInfo('.expression-tar-back','select');
				if(result==null || result1==null) return
				this.backOffset = ((result[index].width - result1.width) / 2) + result[index].left;
			},
			// 点击切换 switch
			onClickSwitchPage(e){
				const { index } = e.target.dataset;
				this.getBackOffset(index)
				this.current = index;
			},
			createdAanimtion(fun,val,key){
				const { duration} = this
				let animation = uni.createAnimation({ duration })
				animation[fun](val).step();
				this[key] = animation.export()
			},
			onSend(e){
				this.$emit('onSend',e);
			},
			onClear(){
				this.$emit('onClear',this.emojiArrKey)
			},
			onChangeCurrent(e){
				const { current } = e.detail;
				this.current = current
				this.getBackOffset(current)
			},
			onClickShowPopup(){
				this.showPopup = true
			},
			onClickClosePopup(){
				this.showPopup = false
				this.isShowDelete = false
			},
			onClickManagementExpression(){
				this.isShowDelete = !this.isShowDelete
				
			},
			onClickCheckBoxState(data){
				let boolean = this.checkboxArr.indexOf(data.id);
				
				if(boolean === -1){
					this.checkboxArr.push(data.id)
				}else{
					 this.checkboxArr.splice(boolean,1)
				}
			},
			isCkeckBoxSelect(data){
				return this.checkboxArr.indexOf(data.id) !== -1	
			},
			onClickDeleteExpression(){
				deleteExpression(this.checkboxArr,res=>{
					if(res.data.code == 200){
						this.checkboxArr.forEach(el=>{
							this.imgArr = this.imgArr.filter(e=>e.id!==el);
						})
					}
				})
			}
		},
		computed:{
			getSwitchHeight(){
				return this.height - this.hreadBar
			}
		},
		watch:{
			show:{
				immediate:true,
				handler(newValue){
					let val = newValue ? 0 : -this.height
					if(newValue){
						this.isShow = newValue
						setTimeout(async ()=>{
							this.getBackOffset(this.current)
							let result = await this.getNodeInfo('.expression-tar','select');
							if(result !==null) this.hreadBar = result.height
						},0)
					}else{
						setTimeout(()=>{
							this.isShow = newValue
						},this.duration)
					}
					setTimeout(()=>{
						this.createdAanimtion('bottom', val,'animation')
					},0)
				}
			}
		}
	}
</script>

<style lang="scss">
	.expression{
		position: absolute;
		bottom: 0;
		width: 100%;
		background-color: $uni-bg-color;
		.expression-tar{
			white-space: nowrap;
			overflow-x: auto;
			border-top: solid 1px $uni-border-color;
			border-bottom: solid 1px $uni-border-color;
			position: relative;
			background-color:  transparent;
			padding: 5px 0;
			.iconfont{
				display: inline-block;
				font-size: $uni-font-icon-base;
				padding: 5px 20px;
			}
			.expression-tar-poasition{
				position: relative;
				z-index: 1;
			}
			.expression-tar-back{
				width: calc(#{$uni-font-icon-el} + 5px);
				height:calc(#{$uni-font-icon-el} + 5px);
				background-color: $uni-ba-color-ligre;
				position: absolute;
				top:50%;
				transform: translateY(-50%);
				left: 3;
				z-index: 0;
				border-radius: 5px;
			}
		}
		.expression-tar::-webkit-scrollbar{
			display:none
		}
		.expression-swiper-content{
			position: relative;
			.expression-swiper-empji-button-content{
				position: absolute;
				width:  calc(((100% - 15rpx * 2 * 5) / 5) * 2);
				border:solid 1px $uni-ba-color-ligre;
				height: calc(((100vw - 15rpx * 2 * 5) / 5));
				background-color: red;
				right:0;
				bottom: 0;
				display: flex;
				align-items: center;
				background-color:$uni-ba-color-ligre;
				box-shadow:  20px 20px 50px #f5f5f5 inset;
				.expression-button{
					display: inline-block;
					height: calc(((100vw - 15rpx * 2 * 5) / 5) / 2);
					line-height: calc(((100vw - 15rpx * 2 * 5) / 5) / 2);
					font-size: $uni-font-size-base;	
				}
				.expression-button.send{
					background-color: $uni-color-primary;
				}
			}
		}
		.expression-swiper{
			background-color:$uni-ba-color-ligre;
		}
		
		.expression-swiper-item-text{
			overflow: auto;
			display: block;
			.expression-swiper-list-empji{
				padding-bottom: calc(calc(((100vw - 15rpx * 2 * 5) / 5)) + 10px);
				.expression-swiper-item-empji{
					display: inline-block;
					width: 20%;
					text-align: center;
					padding: 5px 0;
				}
			}
		}
		.expression-swiper-item-images{
			display: flex;
			flex-wrap: wrap;
			overflow: auto;
			.expression-swiper-item-img{
				// 左右2变
				width: calc((100% - 15rpx * 2 * 5) / 5);
				height: calc((100vw - 15rpx * 2 * 5) / 5);
				margin:  10px 15rpx;
				background-color: $uni-bg-color;
				.expression-img-addImg{
					border: dashed 1px #000000;
					height: 100%;
					display: flex;
					justify-content: center;
					align-items: center;
					border-radius: 10px;
					.iconfont.icon-add{
						font-size:  calc((100vw - 15rpx * 2 * 5) / 5 * 0.5); 
					}
				}
				
				.expression-img-swiper{
					width: 100%;
					height: 100%;
					display: inline-block;
				}
			}
		}
		
		.popup-content{
			width: 100%;
			height: 100vh;
			overflow: auto;
			background-color: $uni-ba-color-ligre;
			position: relative;
			.content-expression{
				display: flex;
				flex-wrap: wrap;
				.content-expression-item{
					background-color: $uni-bg-color;
					width: calc((100% - 8 * 5px) / 4) ;
					height: calc((100vw - 8 * 5px) / 4);
					margin: 5px;
					position: relative;
					.expression-img-swiper{
						display: block;
						width: 100%;
						height: 100%;
					}
					
					.expression-u-checkbox{
						position: absolute;
						right: 0px;
						bottom: 0px;
						display: inline-block;
						width: 100%;
						height: 100%;
						.expression-u-checkbox-offset{
							position: absolute;
							right: 5px;
							bottom: 5px;
						}
					}
				}
				.content-expression-item.addImg{
					display: flex;
					justify-content: center;
					align-items: center;
					.iconfont.icon-add{
						font-size: 30px;
					}
				}
			}
			.popup-content-delete{
				display: flex;
				align-items: center;
				flex-direction: row-reverse;
				padding-right: 20px;
				box-sizing: border-box;
				position: absolute;
				bottom: 0;
				background-color: #FFFFFF;
				width: 100%;
				height: 50px;
				color: $uni-color-primary-dark;
			}
		}
	}
	
</style>
