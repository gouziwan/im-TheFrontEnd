<template>
	<view class="friend"
		:style="getHeight"
	>
	<u-navbar
		 title="好友列表"
		 fixed
		 placeholder
	 >
		<template slot="left">
			 <text class="iconfont icon-tianjiahaoyou1" @click="onClickToSeachPage"></text>
		 </template>
	 </u-navbar>
	<u-index-list :index-list="indexList" activeColor="#FBE836" >
		<u-index-item>
			<u-cell-group>
				<u-cell icon="setting-fill" title="新的好友" @click="onClickToFriendRequestPage" :arrow="false">
					<template slot="icon">
						<text class="iconfont icon-zu"  style="font-size:30px"></text>
					</template>
					<template slot="right-icon">
						<u-badge  max="99" :value="value"></u-badge>
					</template>
				</u-cell>
			</u-cell-group> 
		</u-index-item>
		<u-index-item v-for="(item, index) in itemArr" :key="index">
			<!-- #ifndef APP-NVUE -->
			<u-index-anchor :text="indexList[index]" height="25" size="12" ></u-index-anchor>
			<!-- #endif -->
			<u-cell-group>
				<u-cell :title="val.name" arrow-direction="down" v-for="(val,i) in item" :key="val.userid" @click="toFriendDetailsPage(val.userid)">
					<template slot="icon">
						<u-avatar :src="img + val.imgurl" style="margin-right: 10px;"></u-avatar>
					</template>
				</u-cell>
			</u-cell-group>	
		</u-index-item>	
		<!-- 占位符 -->
		 <u-index-item>
		 	<view style="opacity: 0;">
				<u-navbar
					 title="好友列表"
					 placeholder
					style="opacity: 0;"
				 >
					 <template slot="left">占位
						 <view class="iconfont icon-tianjiahaoyou1"></view>
					 </template>
				 </u-navbar> 
			</view>
		  </u-index-item>
	</u-index-list>	 	
	</view>
</template>

<script>
	import { getNewFriendTitleNumber,getFriendList,img } from "../../Api/index.js"
	export default {
		data() {
			return {
				indexList: [],
				itemArr: [
					
				],
				value:0,
				img:img
			}
		},
		created(){
			this.getCacheDate()
			this.getCachFriendDate()
			 
		},
		mounted(){
			this.getNewFriendTitleNumber()	
			this.getFriendList()
		},
		computed:{
			// #ifdef H5
				getHeight(){
					let data = {
						height:`calc(${this.innerHeight}px - 50px)`
					}
					return data
				},
			// #endif
		},
		methods:{
			// 跳转到搜索页面
			onClickToSeachPage(){
				uni.navigateTo({
					url:'../search/search'
				})
			},
			onClickToFriendRequestPage(){
				uni.navigateTo({
					url:`../FriendRequest/FriendRequest`
				})   
			},
			getNewFriendTitleNumber(){
				const {userid} = this.userInfo
				getNewFriendTitleNumber(userid, v=>{
					const {code,newMsg} = v.data;
					// 缓存数据
					if(code == 200) {
						if(this.value == newMsg) {
							this.$setStorage({
								key:'user_friend_newTitle',
								kes:userid,
								data:newMsg
							})
						}
						this.value = newMsg
					}
				})
			},
			// 获取好友提示的数据缓存中的数据
			getCacheDate(){
				const { userid } = this.userInfo
				if(userid == undefined || userid == '') return
				this.$getStorage({
					key:'user_friend_newTitle',
					success:result => {
						this.value = result[userid] ? result[userid] : 0
					}
				})
			},
			// 获取好友列表
			getFriendList(){
				const {userid} = this.userInfo
				getFriendList(userid,v=>{
					const { code ,pinyinArr} = v.data
					if(code == 200){
						const { keyArr,valArr } = this.processDate(pinyinArr);
						this.indexList = keyArr
						this.itemArr = valArr
						// 缓存
						this.$setStorage({
							key:'user_friend',
							data:pinyinArr,
							kes:userid
						})
					} 
				})
			},
			// 把得到的数据进行处理
			processDate(data){
				// 所谓的key 就是idnex
				let keyArr = [];
				let valArr = [];
				
				for(let key in data){
					let val = data[key];
					keyArr.push(key)
					valArr.push(val);
				}	
				
				return {
					keyArr,
					valArr
				}
			},
			// 获取缓存好友的数据
			getCachFriendDate(){
				this.$getStorage({
					key:'user_friend',
					success:result=>{
						const { userid } = this.userInfo;
						let val = result[userid]
						if(val instanceof Object){
							const {keyArr, valArr} = this.processDate(val)
							this.indexList = keyArr							this.itemArr = valArr
						}
					}
				})
			},
			// 跳转到好友详情页面
			toFriendDetailsPage(userid){
				uni.navigateTo({
					url:'../details/details?id='+userid,
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.friend{
		width: 100%;
		overflow: hidden;
		border: soloid 1px red;
		height: 100vh;
		.iconfont{
			font-size: $uni-font-icon-sm;
		}
		
		.iconfont.icon-zu{
			color: $uni-color-primary-dark;
			margin-right: 5px;
		}
		
		.iconfont.icon-qunliao{
			color: rgb(23, 255, 23);
			margin-right: 5px;
		}
		
		.friend-list{
			margin-bottom: 100px;
			
		}
	}
	
	.friend::-webkit-scrollbar{
		display: none;
	} 
	
	
	.list-cell {
		display: flex;
		box-sizing: border-box;
		width: 100%;
		padding: 10px 24rpx;
		overflow: hidden;
		color: #323233;
		font-size: 14px;
		line-height: 24px;
		background-color: #fff;
	}
</style>