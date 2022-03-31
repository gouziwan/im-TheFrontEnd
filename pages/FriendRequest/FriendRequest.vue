<template>
	<!-- 好友申请页面 -->
	<view class="friend-request">
		<u-navbar
			 title="好友申请"
			 fixed
			 placeholder
			 @leftClick="toBack"
		 >
			<template slot="left">
				 <text class="iconfont icon-fanhui" ></text>
			 </template>
		 </u-navbar>
		 <view class="friend-request-content">
			<view class="friend-request-content-list" v-for="item in userList" @touchstart="onTouchstartPopup(item)" @touchend="onTouchendCandelTiem">
				<view class="friend-list-avatar">
					<!-- 1才是待添加 0 已经是添加好友了 -->
					
					<!-- 逻辑是 userid 就是当前你登录的用户 因为你主动添加别人的所义 同意不了 friendid就是你添加那个人 -->
					<button class="friend-list-avatar-reject" hover-class="friend-list-avatar-reject-hover" v-if="item.friend_state == 1 && item.userid !== userInfo.userid" @click="clickRejectAddFriend(item)">拒绝</button>
					<u-avatar :src="img + item.friendInfo.imgurl" size="50"></u-avatar>
					<button class="friend-list-avatar-resolve"  hover-class="friend-list-avatar-resolve-hover" v-if="item.friend_state == 1 && item.userid !== userInfo.userid" @click="clickAgreeAddFriend(item)">同意</button>
				</view>
				
				<view class="friend-list-name">
					{{ item.friendInfo.name }}
				</view>
				
				<view class="friend-list-title" v-if="item.friend_state != 1 || userInfo.userid == item.userid ">
					{{item.friend_state == 0 ? '已成为好友': item.friend_state == 1 ? '已发送申请等待同意' : '已拒绝'}}
				</view>
				
				<view class="friend-list-tiem">
					{{timeCycle(item.create_tiem)}}
				</view>
				
				<view class="friend-list-message" >
					留言:{{item.content ? item.content:""}}
				</view>
			</view>
		 </view>
		 
		 <u-popup :show="show" mode="center" round="10">
		    <view>
				<u-toast ref="Toasts" ></u-toast>
		       <text style="margin-top: 20px;text-align: center;display: inline-block;width: 100%;">你确定删除此记录么?</text>
				<view class="friend-popup-content">
					<button class="friend-list-avatar-reject" hover-class="friend-list-avatar-reject-hover" type="default" @click="onClickHidePopup">取消</button>
					<button class="friend-list-avatar-resolve"  hover-class="friend-list-avatar-resolve-hover" @click="onClickDeleteFriend">确定</button>
				</view>
		    </view>
		 </u-popup>
		<u-toast ref="Toast" ></u-toast>
		
		<u-empty
		    mode="history"
		    :icon="getTitltImg"
			v-if="userList.length == 0"
		>
		</u-empty>
	</view>
</template>

<script>
	import { getFriendRequestRecord ,img,greeAddFriendApplay,rejectAddFriendApplay,deleteFriendRecord } from "../../Api/index.js"
	
	const Loading = {
		type:'loading',
		message:'加载中',
		duration:1000000000
	}
	
	
	export default{
		data(){
			return {
				userList:[],
				img:img,
				timeId:'',
				show:false,
				// 当我们长按弹出框的时候跳出当前id
				cruuent:''
			}
		},
		mounted(){
			this.getFriendRequest()
		},
		computed:{
			// 小程序跟网页图片不一致
			getTitltImg(){
				// #ifdef MP
					return "../../../../static/images/数据为空.png"
				// #endif
				// #ifdef H5
					return "../../static/images/数据为空.png"
				// #endif	
			}
		},
		methods:{
			getFriendRequest(){
				const { userid } = this.userInfo
				getFriendRequestRecord(userid,v=>{
					if(v.data.code == 200){
						this.userList = v.data.data
						console.log(this.userList)
					}
				})
			},
			timeCycle(time){
				let day = new Date(time * 1);
				// 年
				let year = day.getFullYear()
				// 月
				let month = day.getMonth()
				// 日
				let days = day.getDate();
				
				return `${year}-${month + 1}-${days}`
			},
			// 返回上一页
			toBack(){
				uni.navigateBack({
					delta:1
				})
			},
			// 点击同意添加好友
			clickAgreeAddFriend(value){
				const { Toast } = this.$refs
				// 这里取 userid
				const friendid = value.userid
				
				const {userid} = this.userInfo
				
				Toast.show(Loading);
	
				greeAddFriendApplay(friendid,userid,v=>{
					const { code,msg } = v.data
					Toast.show({
						type:'default',
						message:msg
					})
					if(code == 200){
						value.friend_state = 0;
					}
				})
			},
			// 点击拒绝添加好友
			clickRejectAddFriend(value){
				const { Toast } = this.$refs
				const {id} = value;
				Toast.show(Loading);
				rejectAddFriendApplay(id,v=>{
					const {code,msg} = v.data
					Toast.show({
						type:'default',
						message:msg
					})
					if(code == 200){
						value.friend_state = 2;
					}
				})
			},
			// 手指触摸事件类似长按超过500毫秒就弹出删除记录
			onTouchstartPopup(value){
				this.$shake(()=>{
					this.cruuent = value
					this.show = true
				},500)
			},
			onTouchendCandelTiem(){
				clearTimeout(this.$skmaId)
			},
			// 隐藏删除记录的弹出 Pups框
			onClickHidePopup(){
				this.show = false
			},
			//点击确定删除好友
			onClickDeleteFriend(){
				const { Toasts } = this.$refs
				
				const { id } = this.cruuent
				
				Toasts.show(Loading);
				
				deleteFriendRecord(id,v=>{
					const {code,msg} = v.data
					Toasts.show({
						type:'default',
						message:msg
					})
					if(code == 200){
						this.show = false
						for(let i in this.userList){
							const listid = this.userList[i].id;
							if(listid == id){
								this.userList.splice(i,1);
								return 
							}
						}
					} 
				})
			}
		}
	}
</script>

<style lang="scss">
	.friend-request{
		.iconfont{
			font-size: $uni-font-icon-sm;
		}
		
		.friend-request-content-list{
			margin: 15px 20px;
			padding: 10px 0;
			box-shadow: 1px 1px 5px 1px rgba(167, 167, 167, 0.3);
			.friend-list-avatar{
				display: flex;
				align-items:end;
				justify-content: space-around;
			}
			.friend-list-name{
				text-align: center;
				margin:10rpx 0;
			}
			
			.friend-list-tiem{
				color: rgb(191, 191, 191);
				font-size: $uni-font-size-sm;
				text-align: center;
			}
			
	
			.friend-list-message{
				background-color: rgb(231, 231, 231);
				border-radius: 5px;
				padding: 5px;
				font-size: $uni-font-size-base;
				margin: 15px 15px 0 15px;
			}
			
			.friend-list-title{
				text-align: center;
				color:black;
				font-size: $uni-font-size-sm;
				margin-bottom: 5px;
			}
		}
		
		
		
		.friend-popup-content{
			display: flex;
			.friend-list-avatar-reject,.friend-list-avatar-resolve{
				display: inline-block;
				margin:10px 20px 20px 20px;
			}
		}
		
		.friend-list-avatar-reject,.friend-list-avatar-resolve{
			padding: 0px 20px;
			border-radius: 50px;
			height: 25px;
			line-height: 25px;
			font-size: $uni-font-size-base;
			color: #FFFFFF;

		}
		

		.friend-list-avatar-reject{
			background-color: rgba(255, 0, 0, 0.5);
		}
		.friend-list-avatar-resolve{
			background-color: $uni-color-primary-dark;
		}
		
		.friend-list-avatar-reject-hover{
			background-color: rgba(255, 29, 29, 0.5);
		}
		.friend-list-avatar-resolve-hover{
			background-color: $uni-color-primary-hover;
		}
		
		
		
	}
	
	
</style>
