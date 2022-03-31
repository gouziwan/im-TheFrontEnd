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
		
		<u-list @scrolltolower="onScrolltolower" :height="getHeight" lowerThreshold="40">
				<view class="search-content-le" v-if="searchRuslut.length > 0" style="height: 100%;">
						<u-list-item v-for="(item,index) in searchRuslut" :key="index">
							<app-cell overflo :style="{
								border:index == searchRuslut.length - 1 ? 'none' : false
							}">
								<template  slot="left">
									<u-avatar :src="addressMosaicPicture(item.imgurl)" mode="aspectFill"></u-avatar>
								</template>
								<template slot="content">
									<view style="width: 100%; overflow: hidden; text-overflow: ellipsis;" v-html="item.text"></view>
								</template>
								<template slot="right">
									<button 
										type="default" 
										class="search-content-right-button" 
										:hover-class="item.isFriend == 1 ? 'friend-hover' : 'isfriend-hover'" 
										:class="item.isFriend == 1 ?'friend':'isfriend'"
										@click="clickAddBudy(item)"
									>
										{{item.isFriend == 1 ? "发消息" : "加好友"}}
									</button>
								</template>
							</app-cell>
						</u-list-item>
						
						<view class="search_title-loading" style="margin-bottom: 20px;" v-if="currentExecu">
							<u-loading-icon mode="circle" text="加载中..." textColor="#000" size="16"></u-loading-icon>
						</view>
						
						<view class="search_title-loading" style="margin-bottom: 20px;text-align: center;display: flex;align-items: center;justify-content: center;" v-if="!isNextPath">
							<text class="iconfont icon-meiyougengduo1" style="font-size: 30px;"></text> 到底了。。。。。
						</view>
				</view>
				<!-- 提示空空如也 -->
				<u-empty
				    mode="data"
				    :icon="getTitltImg"
					v-if="searchRuslut.length == 0"
				>
				</u-empty>
		</u-list>
		<u-toast ref="toast"></u-toast>
		<add-buddy :value="addBuddyShow" @Cancel="onClearc" :data="currentUser"></add-buddy>
	</view>
</template>


<script>
	import { img , getSearchUserList } from "../../Api/index.js"
	
	import appCell from "../../components/app-cell.vue"
	
	import AddBuddy from "../../components/AddBuddy.vue"
	
	import { mapState } from "vuex"
	
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
				// 显示添加好友
				addBuddyShow:false,
				// 当前添加的用户
				currentUser:{},
				type:'',
				// 滚动到底部当前有执行的请求
				currentExecu:false,
				// 是否有下一页
				isNextPath:true
			}
		},
		onLoad(res){
			const { type ,content} = res
			this.searchValue = content;
			this.type = type;
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
			// 小程序跟网页图片不一致
			getTitltImg(){
				// #ifdef MP
					return "../../../../static/images/数据为空.png"
				// #endif
				// #ifdef H5
					return "../../static/images/数据为空.png"
				// #endif	
			},
			// 接收 搜索页面第一次得到的数组的值
			...mapState(['searchPageValue']),
			getHeight(){
				// #ifdef MP
					return "calc(100vh - 44px)"
				// #endif
				// #ifdef H5
					const { innerHeight } =this	
					return innerHeight - 44
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
				const { userInfo,searchValue,addhighlighted } = this
				const { toast } = this.$refs
				getSearchUserList({
					userid:userInfo.userid,
					content:searchValue,
					success: val =>{
						if(val.data.code == 200){
							const {data,nextPage} = val.data 
							this.isNextPath = nextPage;
							addhighlighted(data)
							this.searchRuslut = data
							data.length === 0 
								? toast.show({type:'default',message:`没有找到指定的用户`})
								: toast.hide();
						}else{
							toast.show({type:'default',message:val.data.msg})
						}
						this.currentExecu = false
					},
					list:15
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
				// 添加好友 这个是 列表的加为好友按钮
				if(item.isFriend == 0){
					this.addBuddyShow = true
					this.currentUser = item
				}
			},
			
			// 点击取消事件
			onClearc(){
				this.addBuddyShow = false
			},
			// 滚动到底部
			onScrolltolower(e){
				const { currentExecu,nextPath,isNextPath,type } = this
				if(currentExecu == false && isNextPath){
					this.currentExecu = true
					type == 0 ? this.loadMoreSeachUser() : '';
				}
			},
			//这个是加载更多的
			 loadMoreSeachUser(){
				const {userInfo,searchValue,searchRuslut,addhighlighted} = this
				 getSearchUserList({
					 userid:userInfo.userid,
					 content:searchValue,
					 offset:searchRuslut.length,
					 list:15,
					 success:res=>{
						 const { nextPage ,code ,data  } = res.data;
						 if(code == 200){
							 addhighlighted(data)
							 this.searchRuslut.push(...data);
							 this.isNextPath = nextPage
						 }						 
						 this.currentExecu = false
					 }
				 })
			},
			// 
		},		
		mounted(){
			// #ifdef MP
				console.log(this.getMenuButtonInfo)
			// #endif
			this.onConfirmSearch()
			this.$refs.toast.show(loadedTip);
		},
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
	
		
			.search-content-le{
				margin-bottom: 20px;
				background-color: $uni-bg-color;
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

</style>