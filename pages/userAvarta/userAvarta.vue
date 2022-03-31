<template>
	<view class="user_avarta">
		 <u-navbar
			bgColor="#000000"
		>
			<template slot="left">
				<text class="iconfont icon-fanhui" @click="toBack"></text>
			</template>
			<template slot="center">
				<text class="user_avarta_title">
					个人头像
				</text>
			</template>
			
			<!-- #ifndef  MP -->
				<template slot="right">
					<!--小程序有胶囊挡住  -->
					<text class="iconfont icon-shenglvehao" @click="onShowPopup"></text>
				</template>
			<!-- #endif -->
		</u-navbar>
		<!-- #ifndef H5   -->
		<view class="user_content" @touchend="onTouchend" @touchstart.stop="onTouchstart">
			<u--image :src="getAvataImg"  :width="getSystem" :height="getSystem"></u--image>
		</view>
		<!-- #endif -->
		
		<!-- #ifdef H5   -->
		<view class="user_content">
			<u--image :src="getAvataImg"  :width="getSystem" :height="getSystem"></u--image>
		</view>
		<!-- #endif -->
		
		<!-- 上拉菜单 -->
		<u-action-sheet :actions="list" :show="show" safeAreaInsetBottom closeOnClickOverlay @close="onClose" @select="onSelect"></u-action-sheet>
		
		<!-- 提示 -->
		<u-toast ref="uToast"></u-toast>
		
		 <view class="container" v-if="cropperShow">
		    <view class="cropper-wrap">
		      <image-cropper
		        id="image-cropper"
		        :zoom="1"
		        :angle="0"
		        :src="src"
		        canvasBackground="red"
		        @cropped="onCropped"
				:boundDetect="true"
				disableRotate
		      />
		    </view>
		   <view class="cropper-button">
			   	<button class="cropper-button-quxiaoo" type="default" @click="cancelCropped">取消</button>
			    <button class="cropper-button-send" type="default" @click="uploadOPictures(cropperSrc)">上传图片</button>
		   </view>
		</view>
		
	</view>
</template>

<script>
	import { downAvartImg,http,uploadUserAvatar } from "../../Api/index.js"	
	import cropper from "@/components/cropper.vue"

	// 保存图片的时候提示
	const SaveImg = {
		type: 'loading',
		duration:1500000
	}
	const SaveError = {
		type:'default',
		title: '保存图片失败',
		message: '保存图片失败',
	}
	
	const SaveSuceeou = {
		type:'default',
		title:'保存图片成功',
		message:"保存图片成功",
		duration:2000
	}
	
	
	const upAvatar = {
		type:'default',
		message:'图片上传失败',
		duration:2000
	}
	
	
	const uploadAvatar = {
		type:'loading',
		message:'图片上传中。。。',
		duration:159999
	}
	
	export default{
		components:{
			'image-cropper':cropper
		},
		data(){
			return {
				list:[
					// id 1为拍照 3.保存图片 2.选择相册  取消就不用了点击会自动取消
					{
						name:'拍照',
						id:1,
					},
					{
						name:'选择相册',
						id:2,	
					},
					{
						name:'保存图片',
						id:3
					},
					{
						name:'取消',
					},
				],
				show:false,
				src:'',
				cropperShow:false,
				cropperSrc:''
			}
		},
		
		computed:{
			// 获取手机屏幕的宽度
			getSystem(){
				return  uni.getSystemInfoSync().screenWidth
			},
			// 获取设备信息
			getSystemHeight(){
				return uni.getSystemInfoSync().screenHeight
			}
			
		},
		created(){
			console.log(this.getSystem)
		},
		methods:{
			toBack(){
				uni.navigateBack({
					delta:1
				})
			},
			// 关闭
			onClose(e){
				this.show = false
			},
			onShowPopup(){
				this.show = true
			},
			onSelect(e){
				if(e.id == undefined) return 
				let id = e.id;
					// id 1为拍照 3.保存图片 2.选择相册  取消就不用了点击会自动取消
				switch(id){
					case 1:
						this.getPhotoAlbum('camera')
						break
					case 2:
						this.getPhotoAlbum('album')
						break
					case 3:
						this.saveAlbumLocally()
						break
				}
	
			},
			// 小程序用手指触摸触发事件
			onTouchend(){
				clearTimeout(this.$skmaId)
			},
			// 触发事件
			onTouchstart(){
				this.$shake(()=>{
					this.onShowPopup();
				},1000)
			},
			// 获取相册图片 或者参数
			getPhotoAlbum(str){
				uni.chooseImage({
					count:1,
					sourceType:[str],
					success:v =>{
						this.src = v.tempFilePaths[0];
						this.cropperShow = true
						// this.uploadOPictures(v.tempFilePaths[0])
					}
				})
			},
			// 保存相片到本地
			saveAlbumLocally(){
				let _this = this
				// #ifndef H5
				uni.authorize({
					scope:'scope.writePhotosAlbum',
					success: v => {
						// 下载网络图片
						// 下载的时候添加一个提示
						SaveImg.message = "保存图片中"
						this.$refs.uToast.show(SaveImg)
						uni.downloadFile({
							url:_this.getAvataImg,
							success: res => {
								// 下载成保存图片到本地相册
								uni.saveImageToPhotosAlbum({
									filePath:res.tempFilePath,
									success: v =>{
										_this.$refs.uToast.show(SaveSuceeou)
									},
									fail:e=>{
										_this.$refs.uToast.show(SaveError)
									}		
								})
							},
							// 下载失败的情况
							fail: e =>{
								this.$refs.uToast.show(SaveError)
							}
						})
						
					},
					fail: e=> {
						// 获取用当前的设置
						uni.getSetting({
						   success(res) {
							// 表示用户取消了授权
						     if(res.authSetting.value === false){
								this.$refs.uToast.show({
									type:'default',
									messgae:'用户取消了授权'
								})
							 }
						   }
						})
					}
				})
				// #endif
				// #ifdef H5
					SaveImg.message = "保存图片中"
					this.$refs.uToast.show(SaveImg)
					downAvartImg(this.userInfo.imgurl,res =>{
						if(res.data instanceof Object){
							this.$refs.uToast.show({
								type:'default',
								message:res.data.msg
							})
						}else{
							this.$refs.uToast.show(SaveSuceeou)
							window.location.replace(http +'/down/downImg?name='+this.userInfo.imgurl)		
						}
					})
				// #endif
			},
			// 将新的头像图片上传到服务器
			uploadOPictures(url){
				this.$refs.uToast.show(uploadAvatar)
				if(url ==undefined) url = this.src;
				let token = uni.getStorageSync('user_token');
				uploadUserAvatar(url,token,v => {
					let data = JSON.parse(v.data);
					if(data.code == 200){
						this.userInfo.imgurl = data.imgurl
						this.$refs.uToast.hide();
					}else{
						this.$refs.uToast.show(upAvatar)
					}
					this.cropperShow = false
				})
			},
			// 获取裁剪后的图片
			onCropped(base64){
				// #ifdef H5
				base64 = base64.split(',');
				
				let res = /\bimage\b\/(png|jpg|jpge)/;
				
				let contentType = base64[0].match(res)[0];
										
				this.base64ToBlob({b64data:base64[1] , contentType}).then(res=>{
					this.cropperSrc = res.preview
				})
				// #endif
				// 除了 h5 以为运行这条代码
				// #ifndef H5
					this.cropperSrc = base64
				// #endif
			},		
			base64ToBlob ({b64data = '', contentType = '', sliceSize = 512} = {}) {
			      return new Promise((resolve, reject) => {
			        // 使用 atob() 方法将数据解码
			        let byteCharacters = atob(b64data);
			        let byteArrays = [];
			        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
			          let slice = byteCharacters.slice(offset, offset + sliceSize);
			          let byteNumbers = [];
			          for (let i = 0; i < slice.length; i++) {
			              byteNumbers.push(slice.charCodeAt(i));
			          }
			          // 8 位无符号整数值的类型化数组。内容将初始化为 0。
			          // 如果无法分配请求数目的字节，则将引发异常。
			          byteArrays.push(new Uint8Array(byteNumbers));
			        }
			        let result = new Blob(byteArrays, {
			          type: contentType
			        })
			        result = Object.assign(result,{
			          // jartto: 这里一定要处理一下 URL.createObjectURL
			          preview: URL.createObjectURL(result),
			          name: `图片示例.png`
			        });
			        resolve(result)
			      })
			   },
			// 取消
			cancelCropped(){
				this.cropperShow = false
			}
		}
	}
	
	
	
</script>

<style lang="scss">
	.container {
	  position: absolute;
	  top: 0;
	  height: 100%;
	  width: 100%;
	}
	.cropper-wrap {
	  height: calc(100% - 96rpx);
	}
	
	.cropper-button{
		display: flex;
		justify-content: space-between;
	}
	
	.cropper-button-send{
		width: 300rpx;
	}
	
	.cropper-button-quxiaoo{
		width: 300rpx;
	}
	
	.user_avarta{
		height: 100vh;
		background-color: #000000;
	}
	.user_avarta_title{
		color: #eaeaea;
	}
	
	.iconfont.icon-fanhui,.iconfont.icon-shenglvehao{
		color: #eaeaea;
		font-size: 25px;
	}
	
	
	.user_content{
		position: absolute;
		top:50%;
		transform: translateY(-50%);
	}
</style>
