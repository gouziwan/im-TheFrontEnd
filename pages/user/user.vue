<template>
	<view class="user"
		<!-- #ifdef H5 -->
		:style="getHeight"
		<!-- #endif -->
	>
		<!-- 占位符 -->
		<u-navbar
			placeholder
		    >
			<template slot="left">
				<view></view>
			</template>
		</u-navbar>
		
		<view class="user-head" @click="toUserInfo">
			<!-- <u--image :src="getAvataImg" radius="10" width="130rpx" height="130rpx" mode="aspectFit"></u--image>	 -->
			<u-avatar :src="getAvataImg" size="130rpx"  mode="aspectFit"  shape="square"></u-avatar>
			<view class="user-head-content">
				<view class="user-head_name">
					{{ userInfo.name }}
				</view>
				<view class="user-head_text">
					<view class="user-head_text_acc">账号:{{userInfo.email}}</view>
					<view class="iconfont icon-fanhui1"></view>
				</view>
			</view>
		</view>
	
		<view class="user-content">
			<view class="user-content-item">
				<u-cell-group>
					<u-cell  title="收藏">
						<template slot="icon">
							<text class="iconfont icon-shoucang" style="color:#2979FF;font-size: 18px;margin-right: 10px;"></text>
						</template>
						<template slot="value">
							<text class="iconfont icon-next" ></text>
						</template>
					</u-cell>
					<u-cell  title="表情">
						<template slot="icon">
							<text class="iconfont icon-biaoqing-xue" style="color:#ffca0a;font-size: 18px;margin-right: 10px;"></text>
						</template>
						<template slot="value">
							<text class="iconfont icon-next" ></text>
						</template>
					</u-cell>
					<u-cell title="个性装扮">
						<template slot="icon">
							<text class="iconfont icon-zhuangban" style="color:#ff5805;font-size: 18px;margin-right: 10px;"></text>
						</template>
						<template slot="value">
							<text class="iconfont icon-next" ></text>
						</template>
					</u-cell>
				</u-cell-group>
			</view>
			<view class="user-content-item" @click="logOut">
				<u-cell-group>
					<u-cell  title="退出登录">
						<template slot="icon">
							<text class="iconfont icon-tuichu" style="color:#11a4ff;font-size: 18px;margin-right: 10px;"></text>
						</template>
					</u-cell>
				</u-cell-group>
			</view>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import { logOut } from "../../Api/index.js"
	export default{
		data(){
			return {
				
			}
		},
		computed:{
			// #ifdef H5
				getHeight(){
					let data = {
						height:`calc(${this.innerHeight}px - 50px)`
					}
					return data
				}
			// #endif
		},
		methods:{
			toUserInfo(){
				uni.navigateTo({
					url:'../userdetails/userdetails'
				})
			},
			// 退出登录
			logOut(){
				this.$refs.uToast.show(	{
					type: 'loading',
					message: "加载中...",
					title: '正在加载',
				})
				logOut(this.token,res=>{
					uni.removeStorageSync('user_token');
					uni.reLaunch({
						url:"../login/login"
					})
				})
			}
		}
	}
	
	
</script>

<style lang="scss">
	.user{
		background-color: $uni-bg-color-grey;
		height: 100vh;
	}
	.user-head{
		display: flex;
		padding: 0 20px 20px 20px;
		background-color: $uni-bg-color;
		box-sizing: border-box;
		.user-head-content{
			display: flex;
		    flex-direction: column;
			justify-content: space-around;
			width: calc(100% - 20px - 130rpx - 10px);
			margin-left: 10px;
			.user-head_name{
				width: 100%;
				display: inline-block;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			
			.user-head_text{
				display: flex;
				align-items: center;
				.user-head_text_acc{
					font-size: $uni-font-size-base;
					color: $uni-text-color-grey;
					flex: 1;
					width: 100%;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
				}
				.iconfont{
					font-size: $uni-font-size-sm;
					color: $uni-text-color-grey;
				}
			}
		}
	}
	
	
	.user-content{
		.user-content-item{
			background-color: $uni-bg-color;
			margin-top: 20px;
			.iconfont{
				color: $uni-text-color-grey;
			}
		}
	}
	
</style>