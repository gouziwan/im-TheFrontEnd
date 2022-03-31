<template>
	<view class="forgotpassword">
		<u-navbar @leftClick="backLink">
			<template slot="left">
				<text class="iconfont icon-fanhui"></text>
			</template>
		</u-navbar>
		
		<view class="forgotpassword-content">
			<view class="forgotpassword-content-steps">
				<u-steps :current="current">
					<u-steps-item :title="value.title" v-for="(value,index) in stepsItem" >
						<text class="slot-icon iconfont icon-zhengque" slot="icon" :style="{
							width:stepsStyle.fontSize + 'px',
							height:stepsStyle.fontSize + 'px',
						}" v-if="current > index"></text>
					</u-steps-item>
				</u-steps>
			</view>
			
			<swiper class="forgotpassword-content-swiper" :current="current" disable-touch :touchable="false">
				<swiper-item class="forgotpassword-content-swiper-item">
					<view class="swiper-item-conenten">
						<input class="swiper-item-inpout" v-model="phone" placeholder="请输入账号"/>
					</view>
					<view :style="{
						opacity: this.titleError === '' ? 0 : 1,
						color:'red',
						fontSize:'14px'
					}"
					>
					{{titleError}}
					</view>
				</swiper-item>
				
				<swiper-item class="forgotpassword-content-swiper-item">
					<view class="swiper-item-conenten" :style="{
						margin:'25rpx 0'
					}">
						<input class="swiper-item-inpout"    v-model="email" placeholder="请输入邮箱"/>
					</view>
					<view class="swiper-item-conenten" :style="{
						margin:'25rpx 0'
					}">
						<input class="swiper-item-inpout"  v-model="code" placeholder="请输入6位验证码" />
						<button type="default" class="loogin-button-code" :class="isSendCode ? '' : 'disabled' " :disabled="!isSendCode"   hover-class="loogin-button-code-hover" @click="onGetCode" >
							{{ isSendCode ? '获取验证码' : count }}
						</button>
					</view>
					<view :style="{
						opacity: this.titleError === '' ? 0 : 1,
						color:'red',
						fontSize:'14px'
					}"
					>
					{{ titleError }}
					</view>
				</swiper-item>
				
				<swiper-item class="forgotpassword-content-swiper-item">
					<view class="swiper-item-conenten" :style="{
						margin:'25rpx 0'
					}">
						<input class="swiper-item-inpout" password v-model="password" placeholder="新的密码"/>
					</view>
					<view class="swiper-item-conenten" :style="{
						margin:'25rpx 0'
					}">
						<input class="swiper-item-inpout" password v-model="newPassword" placeholder="重新输入密码" />
					</view>
					<view :style="{
						opacity: this.titleError === '' ? 0 : 1,
						color:'red',
						fontSize:'14px'
					}"
					>
					{{ titleError }}
					</view>
				</swiper-item>
			</swiper>
			
			<view class="loogin-button">
				<button type="default" class="loogin-button-primary"  hover-class="loogin-button-primary-hover" @click="onClick">
					{{ showText }}
				</button>
			</view>
		</view>
		
		<u-toast ref="uToast"></u-toast>
		<u-modal :show="show"  confirmText="返回登录" @confirm="onConfirm">
			<view class="slot-content">
				<view style="text-align: center;">密码修改成功</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import { getUpdatePasswrodCode,verifyEmailAccounts,isCodeCrounted,upUserPasswrold } from "../../Api/index.js"
	export default {
		data(){
			return {
				current:0,
				stepsStyle:{
					fontSize:18
				},
				phone:'',
				email:'',
				code:'',
				password:'',
				newPassword:'',
				titleError:'',
				isSendCode:true,
				stepsItem:[
					{
						title:'输入账号',
						funName:'isPhoneCorrect'
					},
					{
						title:'输入邮箱',
						funName:'isCodeCorrect'
					},
					{
						title:'新的密码'
					}
				],
				count:60,
				show:false
			}
		},
		computed:{
			showText(){
				return this.isCurrent ? '确定' : '下一步'
			},
			isCurrent(){
				return this.current === this.stepsItem.length - 1
			},
			// password
			isPasswordEmpty(){
				let req = /^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]{8,18}$/
				return req.test(this.password)
			},
			isNewPasswordEmpty(){
				let req = /^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]{8,18}$/
				return req.test(this.newPassword)
			},
			isPasswroldConsistent(){
				return this.isPasswordEmpty && this.isNewPasswordEmpty && this.password === this.newPassword
			}
		},
		methods:{
			backLink(){
				uni.navigateBack({
					delta:1
				})
			},
			onGetCode(){
				if(!this.isEmailCorrecct()){
					this.titleError = '邮箱格式不正确'
					return 
				}
				
				this.titleError = '';
				verifyEmailAccounts(this.phone,this.email,res=>{
					const { data , msg } = res.data
					if(data){
						// 发送验证码	
						this.isSendCode = false
						
						const { uToast } = this.$refs
						
						uToast.show({
							type: 'loading',
							title: '正在加载',
							message: "发送中",
							duration:999999999999999999
						})
						
						getUpdatePasswrodCode(this.email,res=>{
							const { msg } = res.data
							uToast.show({
								type: 'default',
								message: msg,
								duration:1000
							})
						},e=>{
							uToast.show({
								type: 'default',
								message: `网络连接失败`,
								duration:1000
							})
						})
						
						this.$clock({
							fun: miao => this.count = miao,
							succ: ()=> {this.isSendCode = true;this.count = 60;},
							start:60,
							end:0,
							item:1000
						})
					}else{
						this.titleError = msg
					}
				})
			},
			onClick(){
						this.titleError = ''
				
				
				if(this.isCurrent){
					// 这里执行发送修改密码
					this.upPasswrold(
						()=>{},
						msg=>{
							this.titleError = msg
						}
					)
				}else{
					let { funName } = this.stepsItem[this.current];		
		
					this[funName](
						()=>this.current++,
						val => {
							this.titleError = val
						}
					)
				}
			},
			isPhoneCorrect(success,fail){
				let req = /^[0-9]*$/
				if(req.test(this.phone) && this.phone.length >= 5){
					success()
				}else{
					fail('请输入数字,且不能小于5')
				}
			},
			isCodeCorrect(success,fail){
				if(!this.isEmailCorrecct()){
					fail('邮箱格式错误')
					return
				}
				
				if(this.code.length <= 0){
					fail('验证码不能为空')
					return
				
				}
				// 验证验证码
				isCodeCrounted(this.phone,this.email,this.code,
				res=>{
					const { code, data ,msg } = res.data
					if(code == 200){
						data ? success && success() : fail && fail(msg)
					}else{
						fail && fail(msg)
					}
				})	
			},
			isEmailCorrecct(){
				let req = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
				
				return req.test(this.email)
			},
			upPasswrold(success,fail){
				if(!this.isPasswordEmpty || !this.isNewPasswordEmpty) return fail('密码必须由字母、数字组成，区分大小写 密码长度为8-18位')
				
				if(!this.isPasswroldConsistent) return fail('两次输入密码不一致');
				
				const { uToast } = this.$refs
				
				uToast.show({
					type: 'loading',
					title: '正在加载',
					message: "发送中",
					duration:999999999999999999
				})
				
				upUserPasswrold(this.phone,this.email,this.code,this.password,
					res=>{
						const { data,msg } = res.data
						
						if(data){
							// 修改成功
							uToast.hide();
							this.show = true
						}else{
							uToast.show({
								type: 'default',
								message: msg,
								duration:1000
							})
						}
					}
				)
				
			},
			onConfirm(){
				uni.redirectTo({
					url:'../login/login'
				})
			}
		}
	}
</script>

<style lang="scss">
	.iconfont.icon-fanhui{
		font-size:23px;
	}
	.slot-icon{
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		border-radius: 50%;
		border: solid 1px #3c9cff;
		color: #3c9cff;
	}
	
	.login-title{
		margin-right: 30rpx;
	}
	
	
	.forgotpassword-content-steps{
		margin: 50px 0;
	}
	.forgotpassword-content-swiper{
		display: block;
		padding: 0 90rpx;
		height: 300rpx;
		margin: 50px 0;
		.forgotpassword-content-swiper-item{
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			.swiper-item-conenten{
				display: flex;
				justify-content: center;
				align-items: center;
				margin: 50rpx 0;
				width: 100%;
				.swiper-item-inpout{
					width: 100%;
					display: inline-block;
					flex: 1;
					border: solid 1px rgb(198, 198, 198);
					border-radius: 10rpx;
			
					padding: 5px;
				}
				
				.swiper-item-title{
					margin-right: 10px;
					font-size: 30rpx;
				}
					
					
				.loogin-button-code{
					font-size: $uni-font-size-base;
					margin-left: 15px;
					background-color: #007BFF;
					color: #FFFFFF;
					min-width: 200rpx;
				}
				
				.loogin-button-code-hover{
					background-color: #006de1;
				}
				
				.loogin-button-code.disabled{
					background-color: rgba(0, 123, 255,.5);
				}
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
