<template>
	<scroll-view class="chat-view-scroll"
		scroll-y
		:scroll-into-view="currentId"
		:scroll-with-animation=" isLoading ? false : true"
		@scrolltoupper="onScrolltoupper"
		:scroll-anchoring="true"
	>	
		<view class="chat-view-loading" v-if="isLoading">
			<u-loadmore :status="isNomore == true ? 'nomore' : 'loading'" loadingIcon="semicircle" />
		</view>
		<view class="char_view-list" v-for="(item,index) in value" :id="'index-' + index" :key="index">
				<view class="char_view_list_item" >
					{{DateTiem.diffDay(item.send_tiem)}}
				</view>
				
				<view class="char_view_list_content" :class="isFriendSend(item) === false ? '' : 'right'" >
					<view class="char_list-avatar">
						<u-avatar :src="showAvatar(item)" shape="square" size="40"></u-avatar>
					</view>
					<view class="char_list_neiron-right">
						<view class="char_list_neiron-name" v-if="false">
							二狗子
						</view>
						<view class="char_list_neiron_content" >
							<!-- 1是文字 2是图片 3是视频 4是地图-->
							<template v-if="item.types == 1">
								<text :class="isFriendSend(item) == false ? 'char_list_neiron_content_text' : 'char_list_neiron_content_text_right'">
									{{item.msg}}
								</text>
							</template>
							<template v-else-if="item.types == 2">
								<char-view-img :src="getImgUrl(item.msg)" :item="item" :map="map" @click="onPreviewImgage"></char-view-img>
							</template>
							<template v-else-if="item.types == 3">
								<char-view-video :item="item"></char-view-video>
							</template>
							<template v-else-if="item.types == 4">
								<char-view-map :item="item.msg"></char-view-map>
							</template>
						</view>
				</view>
			</view>
		</view>		
	</scroll-view>
</template>

<script>
	import CharViewImg from "./CharViewImg.vue"
	import CharViewVideo from "./CharViewVideo.vue"
	import CharViewMap from "./CharViewMap.vue"
	import { img } from "../Api/index.js"
	import DateTiem from "../plugin/date.js"
	
	export default {
		components:{
			'char-view-img':CharViewImg,
			'char-view-video':CharViewVideo,
			'char-view-map':CharViewMap
		},
		props:{
			value:{
				type:Array,
				default:[]
			},
			currentId:{
				type:String,
				default:''
			},
			friendAvatar:{
				type:String,
				default:''
			},
			isLoading:{
				type:Boolean,
				default:false
			},
			isNomore:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return {
				img:img,
				scroll:'',
				map:[],
				currentShowNumber:10,
			}
		},
		
		methods:{
			// 一开始跳到最后一张	
			onPreviewImgage(item,src){
				let index = item.indexOf(src);			
				uni.previewImage({
					current:index,
					urls:item
				})
			},
			// 判断是不是自己
			isFriendSend(item){
				const { userId } = item
				return this.userInfo.userid === userId
			},
			showAvatar(item){
				const { img,friendAvatar ,userInfo ,isFriendSend} = this
				return isFriendSend(item) == false ?  img + friendAvatar : img + userInfo.imgurl
			},
			getImgUrl(item){
				let req = /\bblob\b:\bhttp\b|^\bhttp\b/
				return req.test(item) == true ? item : this.img + item	
			},
			onScrolltoupper(e){
				this.$emit('scrolltoupper',e)
			}
		}
	}
</script>

<style lang="scss">
	.chat-view-scroll{
		flex:1;
		height: 100%;
		background-color:$uni-ba-color-ligre ;
		overflow: hidden;
		background-color: $uni-bg-color-grey;
		// transform: rotate(-180deg);
		overflow-anchor:auto;
		.char_view-list{
			 overflow-anchor:auto;
			.char_view_list_item{
				text-align: center;
				font-size: $uni-font-size-sm;
				color: $uni-text-color-grey;
			}
			
			.char_view_list_content{
				word-break: break-all;
				display: flex;
				padding-left: 30rpx;
				padding-right: calc(30rpx + 44px);
				margin: 10px 0;
				.char_list_neiron-right{
					margin-left: 10px;
					.char_list_neiron-name{
						font-size: 30rpx;
						margin-bottom: 15rpx;
					}
					.char_list_neiron_content{
						.char_list_neiron_content_text{
							display: flex;
							background-color: $uni-bg-color;
							min-height: 40px;
							box-sizing: border-box;	
							justify-content: center;
							align-items: center;
							border-radius: 5px;
							position: relative;
							margin-left: 15rpx;
							padding: 10px 15px;
							box-sizing: border-box;
							font-size: $uni-font-size-base;
						}
				
						.char_list_neiron_content_text::before{
							content: '';
							width: 0;
							height: 0;
							position: absolute;
							left: -14px;
							border: solid 7px rgba(0,0,0,0);
							border-right-color:$uni-bg-color;
							top: 15.5px;
						}
					}
				}
			}
			
			.char_view_list_content.right{
				flex-direction: row-reverse;
				padding-right: 30rpx;
				padding-left: calc(30rpx + 44px);
				.char_list_neiron-right{
					margin-right: 10px;
					.char_list_neiron-name{
						text-align: right;
					}
					
					.char_list_neiron_content_text_right{
						display: inline-flex;
						background-color: $uni-color-primary;
						min-height: 40px;
						justify-content: center;
						align-items: center;
						padding: 0px 10px;
						border-radius: 5px;
						position: relative;
						margin-right: 15rpx;
						padding: 10px 15px;
						box-sizing: border-box;
						font-size: $uni-font-size-base;
					}
					
					.char_list_neiron_content_text_right::before{
						content: '';
						width: 0;
						height: 0;
						position: absolute;
						right: -14px;
						border: solid 7px rgba(0,0,0,0);
						border-left-color:$uni-color-primary;
						top: 12px;
					}
				}
			}
		}
		
		.char_view-list:last-child{
			padding-bottom: 10px;
		}
	}
</style>
