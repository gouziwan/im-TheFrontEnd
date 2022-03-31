<template>
	<view class="login" 
		<!-- #ifdef H5 -->
		:style="getViewPortSize"
		<!-- #endif -->
	>
		 <u-navbar>
			<view slot="left">
				<!-- #ifdef MP -->
				<view style="margin-left: 30rpx;" @click="toRegister">注册</view>
				<!-- #endif -->
			</view>
			<!-- #ifdef H5 -->
			<view slot="right">
				<view class="login-title"  @click="toRegister">注册</view>
			</view>
			<!-- #endif -->
		</u-navbar>
		
		<view class="login-title-loog">
			<text class="iconfont icon-dog"></text>
		</view>
		<!-- 登录文字 -->
		<view class="loogin-text">
			<view>
				<text class="loogin-text-lg">登录</text>
			</view>
			<view>
				<text class="loogin-text-sm">您好欢迎来到狗子通讯！！</text>
			</view>
		</view>	
			
			
		<view class="login-input">
			 <view class="login-content_input">
				 <input type="text" class="login-input-account" v-model="account" placeholder="请输入账号或者邮箱号">
				 <text class="iconfont icon-shanchu" v-show="isShowClear" @click="clearValue"></text>
			 </view>
			<view>
				 <input type="password" class="login-input-pasword" v-model="password" placeholder="请输入密码">
			</view>
		</view>
		
		<view class="loogin-button">
			<view class="loogin-wangji" @click="onForgotPassword">忘记密码？</view>
			<button type="default" class="loogin-button-primary"  hover-class="loogin-button-primary-hover" @click="login" >登录</button>
		</view>
		<u-toast ref="Toast"></u-toast>
	</view>
</template>


<script>
	import { userLogin,getUserAllMssage } from "../../Api/index.js"
	
	import Socket from "../../Socket/Socket.js"
	const errToast = {
		type:"default",
		message:'请输入账号或密码',
		duration:1500
	}
	
	// 登录的提示
	const loadToast = {
		type: 'loading',
		message:"登录中。。。",
		duration:99999999
	}
	
	// 其他错误
	const other = {
		type: 'default',
		message: ""
	}
	
	export default{
		data(){
			return {
				account:'',
				password:'',
			}
		},
		computed:{
			isShowClear(){
				return this.account.length > 0
			}
		},
		methods:{
			login(){
				if(this.account.length <= 0 || this.password.length <=0){
					this.$refs.Toast.show(errToast) 
					return 
				}
				this.$refs.Toast.show(loadToast) 
				userLogin({account:this.account,password:this.password},
					v => {
						this.$refs.Toast.hide();
						if(v.data.code == 200){
							// 登录成功
							// 保存 token
							uni.setStorageSync('user_token',v.data.token);
							this.$setStorage({
								key:'user_info',
								data:v.data.data
							})
							this.$store.state.userInfo = v.data.data
							// 获取用户聊天信息
							this.getUserAllMssage()
							this.initServiceLink()
							// 保存个人信息跳转
							uni.switchTab({
								url:"../index/index"
							})
						}else{
							// 登录失败
							other.message = v.data.msg
							this.$refs.Toast.show(other)
						}
					}
				)
			},
			clearValue(){
				this.account = ''
			},
			
			toRegister(){
				uni.navigateTo({
					url:"../register/register"
				})  
			},
			// 获取用户的信息
			getUserAllMssage(){
				const { userid } = this.userInfo
				getUserAllMssage(userid,res=>{
					const { data,user,code } = res.data
					if(code === 200){
						this.$store.state.userChar = data
						this.$store.state.userFriend = user
					}
				})
			},
			onForgotPassword(){
				uni.navigateTo({
					url:'../Forgotpassword/ForgotPassword'
				})
			}
		},
		mixins:[Socket]
	}
	
</script>
	

<style lang="scss">
	.login-title{
		margin-right: 30rpx;
	}
	
	.login-title-loog{
		text-align: center;
		.iconfont{
			font-size: 150rpx;
			color: $uni-color-primary;
		}
	}
	
	.loogin-text{
		padding:0 $uni-spacing-row-lg;
		margin-top: 30rpx;
		view{
			margin-top: 10px;
		}
		.loogin-text-lg{
			font-size: 40rpx;
			font-family: 600;
		}
		.loogin-text-sm{
			font-size: 30rpx;
			color:$uni-text-color-grey;
		}
	}	
	
	.login-input{
		padding:0 $uni-spacing-row-lg;
		margin-top: 20px;
		box-sizing: border-box;
		
		.login-input-account,.login-input-pasword{
			border-bottom: solid 1px $uni-border-color;
			padding: 15rpx 20px 15rpx 0;
			margin-top: 10px;
			
		}
		
		.login-input-pasword{
			padding-right: 0;
		}
		
		.login-content_input{
			position: relative;
			
			.iconfont.icon-shanchu{
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				right: 0;
			}
		}
	}
	.loogin-button{
		margin-top: 50rpx;
		text-align: center;
		.loogin-button-primary{
			width: 450rpx;
			border-radius: $uni-border-radius-lg;
			background-color: $uni-color-primary;
			outline: none;
			height: 80rpx;
			font-size: $uni-font-size-lg;
			line-height: 80rpx;
			color: $uni-text-color;
			box-shadow: 0px 50rpx 35rpx -33rpx rgba(255,228,49,0.4);
		}
		.loogin-button-primary-hover{
			background-color: $uni-color-primary-hover;
		}
		.loogin-wangji{
			margin-bottom: 10px;
			font-size: $uni-font-size-base;
		}
	}		
</style>