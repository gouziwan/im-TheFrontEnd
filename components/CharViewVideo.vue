<template>
	<div class="video" :style="{
			width:width + 'px',
			height:height+'px'
		}">
		<div class="loading" v-if="isupload && !getUploadErr">
			<div class="loading-offset">
				<CanvasCircularLoad :value="cruuentPercent / 100" ></CanvasCircularLoad>
			</div>
		</div>
		<div class="err" v-if="getUploadErr">
			<text class="iconfont icon-guanbi"></text>
		</div>
		<video :src="getVideoSrc()" :style="{
			width:width + 'px',
			height:height+'px'
		}"  enable-play-gesture  
		
		:show-center-play-btn="!isupload && !getUploadErr"
		></video>
	</div>
</template>

<script>
	import CanvasCircularLoad from "./CanvasCircularLoad.vue"
	import { videoSrc } from "../Api/index.js"
	export default {
		components:{
			CanvasCircularLoad
		},
		props:{
			item:{
				type:Object,
				default:{}
			}
		},
		data(){
			return {
				width:200,
				height:200,
				valueSrc:'',
				cruuentPercent:0,
				isupload:false,
				uploadErr:false
			}
		},
		mounted(){
			this.onProgressUpdate()
		},
		computed:{
			// 上传失败
			getUploadErr(){
				let boolean = this.item.isUploadError;
				return boolean || this.uploadErr
			}
		},
		methods:{
			getVideoSrc(){
				let req = /\bblob\b:\bhttp\b/
				const { screenWidth , screenHeight} = uni.getSystemInfoSync();
				
				if(req.test(this.item.msg)){
					const { el:{height,width},msg, } = this.item;
					let saves = this.saves(width,height,screenWidth,screenHeight)
					this.width = Math.floor(width * saves)
					this.height = Math.floor(height * saves)					
					return msg
				} 
				
				try{
					let result = JSON.parse(this.item.msg);
					
					const { msg , width=200 , height = 200 } = result
					
					let saves = this.saves(width,height,screenWidth,screenHeight)
										
					this.width = Math.floor(width * saves)
					
					this.height = Math.floor(height * saves)
					
					return videoSrc + msg
				}catch(e){
					return ''
				}
			},
			saves(width,height,winWidth,winHeight){
				return Math.min((winWidth / 2) / width,(winHeight / 2) / height)
			},
			
			onProgressUpdate(){
				const {onProgressUpdate,el} = this.item
				if(onProgressUpdate == undefined || el == undefined) return		
				this.isupload = true
				// 监听错误
				this.onUploadError()
				onProgressUpdate.onProgressUpdate(({progress})=>{
					this.cruuentPercent = progress;
					if(progress == 100){
						this.isupload = false
						this.PubSub.off(this.item.id)
						this.item.onProgressUpdate = undefined
					}
				})
			},
			onUploadError(){
				let id = this.item.el.onid				
				// 上传失败
				this.PubSub.on(id,(el,err)=>{
					this.uploadErr = true
					this.isupload = false
					this.item.isUploadError = true
				})
			}
		}
	}
</script>

<style lang="scss">
	.video{
		position: relative;
		.loading{
			position: absolute;
			background-color: rgba(0,0,0,0.2);
			z-index: 1;
			width: 100%;
			height: 100%;
			.loading-offset{
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%);
			}
		}
		.err{
			background-color: rgba(0,0,0,0.4);
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			z-index: 10;
			display: flex;
			align-items: center;
			justify-content: center;
			.iconfont.icon-guanbi{
				color: red;
				font-size: 30px;
			}
		}
	}
</style>
