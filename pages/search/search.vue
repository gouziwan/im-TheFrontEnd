<template>
	<!-- 搜索页面 -->
	<view class="search"
		<!-- #ifdef H5 -->
		:style="getViewPortSize"
		<!-- #endif -->
	>
		<u-navbar>
			<view class="search-navbar-left" slot="left">
				<text class="iconfont icon-fanhui" @click="toBack"></text>
				<view class="search-navbar-left-content" 
					 <!-- #ifdef MP -->
						:style="{
							width:`calc(100% - 25px - 30rpx - 16px - ${getMenuButtonInfo}px)`
						}"
					 <!-- #endif -->
				>
					<input class="search-navbar-left-input" v-model="searchValue" @confirm="onConfirmSearch" placeholder="昵称/账号/群号"></input>
					<text class="iconfont icon-sousuo"></text>
					<text class="iconfont icon-shanchu" v-show="clearShow" @click="onClickClearEmpty"></text>
				</view>
			</view>
		</u-navbar>
		<view class="search-content">
			<view class="search-content-list">		
				<view class="search-content-le" v-if="searchRuslut.length > 0">
					<u-list :scrollable="false" style="height:100%;">
						<u-cell>
							<view slot="title" style="font-size: 14px;">用户</view>
							<view slot="right-icon" style="font-size: 13px;" v-show="searchRuslut.length > 3 " @click="onClickViewMore(0)">查看更多></view>
						</u-cell>	
						<u-list-item v-for="(item,index) in showUserList" :key="index">
							<app-cell overflo :style="{
								border:index == searchRuslut.length - 1 ? 'none' : false
							}"  @click="onClickToFriendDetailsPage(item.userid)">
								<template  slot="left">
									<u-avatar :src="addressMosaicPicture(item.imgurl)" mode="aspectFill" ></u-avatar>
								</template>
								<template slot="content">
									<view  style="width: 100%; overflow: hidden; text-overflow: ellipsis;" v-html="item.text"></view>
								</template>
								<template slot="right">
									<button 
										type="default" 
										class="search-content-right-button" 
										:hover-class="item.isFriend == 1 ? 'friend-hover' : 'isfriend-hover'" 
										:class="item.isFriend == 1 ?'friend':'isfriend'"
										@click.stop="clickAddBudy(item)"
									>
										{{item.isFriend == 1 ? "发消息" : "加好友"}}
									</button>
								</template>
							</app-cell>
						</u-list-item>
					</u-list>		
				</view>
				
				<view class="search-content-le" v-if="searchChar.length > 0">
					<u-list :scrollable="false" style="height:100%;">
						<u-cell>
							<view slot="title" style="font-size: 14px;">群聊</view>
							<view slot="right-icon" style="font-size: 13px;">查看更多></view>
						</u-cell>	
						<u-list-item v-for="(item,index) in searchRuslut" :key="index">
							<app-cell overflo :style="{
								border:index == searchRuslut.length - 1 ? 'none' : false
							}">
								<template  slot="left">
									<u-avatar :src="addressMosaicPicture(item.imgurl)" mode="aspectFill"></u-avatar>
								</template>
								<template slot="content">
									{{ item.name + item.id }}
								</template>
								<template slot="right">
									<button type="default" class="search-content-right-button" :hover-class="index % 2 ? 'friend-hover' : 'isfriend-hover'" :class="index % 2 ?'friend':'isfriend'">发消息</button>
								</template>
							</app-cell>
						</u-list-item>
					</u-list>		
				</view>
					
				<!-- 提示空空如也 -->
				<u-empty
				    mode="data"
				    :icon="getTitltImg"
					v-if="searchRuslut.length == 0 && searchChar.length == 0"
				>
				</u-empty>
						
				<add-buddy :value="addBuddyShow" @Cancel="onClearc" :data="currentUser"></add-buddy>
			</view>
		</view>
		
		<u-toast ref="toast"></u-toast>
	</view>
</template>


<script>
	import { img , getSearchUserList } from "../../Api/index.js"
	
	import appCell from "../../components/app-cell.vue"
	
	import AddBuddy from "../../components/AddBuddy.vue"
	
	const loadedTip = {
		type: 'loading',
		title: '正在加载',
		message: "搜索中",
		duration:100000000000
	}
	
	
	export default{
		components:{
			"app-cell":appCell,
			"add-buddy":AddBuddy
		},
		data(){
			return {
				searchValue:'',
				// 用户的
				searchRuslut:[],
				// 群聊
				searchChar:[],
				// 
				addBuddyShow:false,
				// 当前添加的用户
				currentUser:{}
			}
		},
		computed:{
			// #ifdef MP
				// 获取小程序胶囊的宽度
				getMenuButtonInfo(){
					const { left } = uni.getMenuButtonBoundingClientRect();
					// 获取屏幕的宽度
					const { screenWidth } = uni.getSystemInfoSync();
					
					return screenWidth - left
				},
			// #endif
			// 是否显示右侧显示按钮
			clearShow(){
				return this.searchValue.length > 0
			},
			// 只显示数组的前3条
			showUserList(){
				return this.searchRuslut.slice(0,3)
			},
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
			// 点击搜索框里面的删除按钮清空内容
			onClickClearEmpty(){
				this.searchValue = ''
			},
			// 返回上一页
			toBack(){
				uni.navigateBack({
					delta:1
				})
			},
			// 拼接图片地址
			addressMosaicPicture(name){
				return img + name
			},
			// 点击发送请求
			onConfirmSearch(){
				const {toast} = this.$refs
				const { userInfo,searchValue,addhighlighted } = this
				
				toast.show(loadedTip)
				
				getSearchUserList({
					userid:userInfo.userid,
					content:searchValue,
					success: val =>{
						if(val.data.code == 200){
							// 没有找到内容么
							this.searchRuslut = val.data.data
							
							addhighlighted(val.data.data)
							
							val.data.data.length === 0 
								? toast.show({type:'default',message:`没有找到指定的用户`})
								: toast.hide();
						}else{
							toast.show({type:'default',message:val.data.msg})
						}
					}
				})
			},
			// 添加一个高亮效果
			addhighlighted(arr){
				const {searchValue,haString} = this
				arr.map((el,index) => {
					el.text = ''
					el.text += haString(el.name,searchValue)
					el.text += `(${haString(el.account,searchValue)})`
				})
			},
			
			// 处理字符串
			haString(str,val,color = `rgb(69, 214, 253)` ){
				let nameNuber = str.indexOf(val);	
				// 将文本转成一个数组
				if(nameNuber!==-1){
					let arr = str.split("")
					let end = nameNuber + val.length + 1
					// 这里加一是因为前面添加了一个数组长度加了
					arr.splice(nameNuber,0,`<div style="color:${color};display: inline-block;">`)
					arr.splice(end,0,'</div>')
					str = arr.join('')
				}
				return str
			},
			// 点击添加好友按钮
			clickAddBudy(item){
				let { userid ,name,imgurl } = item
				
				// 添加好友 这个是 列表的加为好友按钮
				if(item.isFriend == 0){
					this.addBuddyShow = true
					this.currentUser = item
				}else{
					uni.redirectTo({
						url:`../chat/chat?id=${userid}&name=${name}&imgurl=${imgurl}`
					})
				}
			},
			// 点击取消事件
			onClearc(){
				this.addBuddyShow = false
			},
			// 点击查看更多详情
			// type 1为 群聊 0 为好友
			onClickViewMore(type){
				const {searchValue ,searchChar } = this
				
				uni.navigateTo({
					url:`../viewMore/viewMore?content=${this.searchValue}&type=${type}`
				})
			},
			// 点击好友跳转路由
			onClickToFriendDetailsPage(id){
				uni.navigateTo({
					url:'../details/details?id='+id
				})
			}
		},		
		mounted(){
			// #ifdef MP
				console.log(this.getMenuButtonInfo)
			// #endif
		}
	}
</script>

<style scoped lang="scss">
	.search{
		height: 100vh;
		overflow: hidden;
		
		.iconfont.icon-fanhui{
			font-size: 25px;
			padding: 0 15rpx;
		}
		
		.search-navbar-left{
			display: flex;
			width: 100vw;
			align-items: center;	
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			.search-navbar-left-content{
				position: relative;
				width: calc(100% - 25px - 30rpx - 20px);
				.search-navbar-left-input{
					background-color: $uni-bg-color-grey;
					border-radius: $uni-border-radius-lg;
					padding: 5px calc(10px + 20px);
				}
				
				.iconfont.icon-sousuo{
					position: absolute;
					left: 10px;
					top: 50%;
					transform: translateY(-50%);
				}
				.iconfont.icon-shanchu{
					position: absolute;
					right: 10px;
					top: 50%;
					transform: translateY(-50%);
				}
			}
			
		}
	
		.search-content{
			background-color: $uni-bg-color-grey;
			.search-content-le{
				margin-bottom: 20px;
				background-color: $uni-bg-color;
			}
			
			.search-content-list{
				height: calc(100vh - 44px);
				overflow: auto;
			}
			
			.search-content-title{
				padding:20rpx 30rpx;
				box-sizing: border-box;
			}
			
			.search-content-le-text{
				width: 70%;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				border: solid 1px red;
			}
			
			.search-content-right-button{
				font-size: $uni-font-size-sm;
				border-radius: $uni-border-radius-lg;
			}
			
			.search-content-right-button.friend{
				background-color: $uni-color-primary;
			}
			
			.search-content-right-button.friend-hover{
				background-color:$uni-color-primary-light;
			}
			
			.search-content-right-button.isfriend{
				background-color: rgb(235,245,253);
				color:  rgb(69, 214, 253);
			}
			.search-content-right-button.isfriend-hover{
				background-color: rgb(206, 237, 253);
			}
		}
	}
</style>