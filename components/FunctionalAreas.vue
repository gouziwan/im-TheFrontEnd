<template>
	<view class="areas" v-if="isShow" :animation="animation" :style="{
		bottom:bottom+'px',
		height:height+'px'
	}">
		<view class="areas-list" v-for="item in list" >
			<view class="areas-item" @click="SwicthFunction(item.id)">
				<text class="iconfont" :class="item.icon"></text>
			</view>
			<text class="areas-item-text">{{item.txt}}</text>
		</view>
		<!-- 点击拍摄弹出的多选项 -->
		<u-action-sheet :actions="actions" :show="sheetShow" @select="onSelect" closeOnClickOverlay @close="onClose"></u-action-sheet>
		<!-- 这个是 地图获取地图 -->
		<u-popup :show="popupShow">
			<view class="areasContent-map"
			<!-- #ifdef H5 -->
			:style="{
				height:innerHeight+'px'
			}" 
			<!-- #endif -->
			>
			<u-navbar
				@leftClick="onClickShowPupop"
			>
				<template slot="left">
					取消					
				</template>
			
				<template slot="center">
					<!-- #ifdef H5 -->
					 <u--input :focus="searchFoucs" @focus="searchFoucs = true" @blur="searchFoucs = false" placeholder="搜索地址" style="margin-left: 125rpx;border: solid 1px #f1f1f1;margin-right: 155rpx;" shape="circle" @confirm="onConfirm"  ></u--input>
					<!-- #endif -->
					<!-- #ifdef MP -->
					<button type="default" class="areasContent-map-navbar">发送</button>
					<!-- #endif -->
				</template>		
				<!-- #ifdef H5 -->
				<template slot="right">
					<button type="default" class="areasContent-map-navbar" @click="onClickGetLocation">发送</button>
				</template>
				<!-- #endif -->
			</u-navbar>
				<u-toast ref="uToast"></u-toast>
				<map class="areas-map"  
				:latitude="latitude" 
				:enable-poi="true" 
				<!-- #ifdef MP -->
				 @tap="onClickgetLocation"
				 <!-- #endif -->
				 :longitude="longitude" 
				 :markers="controls"
				 >
				 </map>
				<!-- #ifdef H5 -->
				<view class="areas-popup" v-if="searchPopup" :animation="searchAanimation" >
					<view class="areas-popup-delete" style="text-align:right;border-bottom: solid 1px #f1f1f1;">
						<text class="iconfont icon-shanchu" style="margin-right: 30rpx; padding: 20rpx;display: inline-block;" @click="onClickCloseSearchPopup"></text>
					</view>
					<u-loading-icon style="margin-top: 100rpx;" mode="semicircle" v-if="searchResult.length === 0"></u-loading-icon>
					<view v-for="value in searchResult" class="areas-popup-list" @click="onClickListSwicthLongitude(value)">
						{{value.title || value.address}}
					</view>
				</view>
				<!-- #endif -->
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {loadding} from "../config.js"
	import {getLocation , getSeachCityValue} from "../Api/index.js"
	import {duration} from "../config.js"
	export default {
		props:{
			height:{
				type:Number,
				default:300
			},
			show:{
				type:Boolean,
				default:false
			},
			duration:{
				type:Number,
				default:duration
			}
		},
		data(){
			return {
				list:[
					{	id:1,
						icon:'icon-tupian1',
						txt:'图片',
					},
					{
						id:2,
						icon:'icon-paishe',
						txt:'拍摄',
					},
					{
						id:3,
						icon:'icon-ditu_dingwei_o',
						txt:'位置'
					},
					{
						id:4,
						icon:'icon-icon-test',
						txt:'音乐'
					}
				],
				actions:[
					{ 
						id:1,
						name:'照片拍摄',
					},
					{
						id:2,
						name:'视频拍摄',
					},
					{
						id:3,
						name:'取消'
					}
				],
				latitude:'39.909',
				longitude: '116.39742',
				popupShow:false,
				isShow:this.show,
				animation:'',
				bottom: -this.height,
				sheetShow:false,
				searchPopup:false,
				searchAanimation:'',
				searchFoucs:false,
				searchResult:[]
			}
		},
		computed:{
			controls(){
				const {latitude,longitude} = this
				return [
					{	
						latitude,
						longitude,
						iconPath:'/static/images/地标.png'
					}
				]
			}
		},
		methods:{
			SwicthFunction(id){
				switch(id){
					case 1:
						this.getChooselImg(id)
						break;
					case 2:
						this.sheetShow = true
						break;
					case 3:
						this.popupShow = true
						this.getUserlocation();
						break;
					case 4:
						break
				}
			},
			// 获取图片
			getChooselImg(id){
				// 兼容h5 可以选则图片视频
				// #ifdef H5
				uni.chooseFile({
					count:9,
					extension:['jpg','png','gif','jpge','mp4'],
					sourceType:['album'],
					success:res=>{
						this.getImgArr(res,id)
					}
				})
				// #endif
				
				// 兼容小程序
				// #ifdef MP
				uni.chooseMedia({
					count:9,
					sourceType:['album'],
					success:res=>{
						this.onChange({data:res,type:id})
					}
				})	
				// #endif
			},
			// 视频拍摄
			getVideoFile(id){
				// id 等于 是拍色照片 2.拍色视频 3.取消
				if(id === 3) this.onClose();
				const data = {
					count:9,
					sourceType:['camera'],
				}

				if(id === 2){
					 uni.chooseVideo({
					 	...data,
					 	success:res=>{
							const {height,width,tempFilePath,tempFile,duration} = res
							// 没有获取到
							if(res.tempFilePath == undefined) return
							
							tempFile.width = width
							
							tempFile.height = height 
							
							tempFile.duration = duration
							
							tempFile.path = tempFilePath
							
					 		let data = {
					 			data:[
									tempFile
								],
					 			type:id,
					 			types:3
					 		}
							this.onChange(data)
					 	}
					 })
				 }
				
				if(id === 1){
					uni.chooseImage({
					 	...data,
					 	success:res=>{
							this.getImgArr(res,id)
					 	}
					 })
				}			
			},	
			onClose(){
				this.sheetShow = false;
			},
			onSelect(item){
				this.getVideoFile(item.id)
			},
			onChange(res){
				this.$emit('onChange',res)
			},
			onClickShowPupop(){
				this.popupShow = false
			},
			getImgArr(res,id){
				let arrType = ['image/png','image/jpeg','video/mp4','image/gif','image/jpg',]
				const { tempFiles } = res;
				let boolean = true;
				let data = {
					data:res.tempFiles,
					type:id,
					types:2
				}						
				tempFiles.forEach(el=>{
					if(arrType.indexOf(el.type) === -1) boolean = false
				})
				
				boolean === true ? this.onChange(data) : this.onChange({type:id})
			},
			// 点击列表切换
			onClickListSwicthLongitude(item){
				const { lat , lng} = item.location;
				
				this.latitude = lat
				this.longitude = lng
			},
			// 输入框
			onConfirm(value){
				this.searchFoucs = false
				this.searchPopup = true;
				this.createAamin(0,'searchAanimation');
				const { latitude , longitude } = this
				getLocation(latitude,longitude,res=>{
					const { result } = res.data
					if(result){
						const { city } = result.ad_info
						getSeachCityValue(value,city,v=>{
							const {data} = v.data
							if(data){
								result.ad_info.address = result.address
								this.searchResult = [result.ad_info,...data];
								result.ad_info.location.lat = latitude;
								result.ad_info.location.lng = longitude
							}
						})
					}
				})
				
			},
			// 关闭搜索弹窗
			onClickCloseSearchPopup(){
				this.createAamin(-500,'searchAanimation');
				setTimeout(()=>{
					this.searchPopup = false
				},this.duration)
			},
			// 获取用户当前位置
			getUserlocation(){
				let uToast;
				setTimeout(()=>{
					uToast = this.$refs.uToast;
					uToast.show(loadding)
				},0)
				uni.getLocation({
					type:'gcj02',
					success:res=>{
						const { longitude,latitude }  = res;
						this.latitude = latitude;
						this.longitude = longitude
						uToast.hide()
					},
					fail:res=>{
						uToast.show({
							message: "获取定位失败",
						})
					}
				})
			},
			// 小程序点击其他地方切换位置
			// #ifdef MP
			onClickgetLocation(e){
				const {latitude,longitude} = e.detail;
				this.latitude = latitude;
				this.longitude = longitude
			},
			// #endif
			// 创建动画
			createAamin(value,key){
				setTimeout(()=>{
					const {duration} = this
					var animation = uni.createAnimation({
						duration
					})
					
					animation.bottom(value).step();
					
					this[key] = animation.export();
				},0)
			},
			onClickGetLocation(){
				const { latitude , longitude,searchResult } = this
				
				let result = searchResult.filter(el=>el.location.lat == latitude && el.location.lng == longitude)[0]
				
				if(result === undefined) {
					let uToast;
					setTimeout(()=>{
						uToast = this.$refs.uToast;
						uToast.show(loadding)
					},0)
					// 发送请求
					getLocation(latitude,longitude,res=>{
						result = res.data.result.ad_info
						result.address = res.data.result.address
						result.location.lat = latitude;
						result.location.lng = longitude
						uToast.hide()
						this.$emit('onChangeLocation',result)
						this.popupShow = false
					})
				}else{
					this.$emit('onChangeLocation',result)
					this.popupShow = false
				}
			}
		},
		watch:{
			show:{
				immediate:true,
				handler(newValue,load){
					let val = newValue == true ? 0 : -this.height
					this.createAamin(val,'animation');
					
					setTimeout(()=>{
						this.bottom = val
					},400)
					
					if(newValue){
						this.isShow = newValue
					}else{
						setTimeout(()=>{
							this.isShow = newValue
						},this.duration)
					}
				}
			}
		}
	}
</script>

 <style lang="scss">
	 .areas{
		position: absolute;
		bottom: 0;
		height: 150px;
		width: 100%;
		background-color: $uni-ba-color-ligre;
		border-top: solid 1px #cbcbcb;
		z-index: 1000000;
		display: flex;
		flex-flow: wrap;
		justify-content: space-around;
		align-items:center;

		.areas-list{
			width: calc(100% / 4);
		
			box-sizing: border-box;
			.areas-item{
				background-color: $uni-bg-color;
				height: calc((100vw / 4) - 90rpx);
				margin:0 45rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: $uni-border-radius-base;
				.iconfont{
					font-size: calc((100vw / 4) - 90rpx - 45rpx);
				}
			}
			.areas-item-text{
				display: inline-block;
				text-align: center;
				width: 100%;
				margin-top: 5px;
				font-size: $uni-font-size-sm;
				line-height: $uni-font-size-sm;
			}
		}	
			
		.areas-map{
			width: 100%;
			height: 100%;
		
		}
		.areasContent-map{
			position: relative;
			width: 100%;
			height: 100vh;
		}
		.areas-map-text{
			position: absolute;
			top: 75rpx;
			left: 30rpx;
			color: #000000;
		}
		
		.areasContent-map-navbar{
			font-size: $uni-font-size-sm;
			background-color: $uni-color-primary;
		}
		
		.areas-popup{
			position: absolute;
			height: 500rpx;
			background-color: $uni-bg-color;
			bottom: 0;
			width:100%;
			overflow: auto;
			bottom: -500rpx;
		}
		
		.areas-popup-list{
			white-space: nowrap;
			width: 100%;
			overflow: hidden;
			text-overflow: ellipsis;
			padding: 30rpx;
			box-sizing: border-box;
			border: solid 1px $uni-border-color;
		}
	 }
</style>
