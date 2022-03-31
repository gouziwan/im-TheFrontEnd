<template>
	<div class="register"
		<!-- #ifdef H5 -->
		:style="getViewPortSize"
		<!-- #endif -->
	> 
		<u-navbar>
			<template slot="left">
				<text class="iconfont icon-fanhui" @click="backLink"></text>
			</template>
		</u-navbar>
		 <view class="login-title-loog">
			<text class="iconfont icon-dog"></text>
		 </view>
		 
		 <!-- 登录文字 -->
		 <view class="loogin-text">
		 	<view>
		 		<text class="loogin-text-lg">注册</text>
		 	</view>
		 	<view>
		 		<text class="loogin-text-sm">您好欢迎来注册狗子通讯！！</text>
		 	</view>
		 </view>
			 
			 
		<!-- 文本输入 -->
		<view class="register-input">
			<view class="register-input-content">
				  <input placeholder="请输入注册号"  class="register-input-username" @input="getAccountValue" v-model="accountValue" />
				  <view class="register-input-content-err" v-if="!isVerifyAccount">{{accountTitle}}</view>
			</view>
			<view class="register-input-content">
				  <input  placeholder="请输入邮箱"  class="register-input-username" @input="getEmailValue" v-model="emailValue" />
				  <view class="register-input-content-err" v-if="!isVerifyEmail">{{ emailTitle  }}</view>
			</view>
			<view class="register-input-content">
				<input  placeholder="密码" password="true" class="register-input-passwrold" @input="getPasswordValue" v-model="passwordValue"  />
			</view>
			<view class="register-input-content">
				<input  placeholder="验证码"   class="register-input-username" style="calc(100% - 100px)" @input="getCodeValue" v-model="codeValue" />
				<button type="default" class="register-input-button" @click="sendCode" :disabled="!isSendCode">
					{{isSendCode==true ? '发送验证码' : count}}
				</button>
			</view>
			<!-- v-if="passwordErr"  -->
			<view class="register-input-passwrold-err" v-if="passwordTitle.length>0 || passwordTitle!='' || codeTitle.length>0 || codeTitle!='' " >
				<template>
					{{ passwordTitle || codeTitle  }}
				</template>
			</view>
		</view>	 		
		
		<!-- 按钮 -->
		<view class="register-button">
			<button type="default" class="register-button-primary" hover-class="register-button-primary-hover" @click="clickSendRegister" :class="!isDefaultButton == true ? 'disabled' : ''"  :disabled="!isDefaultButton" >注册</button>
		</view>		
		
		<u-toast ref="Toast"></u-toast>
		<u-modal :show="show" @confirm="confirm" confirmText="返回登录">
			<view style="width: 100%;height: 100%; display: flex; justify-content: center;align-items: center;">
				注册成功
			</view>
		</u-modal>
	 </div>
</template>


<script>
	import { accountRegistr,verifyEmail,emailCode,userRegister } from "../../Api/index.js"
	import { shake } from "../../minxis/index.js"
	
	const codeErr = {
		type: 'default',
		message: "邮箱不能为空"
	}
	
	const succeen = {
		type: 'default',
		message:'发送成功'
	}
	
	const err = {
		type: 'default',
		message:'发送失败'
	}
	
	export default{
		data(){
			return {
				// 账号
				accountValue:'',
				isVerifyAccount:false,
				accountTitle:'',
				// 邮箱
				emailValue:'',
				isVerifyEmail:false,
				emailTitle:'',
				// 密码
				passwordValue:'',
				isVerifyPassword:false,
				passwordTitle:'',
				// 验证码
				codeValue:'',
				isVerifyCode:false,
				codeTitle:'',
				// 这个是节流多少ms
				tiem:500,
				// 计时器秒数
				count:0,
				// 是否可以发送验证码
				isSendCode:true,
				// 登录成功弹出框
				show:false,
				content:'',
				isSendCodeNum:0
			}
		},
		computed:{
			isDefaultButton(){
				return this.accountValue.length > 5 && this.isVerifyAccount == true
				 && this.emailValue.length > 0 && this.isVerifyEmail == true
				 && this.codeValue.length > 0 && this.isVerifyCode == true
				 && this.passwordValue.length > 0 && this.isVerifyPassword == true
				 && this.isSendCodeNum !==0
			}
		},
		methods:{
			// 验证跟获取去
			getAccountValue(e){
				// 获取当前内容
				let val = e.detail.value.replace(/ |\s/g,'')
				
				let req = /^[0-9]*$/
				
				if(!req.test(val)){
					this.accountTitle = '账号只能由数字组成'
					this.isVerifyAccount = false
					return
				}
				
				
				if(val.length < 5){
					this.accountTitle = '账号不少于5位'
					this.isVerifyAccount = false
					return
				}
				
				
				
				// 发送请求
				this.$shake(()=>{
					accountRegistr(val, v => {
						// 没有被注册
						if(v.data.code == 200){
							this.isVerifyAccount = true;
							this.accountTitle = ""
							this.accountValue = val
						}else{
							this.isVerifyAccount = false;
							this.accountTitle = v.data.msg
						}
					})
				},this.tiem)	
			},
			// 验证邮箱
			getEmailValue(e){
				let val = e.detail.value.replace(/ |\s/g,'');
				let req = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
	
				if(!req.test(val) || val.length<=0 || val == '' ){	
					this.emailTitle = '邮箱格式不对'
					this.isVerifyEmail = false
					return
				}
				this.$shake(()=>{
					verifyEmail(val,v =>{
						if(v.data.code == 200){
							this.isVerifyEmail = true;
							this.emailTitle = '';
							this.emailValue = val
						}else{
							this.isVerifyEmail = false;
							this.emailTitle = v.data.msg
						}
					})
				},this.tiem)		
			},
			// 获取密码
			getPasswordValue(e){
				let val = e.detail.value.replace(/ |\s/g,'');
				
				let req = /^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]{8,18}$/
				
				if(!req.test(val)){
					this.passwordTitle = '密码必须由字母、数字组成，区分大小写 密码长度为8-18位'
					this.isVerifyPassword = false
					return 
				}else{
					this.passwordTitle = ''
					this.isVerifyPassword = true
					this.passwordValue = val
				}
			},
			// 发送验证码
			sendCode(){
				// 发送验证码错误
				if(this.emailValue.length<=0 || this.emailValue == '' || this.isVerifyEmail == false){
					if(this.emailValue.length > 0){
						codeErr.message = this.emailTitle
					}else {
						codeErr.message=" 输入不能为空"
					}
					
					
					this.$refs.Toast.show(codeErr);
					return 
				}
				
				if(this.isSendCode){
					emailCode(this.emailValue,v=>{
						this.isSendCode = false
						if(v.data.code == 200){
							this.$refs.Toast.show(succeen)
							this.isSendCodeNum++
						}else{
							this.$refs.Toast.show(err)
						}
					})
					this.$clock({
						fun: miao => this.count = miao,
						succ: ()=> this.isSendCode = true,
						start:60,
						end:0,
						item:1000
					})		
				}
			},
			// 获取验证码
			getCodeValue(e){
					let val = e.detail.value.replace(/ |\s/g,'');
					if(val.length > 6){
						this.isVerifyCode = false;
						this.codeTitle = '验证码为6位'
						return
					}else{
						this.codeValue = val;
						this.isVerifyCode = true
						this.codeTitle = ''
					}
			},
			// 点击按钮发送请求
			clickSendRegister(){
				userRegister({
					account:this.accountValue,
					password:this.passwordValue,
					email:this.emailValue,
					vcode:this.codeValue
				},
				v => {
					if(v.data.code == 200){
						this.content = '注册成功';
						this.show = true
					}else{
						this.$refs.Toast.show({
							type:'defalut',
							message:v.data.msg
						})
						
					}
				})
			},
			// 点击成功跳转到登录页面
			confirm(){
				uni.redirectTo({
					url:"../login/login"
				})
			},
			// 返回上一级
			backLink(){
				uni.navigateBack({
					delta:1
				})
			}
		},
		
	}
	
</script>

<style lang="scss">
	.register{
		.iconfont.icon-fanhui{
			font-size:23px;
		}
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
	.register-input{
		margin-top: 30rpx;
		padding: 0 $uni-spacing-row-lg;
		
		.register-input-content{
			display: flex;
			margin-top: 30rpx;
			border-bottom: solid 1px $uni-border-color;
			padding:  5px 0;
			align-items: center;
			justify-content: space-between;
			
			.register-input-username,.register-input-passwrold{
				flex:1;
				width: 100%;
			}
	
			.register-input-content-err{
				display: inline-block;
				font-size: $uni-font-size-base;
				color: red;
				flex-shrink: 0px; /*防止被压缩*/
			}
		}
		
		.register-input-passwrold-err{
			height: $uni-font-size-base;
			line-height: $uni-font-size-base;
			font-size: $uni-font-size-base;
			text-align: center;
			margin-top: 20rpx;
			color: red;
		}
		
		.register-input-button{
			background-color: $uni-color-primary;
			font-size: 12px;
			width: 100px;
			height: 40px;
			line-height: 40px;
			text-align: center;
		}
	}		
	
	.register-button{
		margin-top: 80rpx;
		text-align: center;
		.register-button-primary{
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
		
		.register-button-primary-hover{
			background-color: $uni-color-primary-hover;
		}
		
		.register-button-primary.disabled{
			background-color: $uni-bg-color-grey;
			box-shadow:none;
		}
		
		.register-wangji{
			margin-bottom: 10px;
			font-size: $uni-font-size-base;
		}
	}			
		
	
</style>