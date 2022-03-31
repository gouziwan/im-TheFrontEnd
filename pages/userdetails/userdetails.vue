<template>
	<view class="user_details" 
		<!-- #ifdef H5 -->
		:style="getViewPortSize"
		<!-- #endif -->
	>
		<u-navbar bgColor="#f3f3f3">
			  <template slot="left">
				  <text class="iconfont icon-fanhui" style="font-size:25px;" @click="toback"></text>
			  </template>
			  <template slot="center">
				  <text>个人资料</text>
			  </template>
		</u-navbar>
		<view class="user_content">
			<u-cell-group>
				<u-cell @click="toAvatarage" :border="false">
					<template slot="icon">
						<text>头像</text>
					</template>
					<template slot="value">
						<u-avatar :src="getAvataImg" size="100rpx"  mode="aspectFit"  shape="square"></u-avatar>
					</template>
					<template slot="right-icon">
						<text class="iconfont icon-next"></text>
					</template>
				</u-cell>
			</u-cell-group>
			<u-cell-group>
				<u-cell :border="false" class="cell-item" @click="onSelectShow(1)">
					<template slot="icon">
						<text>名字</text>
					</template>
					<template slot="value">
						<text>{{userInfo.name}}</text>
					</template>
					<template slot="right-icon">
						<text class="iconfont icon-next"></text>
					</template>
				</u-cell>
			</u-cell-group>
			<u-cell-group>
				<u-cell :border="false" @click="onSelectShow(3)">
					<template slot="icon">
						<text>性别</text>
					</template>
					<template slot="value">
						<text>{{sexTran}}</text>
					</template>
					<template slot="right-icon">
						<text class="iconfont icon-next"></text>
					</template>
				</u-cell>
			</u-cell-group>
			<u-cell-group>
				<u-cell :border="false" @click="onSelectShow(2)">
					<template slot="icon">
						<text>个性签名</text>
					</template>
					<template slot="value">
						<text>{{userInfo.exp}}</text>
					</template>
					<template slot="right-icon">
						<text class="iconfont icon-next"></text>
					</template>
				</u-cell>
			</u-cell-group>
			<u-cell-group>
				<u-cell :border="false" >
					<template slot="icon">
						<text>邮箱号</text>
					</template>
					<template slot="value">
						<text>{{userInfo.email}}</text>
					</template>
					<template slot="right-icon">
						<text class="iconfont icon-next"></text>
					</template>
				</u-cell>
			</u-cell-group>
			<u-cell-group>
				<u-cell :border="false" @click="onSelectShow(5)" >
					<template slot="icon">
						<text>手机号</text>
					</template>
					<template slot="value">
						<text>{{userInfo.phone}}</text>
					</template>
					<template slot="right-icon">
						<text class="iconfont icon-next"></text>
					</template>
				</u-cell>
			</u-cell-group>
			<u-cell-group>
				<u-cell :border="false">
					<template slot="icon">
						<text>账号</text>
					</template>
					<template slot="value">
						<text>{{userInfo.account}}</text>
					</template>
					<template slot="right-icon">
						<text class="iconfont icon-next"></text>
					</template>
				</u-cell>
			</u-cell-group>
			<u-cell-group>
				<u-cell :border="false" @click="onSelectShow(4)">
					<template slot="icon"> 
						<text>生日</text>
					</template>
					<template slot="value">
						<text>{{getConversionTime(userInfo.birth)}}</text>
					</template>
					<template slot="right-icon">
						<text class="iconfont icon-next"></text>
					</template>
				</u-cell>
			</u-cell-group>
		</view>
		<u-popup :show="show" :overlay="false" >
		    <view class="popup" 
				<!-- #ifdef H5 -->
				:style="getViewPortSize"
				<!-- #endif -->
			>
				<!-- 修改日期的时候隐藏 -->
				<template v-if="type !== 4 ">
					 <u-navbar
						:title="selectTitle"
					>	
						<view slot="left">
							<text class="iconfont icon-shanchu" @click="onClickHidePupop"></text>
						</view>
						
						<!-- #ifndef MP -->
						<view slot="right">
							<button type="default" class="popup-hread-button" hover-class="popup-hread-button-hover" :class="isDefault ? 'disable':''"  :disabled="isDefault" @click="onClickSelectFunction">修改</button>
						</view>
						<!-- #endif -->
					</u-navbar>
				</template>
				<view class="popup-content">
					<!-- 修改昵称 -->
					<template v-if="type == 1">
						<u--input placeholder="请输入昵称" :adjustPosition="false" @foucs="getloe()" style="background-color: #f0f0f0;" v-model="value" :focus="isFocus"></u--input>
					</template>
					<!-- 修改个性签名 -->
					<template v-else-if="type == 2">
						<u--textarea v-model="value" :adjustPosition="false" placeholder="请输入内容" style="background-color: #f0f0f0;" cursor="-1" count :focus="isFocus"></u--textarea>
					</template>
					<!-- 修改性别 -->
					<template v-else-if="type == 3">
						<radio-group @change="onChange">
							<label class="radio_userdetail" v-for="(item,index) in radioList" :for="item.name" :key="index">
								<radio :value="item.name" :key="index" name="item" :id="item.name" style="opacity: 0; display: none;" />
								<view style="margin-left: 30px;">{{item.value}}</view>
								<text class="iconfont icon-70BasicIcons-all-37" style="margin-right: 30px;" v-if="item.name == selectValue "></text>
							</label>
						</radio-group>
					</template>
					<!-- 修改出生地址 -->
					<template v-else-if="type == 4">
						 <u-datetime-picker
							@confirm="onGetSelectTiem"
						    :show="currentShow"
							@cancel="onClicckCancel"
						    mode="date"
							v-model="currentTime"
							:minDate="31507200000"
							:maxDate="4102416000000"
						></u-datetime-picker>
					</template>
					<!-- 修改手机号 -->
					<template v-else-if="type == 5">
						<u--input placeholder="请输入手机号" :adjustPosition="false" style="background-color: #f0f0f0;" v-model="value" :focus="isFocus"></u--input>
					</template>
					<!-- #ifdef MP -->
					<template v-if="type !== 4 ">
						<button class="popup-content-button" hover-class="popup-hread-button-hover" :class="isDefault ? 'disable':''"   :disabled="isDefault" style="margin: 20px;" @click="onClickSelectFunction"> 
							修改
						</button>
					</template>
					<!-- #endif -->
					<u-toast ref="uToast" class="toast"></u-toast>
				</view>
			</view> 
	
		</u-popup>

	</view>
</template>

<script>
	import { 
		modifyNickNames ,
		modifyingSignature,
		modifyTheGender,
		modifyTheBirthday,
		modifyThePhoneNumber ,
	} from "../../Api/index.js";
	
	const NikenErr = {
		type:'default',
		message:''
	}
	
	const loadding = {
		type:'loading',
		message:'加载中',
		duration:9999999
	}
	
	//  0 为未知 1为男 2为女
	const radioList = [
		{name:'0',value:'未知'},
		{name:'1',value:'男'},
		{name:'2',value:'女'}
	]
	
	
	export default {
		data(){
			return {
				show:false,
				// 修改样式信息 如果 type 1是修改昵称 2 是修改个性签名
				type:1,
				value:'',
				radioList,
				selectValue:'',
				isFocus:false,
				currentTime:Number(new Date()),
				currentShow:false,
				height:0,
			}
		},
		computed:{
			selectTitle(){
				const { type } = this;
				let title = ''
				switch(type){
					case 1:
						title = "修改昵称"
						break
					case 2:
						title = "修改个性签名"
						break
						
					case 3:
						title = "修改性别"
						break
				}
				return title
			},
			isDefault(){
				const { name,exp,sex ,phone} = this.userInfo
				const { type ,value ,selectValue} = this;	
				let boolean = '';
				switch(type){
					case 1:
						boolean = value === name || value.length <= 0 || value.length > 18
						break
					case 2:
						boolean = value === exp || value.length <= 0;
						break
					case 3:						
						boolean = selectValue === sex
						break;
					case 5:
						boolean =  value === phone || value.length<=0;
						break;
				}
				
				return  boolean
			},
			sexTran(){
				let arr = ['未知','男','女']
				return arr[this.userInfo.sex]
			}
			
		},
		methods:{
			toback(){
				// 跳转上一级
				uni.navigateBack({
					delta:1
				})
			},
			// 跳转到 修改头像页面
			toAvatarage(){
				uni.navigateTo({
					url:'../userAvarta/userAvarta'
				})
			},
			// 把时间转成 xxxx年xx月xxx日
			getConversionTime(time){
				time = time * 1
				if(time == null) return ''
				if(isNaN(time)) return ''
				let data = new Date(time);
				let year = data.getFullYear();
				let moth = data.getMonth()+1
				let day = data.getDate();
				return year+'年'+moth+'月'+day+'日'
			},
			// 这个是点击修改 显示类型
			onSelectShow(num){
				this.type = num;
				this.show = true
				// 这个是默认显示的东西
				this.onClickDefaultText();
			},
			// 隐藏弹窗
			onClickHidePupop(){
				this.show = false
			},
			// 点击发送的执行的函数
			onClickSelectFunction(){
				const { type,uploadNick,uploadSing,uploadSex,modifyPhone } = this;
				
				this.$refs.uToast.show(loadding);
				
				switch(type){
					case 1:
						uploadNick();
						break
					case 2:
						uploadSing();
						break
					case 3:
						uploadSex()
						break;
					case 5:
						modifyPhone();
						break
				}
			},
			// 点击输入框默认显示的东西
			onClickDefaultText(){
				const { type , userInfo} = this
				const { name,exp , sex,birth,phone } = userInfo;
				switch(type){
					case 1:
						this.value = name
						// 输入框聚焦
						break
					case 2:
						this.value = exp
						break
					case 3:
						this.selectValue = sex;
						break
					case 4:
						this.currentShow = true;
						this.currentTime = Number(birth)
						break
					case 5:
						this.value = phone
						break
				}
			},
			onChange(e){
				this.selectValue = e.detail.value
			},
			// 获取用户选中的日期
			onGetSelectTiem(val){
				const { token } = this;
				
				this.$refs.uToast.show(loadding);
				
				modifyTheBirthday(val.value,token,
					v=>{
						if(v.data.code == 200){
							this.userInfo.birth = val.value
							this.currentShow = false
							this.show = false
						}else {
							NikenErr.message = v.data.msg
							this.$refs.uToast.show(NikenErr);
						}
					}
				)
			},
			// 点击取消返回隐藏
			onClicckCancel(){
				this.show = false;
				this.currentShow = false
			},
			// 修改昵称
			uploadNick(){
				const {value ,token} = this	
				modifyNickNames(value,token,
					v => {
						if(v.data.code == 200){
							this.show  = false
							this.userInfo.name = value
						}else{
							NikenErr.message = v.data.msg
							this.$refs.uToast.show(NikenErr);
						}
					}		
				)
			},
			// 修改个性签名
			uploadSing(){
				const {value,token} = this;
				modifyingSignature(value,token,
					v => {
						if(v.data.code == 200){
							this.show = false
							this.userInfo.exp = value
						}else{
							NikenErr.message = v.data.msg
							this.$refs.uToast.show(NikenErr);
						}
					}
				)
			},
			// 修改性别
			uploadSex(){
				const {token,selectValue} = this;
				modifyTheGender(selectValue,token,
					v => {
						if(v.data.code == 200){
							this.show  = false
							this.userInfo.sex = selectValue
						}else{
							NikenErr.message = v.data.msg;
							this.$refs.uToast.show(NikenErr);
						}
					}
				)
			},
			// 修改手机号
			modifyPhone(){
				const {token,value} = this;
				
				let req = /^1[3456789]\d{9}$/;
				// 不是手机号正确格式
				if(!req.test(value)){
					NikenErr.message="手机号格式不正确"
					this.$refs.uToast.show(NikenErr)
					return
				}
				// 如果验证成功发送
				modifyThePhoneNumber(value,token,v=>{
					if(v.data.code == 200){
						// 修改成功咯
						this.show  = false
						this.userInfo.phone = value
					}else{
						NikenErr.message = v.data.msg;
						this.$refs.uToast.show(NikenErr);
					}
				})
			},
			
			getloe(){
				alert(visualViewport.height)
			}
		},
		watch:{
			show(newValue){
				const { type } = this
				if(newValue && (type == 1 || type ==2 || type == 5) ){
					setTimeout(()=>{
						this.isFocus = true;
					},0)
				}else if(newValue == false){
					this.isFocus = false
					this.$refs.uToast && this.$refs.uToast.hide();
				}
				
			}
		}
	}
</script>


<style lang="scss" scoped>
	.user_details{
		background-color: $uni-bg-color-grey;
		height: 100vh;
		overflow: hidden;
	}
	
	.user_content{
		background-color:$uni-bg-color;
		.iconfont.icon-next{
			color: $uni-text-color-grey;
		}
	}
	
	.u-cell{
		padding: 15rpx 0 !important;
	}
	
	
	.popup-input{
		
		.popup-input-uinput{
			background-color: $uni-bg-color-grey;
		}
		
		.popup-button{
			height: 40px;
			background-color: $uni-color-primary;
			line-height: 40px;
			color: $uni-text-color;
			margin: 20px;
			&.defalut{
				background-color: rgb(247,247,247);
			}
		}
		
		.popup-button-hover{
			background-color: $uni-color-primary-light;
		}
	}
	
	
	.popup{
		width: 100%;
		height: 100vh;
	
		.iconfont.icon-shanchu{
			padding: 15rpx;
		}
		
		.popup-hread-button,.popup-content-button{
			font-size: $uni-font-size-base;
			height: 30px;
			line-height: 30px;
			background-color:$uni-color-primary;
		}
		
		.popup-content-button{
			height: 40px;
			line-height: 40px;
			font-size: $uni-font-size-lg;
		}
		
		.popup-hread-button-hover{
			background-color:$uni-color-primary-light;
		}
		
		.popup-content-button.disable,.popup-hread-button.disable{
			background-color: #e3e3e3;
		}
		
		
		
		.radio_userdetail{
			display: flex;
			width: 100%;
			border-bottom: solid 1px #f0f0f0;
			height: 40px;
			justify-content: space-between;
			align-items: center;
		}
		
		.radio_userdetail:nth-last-child(1){
			border: none;
		}
		
		.iconfont.icon-70BasicIcons-all-37{
			font-size: $uni-font-size-el;
			color:$uni-color-primary
		}
	}	
</style>