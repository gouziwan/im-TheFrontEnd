<template>
	<view class="index"
		<!-- #ifdef H5 -->
		:style="getHeight"
		<!-- #endif -->
	>
		<u-navbar
			:border="true"
			fixed
			placeholder
		    >
			<template slot="left">
				<u-avatar :src="getAvataImg" size="33" shape="square" mode="aspectFill"></u-avatar>
			</template>
			<template slot="center">
				<view v-if="isLink === true">狗子通讯</view>
				<view style="display: flex;" v-else>
					<u-loading-icon size="16" mode="semicircle" style="margin-right: 10px;"></u-loading-icon>   连接中...
				</view>
			</template>
			<!-- #ifndef MP-->
				<template slot="right">
					<text class="iconfont icon-sousuo" style="margin-right: 20px;" @click="toSearchPage"></text>
					<text class="iconfont icon-add"></text>
				</template>
			<!-- #endif -->	
		</u-navbar>
		
		<!-- 小程序编译 -->
		<scroll-view 
			class="index_content" 
			refresher-enabled 
			scroll-y
			refresher-background="#f9f9f9"
			refresher-default-style="none"
			:refresher-triggered="currentStatus"
			@refresherpulling="onRefresherpulling"
			@refresherrefresh="onRefresherrefresh"
			@refresherrestore="onRefresherrestore"
			@refresherabort="onRefresherabort"
		>
			<!-- 下拉刷新-->
			<view class="index_content_refresher" :style="{
				top:currentY+'px'
			}">
				<text class="iconfont icon-xialashuaxin"></text>
				<text>{{refreshPromp}}</text>
			</view>
		<!-- #ifdef MP-->
			<view @click.stop.prevent="toSearchPage">
				<u-search placeholder="搜索" v-model="search" :showAction="false" :disabled="true"></u-search>
			</view>
		<!-- #endif -->
			<view class="index_content-list">
					<u-empty mode="message" icon="../../static/images/消息为空.png" v-if="getDialogue.length === 0"></u-empty>
					<u-swipe-action >
						<u-swipe-action-item :options="options" :uuid="item.userid" v-for="item in getDialogue" :key="item.userid" @click="onSelectClick" ref="swipe-item" :name="item.userid">
							<view class="index_content-item" >
								<view class="index_content-item_img" data-value="item" @click="toFriendDetails(item)">
									<view class="index_content-content">
										<u-avatar :src="img+item.imgurl" size="100rpx" shape="square" mode="aspectFill" @click="toFriendDetails(item)"></u-avatar>
										<u-badge type="eeror" max="99" :value="item.total" class="index_content-u-badge" ></u-badge>
									</view>
									<view class="index_content-item_text">
										<view class="index_content-item_text_name">
											<view class="index_content-item_text_name_name">
												{{ item.name }}
											</view>
											<view class="index_content-item_text_name_day">
												{{ DateTiem.diffDay(item.time) }}
											</view>
										</view>
										<view class="index_content-item_text_bei">
											{{ newsUpdate(item) }}
										</view>
									</view>
								</view>  
							</view>
						</u-swipe-action-item>
					</u-swipe-action>
				</view>
		</scroll-view>
	</view>
</template>

<script>
	import { mapState,mapGetters } from "vuex"
	import { img,setMsgRead } from "../../Api/index.js"
	export default {
		data(){
			return {
				search:'',
				// 当前下拉状态
				currentStatus:false,
				// 当前的未知
				currentY:-30,
				refreshPromp:'下拉刷新',
				img:img,
				// 是否更新节点
				updateNode:false,
				newsArr:[],
				options:[
					{
						text: '删除',
						style:{
							backgroundColor:'red'
						}
					},
					{
						text:'已读',
						style:{
							backgroundColor:'rgb(60, 156, 255)'
						}
					}
				],
			}
		},
		onShow(){
			// 这里主要是更新 如果 Vuex 更新了列表之后 如果页面是隐藏的 就会出现新增的列表滑动不了
			if(this.updateNode){
				let arr = this.$refs['swipe-item']
				if(arr instanceof Array){
					arr.forEach(el=>{
						el.init();
					})
					this.updateNode = false
				}
			}
			this.gethistyDialogue()
		},
		computed:{
			getDialogue(){
				const { userChar ,userFriend,list } = this.$store.state
				const { userid } = this.userInfo
				
				if(!(list[userid] instanceof Object)) return []
				
				const keys = Object.keys(list[userid]);
				
				let arr = [];
				
				keys.forEach(k=>{
					let val = userFriend.filter(el => el.userid === k)[0]
					let char = userChar[k]
					if(val == undefined || char == undefined) return
					char.sort((a,b) => 	b.send_tiem * 1 - a.send_tiem * 1);
					let total = char.reduce((total,el) => {
						if(el.static == 1 && this.userInfo.userid !== el.userId){
							let arr = this.unreadMsg[el.userId];
							if(!(arr instanceof Array)) arr = [];
							if((arr.indexOf(el.id)) === -1){
								arr.push(el.id)
								this.unreadMsg[el.userId] = arr
							}
							++total
						}else{
							total 
						}
						return total
					},0)
					
					let data = {
						...val,
						time:char[0].send_tiem,
						news:char[0].msg,
						total,
						char:char[0]
					}
					arr.push(data)
				})	
				return arr
			},
			isLink(){
				return this.$store.state.isLink
			},
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
			// 自定义下拉刷新控件被下拉
			onRefresherpulling(e){
				let y = ''
				this.currentStatus = false
				
				// #ifdef H5
					y = e.detail.deltaY - 40;
					this.currentY = y
				// #endif
				
				// #ifdef MP
					y = e.detail.dy
				// #endif

				
				if(y >= 45){
					this.refreshPromp = "松开刷新"
				}else{
					this.refreshPromp = "下拉刷新"
				}
			},
			// 自定义下拉刷新
			onRefresherrefresh(e){
				// #ifdef H5
				let y = e.currentTarget.offsetTop - 35;
				this.currentY= y
				// #endif
				this.currentStatus = true;
				this.refreshPromp = '加载中。。。'
				setTimeout(()=>{
					this.currentStatus = false
				},3000)
			},
			// 复位
			onRefresherrestore(){
				this.currentY = -30;
			},
			// 中止
			onRefresherabort(){
				this.currentY = -30;
			},
			// 点击跳转到搜索页面
			toSearchPage(){
				uni.navigateTo({
					url:"../search/search"
				})
			},
			// 跳转到好友详情页面
			toFriendDetails(e){
				let {imgurl,name,userid} = e
				uni.navigateTo({
					url:`../chat/chat?id=${userid}&name=${name}&imgurl=${imgurl}`
				})
			},
			// 获取历史聊天窗口
			gethistyDialogue(){
				this.$getStorage({
					key:'user_dialogue',
					success:res=>{
						this.$store.state.list = res
					}
				})
			},
			// 监测一个消息就是说 如果是 图片不就只显示图片2字
			newsUpdate(item){
				const { char:{ types } } = item

				let data ={
					'2':'[图片]',
					'3':'[视频]',
					'4':'[位置]'
				}
				return data[types] == undefined ? item.news : data[types]
			},
			// 记录打开的用户下次的时候就不会更新
			getRecordFriend(){
				let result =  uni.getStorageSync('user_dialogue');
				return result == '' || result == undefined ? {} : JSON.parse(this.decrypt(result))		
			},
			setRecordFriend(value){
				value = this.encrypt(JSON.stringify(value));
				uni.setStorageSync('user_dialogue',value);
			},
			onSelectClick(val){
				// index = 0 删除会话 1已读 2就是置顶聊天信息
				const { index , name} = val
				const { userid } = this.userInfo;
				
				switch(index){
					case 0:
						let val = this.getRecordFriend();
						delete val[userid][name];
						this.$store.state.list = val;
						this.setRecordFriend(val)	
					break
					case 1:
						let arr = this.unreadMsg[name];
						if(arr instanceof Array && arr.length > 0){
							setMsgRead(arr,res=>{
								if(res.data.code == 200){
									this.userChar[name] = this.userChar[name].map(el=>{
										if(arr.indexOf(el.id) !== -1){
											el.static = '0'
										}
										return el
									})
									this.unreadMsg[name] = []
								}
							})
						}
						break
				}
			}
		},
		watch:{
			getDialogue(newValue,loadValue){
				if(loadValue !== undefined && newValue.length > loadValue.length){
					this.updateNode = true
				}
			}
		}
	}
	
</script>

<style lang="scss">
	.index{
		background-color: #f0f0f0;
		overflow:hidden;
		
		/*#ifdef MP*/
			height: 100vh;
		/* #endif*/
	
		/*#ifdef H5*/
			height: calc(100vh - 50px);
		/* #endif*/
		
		display: flex;
		flex-flow:column nowrap;
	
	}
	
	.index_content{
		background-color: $uni-bg-color;
		flex:1;
		position: relative;
		// h5 平台没有 下拉框 只需减去 导航栏高度
		/*#ifdef H5*/
			height: calc(100vh - 44px - 100px);
		/* #endif*/
		// 微信 平台有一个44px的搜索框 下拉框 只需减去 导航栏高度
		/*#ifdef MP*/
			height: calc(100vh - 44px - 44px - 50px);
		/* #endif*/
		overflow: hidden;
		.index_content-list{
			.index_content-item_img{
				display: flex;
				padding: 10px;
				box-sizing: border-box;
				border-bottom: solid 1rpx #f3f1f1;
				align-items: center;
				
				.index_content-content{
					
					position: relative;
					.index_content-u-badge{
						position: absolute;
						background-color: red;
						top: -10rpx;
						
						right: -10rpx;
					}
				}
				
				.index_content-item_text{
					width: 100%;
					margin-left: 10px;
					.index_content-item_text_name{
						display: flex;
						width: 100%;
						align-items: center;
						.index_content-item_text_name_name{
							width: 100px;
							flex: 1;
							white-space: nowrap;
							text-overflow: ellipsis;
							overflow: hidden;
							font-size: $uni-font-size-el;
						}
						.index_content-item_text_name_day{
							white-space: nowrap;
							text-overflow: ellipsis;
							overflow: hidden;
							color: $uni-text-color-grey;
							font-size: $uni-font-size-sm;
						}
					}
					
					.index_content-item_text_bei{
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
						width: 100%;
						margin-top: 5px;
						color: $uni-text-color-grey;
						font-size: $uni-font-size-sm;
					}
				}
			}
		}
	}
	
	.index_content_refresher{
		display: flex;
		align-items: center;
		position: absolute;
		justify-content: center;
		width: 100%;
		top:0;
		.iconfont.icon-xialashuaxin{
			font-size: 20px;
			margin-right: 10px;
		}
	}
	
	
	
	
	
</style>