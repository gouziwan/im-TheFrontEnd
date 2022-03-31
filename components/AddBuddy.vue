<template>
	<!-- 添加好友单独一个组件出来 -->
	<u-popup :show="show">
	    <view class="add-buddy"
			<!-- #ifdef H5 -->
			:style="getViewPortSize"
			<!-- #endif -->
		>
		  <u-navbar
			title="添加好友"
		  >
			<template slot="left">
				<text @click="onCancel" style="padding-right: 20px;">取消</text>
			</template>
		  </u-navbar>
		  
		  <view class="add-buddy-conetent">
			  <view class="add-buddy-avatar"  >
				  <u-avatar :src="img + data.imgurl"  size="88" @click="onClickPreview"></u-avatar>
				  <text class="iconfont icon-nv" v-if="data.sex == 2"></text>
				  <text class="iconfont icon-nan" v-if="data.sex == 1"></text>
				  <text class="iconfont icon-baomi" v-if="data.sex == 0"></text>
			  </view>
			  <view class="add-buddy-name">
				  {{data.name}}
			  </view>
			  <view class="add-buddy-textart">
				  <u-textarea  baColor="#f0f0f0" :showConfirmBar="false" :adjustPosition="false" @input="onInput" :focus="isFocus" class="add-buddy-text-textart" placeholder="描述一下你自己" count ></u-textarea>
			  </view>
		  </view>
		  
		  <view class="details-button-content">
			  <button type="default" class="details-button-ms" @click="onClickAddFriend" >加好友</button>
		  </view>
		</view>
		<u-toast ref="Toast"></u-toast>
	</u-popup>	
</template>

<script>
	import { img ,sendFriendRequest } from "../Api/index.js"
	
	const loadedTip = {
		type: 'loading',
		title: '正在加载',
		message: "正在加载",
		duration:100000000000
	}
	
	export default {
		props:{
			value:{
				type:Boolean,
				default:false
			},
			data:{
				type:Object,
				default:{}
			}
		},
		data(){
			return {
				show:true,
				isFocus:false,
				img,
				introduceValue:''
			}
		},
		methods:{
			// 取消事件
			onCancel(){
				this.$emit("Cancel");
			},
			// 添加好友事件
			onClickAddFriend(){
				const { userInfo , data, introduceValue } = this;
				const { Toast } = this.$refs
				Toast.show(loadedTip)
				sendFriendRequest({
					userid:userInfo.userid,
					friendid:data.userid,
					content:introduceValue,
					success: v =>{
						const { msg } = v.data
						Toast.show({
							type:'default',
							message:msg
						})
					},
					fail:()=>{
						Toast.show({
							type:'default',
							message:'网络链接失败'
						})
					}
				})
			},
			onInput(val){
				this.introduceValue = val
			},
			// 点击头像预览图片
			onClickPreview(){
				let { data } = this
				uni.previewImage({
					current:0,
					urls:[img + data.imgurl]
				})
			}
		},
		watch:{
			show:{
				handler(val){
					val ? setTimeout(()=>this.isFocus = true,500) : this.isFocus = false
				}
			},
			value:{
				immediate:true,
				handler(val){
					this.show = val
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.add-buddy{
		height: 100vh;
		/* 小程序有效果 */
	}


	.add-buddy-conetent{
		position: relative;
	
	}	
	.add-buddy-avatar{
		position: absolute;
		left: 50%;
		top: 0;
		transform: translateX(-50%);
		.iconfont{
			position: absolute;
			bottom: 0;
			right: 0;
		}
		.iconfont.icon-nv{
			color: rgb(255,0,127);
		}
		.iconfont.icon-nan{
			color:rgb(46, 137, 255)
		}
		
		.iconfont.icon-baomi{
			color: $uni-color-primary-light;
		}
	}
	
	.add-buddy-name{
		padding-top: 95px;
		text-align: center;
	}
	
	.add-buddy-textart{
		padding: 0 30rpx;
		.add-buddy-text-textart{
			background-color: $uni-ba-color-ligre !important;
			margin-top: 20rpx;
		}
	}
	.details-button-ms{
		background-color: $uni-color-primary;
		font-size: $uni-font-size-base;
		position: absolute;
		bottom: 20px;
		width: 80%;
		left: 50%;
		transform: translateX(-50%);
		/* #ifdef MP */
			padding: 5px 0;
		/* #endif */
	}
</style>
