<template>
	<view class="details"
		<!-- #ifdef H5 -->
		:style="getViewPortSize"
		<!-- #endif -->
	>
		<view class="details-head">
			<u-navbar @leftClick="toBack">
				<view slot="left" style="padding-right: 30rpx;" class="iconfont icon-fanhui" ></view>
				<text slot="right" class="iconfont icon-shenglvehao"></text>
			</u-navbar>
		</view>
		
		<view class="details-avatar-content">
			<view class="details-avatar-content-left">
				<u-avatar :src="img + user.imgurl" shape="square" size="68"></u-avatar>
			</view>
			<view class="details-avatar-content-right" >
				<view class="details-avatar-name">
					{{user.name}} 
					<text class="iconfont" :class="user.sex == 1 ? 'icon-nan' : user.sex == 2 ? 'icon-nv' : 'icon-baomi' "></text>
				</view>
				<view class="details-avatar-account">
					账号:{{user.account}}
				</view>
			</view>
		</view>
		<view class="details-beizhu">
			<u-cell title="备注" :border="false">
				<text slot="right-icon" class="iconfont icon-next"></text>
			</u-cell>
		</view>
		
		<view class="details-sign">
			<u-cell :border="false">
				<text slot="right-icon" class="iconfont icon-next"></text>
				<view slot="icon">个性签名:</view>
				<view slot="title">
					{{user.exp }}
				</view>
			</u-cell> 
		</view>
		
		<view class="details-button">
			<button type="default" class="details-button-ms" @click="onClickSwitchFunction">{{
				isFriend == true ? "发消息" : "添加好友到通讯录"
			}}</button>
		</view>
		
		<add-buddy :value="show" :data="user" @Cancel="onCancel" ></add-buddy>
	</view>
</template>
<script>
	import { gainUserInfo ,img , getIsFriend} from "../../Api/index.js"
	import AddBuddy from "../../components/AddBuddy.vue"
	export default{
		components:{
			'add-buddy':AddBuddy
		},
		data(){
			return {
				id:null,
				user:{},
				img:img,
				isFriend:false,
				show:false
			}
		},
		onLoad(options){
			this.id = options.id
			const { userid } = this.userInfo
			// 获取好友的信息
			gainUserInfo(options.id,result=>{
				if(result.data.code == 200){
					this.user = result.data.data
					console.log(this.user)
				}
			})
			if(this.id == userid){
				this.isFriend = true
				return
			}
			// 判断是不是好友
			getIsFriend(userid,options.id,result=>{
				const { code ,isFriend } = result.data
				this.isFriend = isFriend
			})
		},
		methods:{
			// 返回上一级
			toBack(){
				uni.navigateBack({
					delta:1
				})
			},
			onCancel(){
				this.show = false
			},
			// 这里是根据是不是好友执行不同的事件
			onClickSwitchFunction(){
				const { isFriend , addFriend,onClickFriendMssage } = this
				isFriend == false ? this.show = true : onClickFriendMssage()
			},
			// 点击给好友发送消息
			onClickFriendMssage(){
				let { userid ,name,imgurl } = this.user 
				uni.redirectTo({
					url:`../chat/chat?id=${userid}&name=${name}&imgurl=${imgurl}`
				})
			}
		}
	}
</script>


<style lang="scss" scoped>
	.details{
		height: 100vh;
		background-color: $uni-bg-color-grey;
		.details-head{
			.iconfont{
				font-size:$uni-font-size-gr;
			}
			
		}
		.details-avatar-content{
			background-color:$uni-bg-color;
			display: flex;
			padding: 20rpx 30rpx;
			
			.details-avatar-content-right{
				flex: 1;
				margin-left:20rpx;
				width: 100%;
				overflow: hidden;
				display: flex;
				flex-direction:column;
				.details-avatar-name{
					max-width: calc(100% - 16px - 5px);
					text-overflow: ellipsis;
					overflow: hidden;
					white-space: nowrap;
					margin-right: 5px;
				}
				
				.details-avatar-account{
					font-size: $uni-font-size-base;
					margin-top: 5px;
					color:#bababa;
				}
				
				.iconfont.icon-nan{
					color:rgb(46, 137, 255)
				}
				
				.iconfont.icon-nv{
					color: rgb(255, 0, 127);
				}
				
				.iconfont.icon-baomi{
					color: $uni-color-primary-light;
				}
			}
		}
		.details-beizhu{
			border-top: solid 1px $uni-border-color;
			background-color:$uni-bg-color;
		}
		
		.details-sign{
			margin:20px 0;
			background-color:$uni-bg-color;
		}
	}
	
	.details-button-ms{
		background-color: $uni-color-primary;
		font-size: 30rpx;
		padding: 5rpx 0 ;
	}
</style>