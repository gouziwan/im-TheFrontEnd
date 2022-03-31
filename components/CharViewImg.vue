<template>
	<!-- 这里把他封装成一个组件是因为我们要计算他的宽度 -->
	<div class="img-div">
		<div class="loading" v-if="isupload && !getUploadErr">
			<div class="loading-offset">
				<CanvasCircularLoad :value="currentProgress / 100" :size="50"></CanvasCircularLoad>
			</div>
		</div>
		<div class="err" v-if="getUploadErr">
			<text class="iconfont icon-guanbi"></text>
		</div>
		<u--image :src="src" :width="width" :height="height" @click="onClck" ></u--image>
	</div>
</template>
<script>
	import CanvasCircularLoad from "./CanvasCircularLoad.vue"
	
	export default {
		props:{
			src:{
				type:String,
				default:''
			},
			map:{},
			item:{}
		},
		created(){
			this.getImgInfo();
			this.map.push(this.src);
		},
		mounted(){
			this.onProgressUpdate()
		},
		data(){
			return {
				width:200,
				height:200,
				isupload:false,
				currentProgress:0,
				uploadErr:false
			}
		},
		computed:{
			// 上传失败
			getUploadErr(){
				let boolean = this.item.isUploadError;
				return boolean || this.uploadErr
			}
		},
		methods:{
			onClck(e){
				this.$emit('click',this.map,this.src)
			},
			getImgInfo(){
				const { src } = this
				uni.getImageInfo({
					src,
					success:result=>{
						const { width , height } = result
						let {windowWidth , windowHeight} = uni.getSystemInfoSync();
						// 根据比例缩放
						let num  = this.saves(width,height,windowWidth,windowHeight);						
						this.width = Math.floor(width * num);
						this.height = Math.floor(height * num) - 5
					}
				})
			},
			saves(width,height,winWidth,winHeight){
				return Math.min((winWidth / 3) / width,(winHeight / 3) / height)
			},
			onProgressUpdate(){
				const { onProgressUpdate,el } = this.item
				if(onProgressUpdate == undefined || el == undefined) return
				this.isupload = true
				this.onUploadError()
				onProgressUpdate.onProgressUpdate(({progress})=>{
					this.currentProgress = progress;
					if(progress==100){
						setTimeout(()=>{
							this.isupload = false
							this.item.onProgressUpdate = undefined
						},20)
					}
				})
			},
			onUploadError(){
				let id = this.item.el.onid				
				// 上传失败
				this.PubSub.on(id,(el,err)=>{
					this.uploadErr = true
					this.isupload = false
					this.item.isUploadError=true
				})
			}
		},
		components:{
			CanvasCircularLoad
		}
	}
</script>

<style lang="scss" scoped>
	.img-div{
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
